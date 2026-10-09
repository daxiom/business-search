<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import type { BusinessSearchResult, BusinessSearchResponse } from '~~/shared/types/business'

const props = withDefaults(
  defineProps<{
    modelValue?: BusinessSearchResult
    placeholder?: string
    minLength?: number
    debounceMs?: number
    disabled?: boolean
  }>(),
  {
    modelValue: undefined,
    placeholder: 'Search BC business registry (e.g. Kyle, Pacific, BC0195)...',
    minLength: 3,
    debounceMs: 350,
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: BusinessSearchResult | undefined]
  'select': [value: BusinessSearchResult]
  'error': [error: Error]
}>()

const searchTerm = ref('')
const isOpen = ref(false)
const debouncedQuery = refDebounced(searchTerm, props.debounceMs)
const items = ref<BusinessSearchResult[]>([])
const isLoading = ref(false)
const dataSource = ref<'live' | 'mock' | null>(null)
const searchError = ref<string | null>(null)
const inputMenuRef = ref<{ inputRef: HTMLInputElement | null } | null>(null)

const selectedBusiness = computed({
  get: () => props.modelValue ?? undefined,
  set: (val: BusinessSearchResult | undefined) => {
    emit('update:modelValue', val)
    if (val) {
      emit('select', val)
    }
  }
})

let activeRequestId = 0

async function executeSearch(rawQuery: string) {
  const query = rawQuery?.trim() || ''

  if (query.length < props.minLength) {
    items.value = []
    isLoading.value = false
    searchError.value = null
    return
  }

  const requestId = ++activeRequestId
  isLoading.value = true
  searchError.value = null

  try {
    const response = await $fetch<BusinessSearchResponse>('/api/search/businesses', {
      method: 'POST',
      body: { query }
    })

    // Discard stale out-of-order response
    if (requestId !== activeRequestId) return

    items.value = response.results || []
    dataSource.value = response.source || null
    if (items.value.length > 0) {
      isOpen.value = true
    }
  } catch (err: unknown) {
    if (requestId !== activeRequestId) return
    const errorObj = err as { statusMessage?: string, message?: string }
    console.error('[BusinessSearchDropdown] Search failed:', errorObj)
    searchError.value = errorObj?.statusMessage || errorObj?.message || 'Search request failed'
    items.value = []
    emit('error', err as Error)
  } finally {
    if (requestId === activeRequestId) {
      isLoading.value = false
    }
  }
}

watch(debouncedQuery, (newQuery) => {
  executeSearch(newQuery)
})

function search(query: string) {
  selectedBusiness.value = undefined
  searchTerm.value = query
  isOpen.value = true
  nextTick(() => {
    inputMenuRef.value?.inputRef?.focus()
  })
  executeSearch(query)
}

defineExpose({
  search,
  searchTerm,
  isOpen,
  items,
  isLoading,
  dataSource,
  searchError
})
</script>

<template>
  <div class="w-full">
    <UInputMenu
      ref="inputMenuRef"
      v-model="selectedBusiness"
      v-model:search-term="searchTerm"
      v-model:open="isOpen"
      :items="items"
      :loading="isLoading"
      :disabled="disabled"
      ignore-filter
      label-key="name"
      icon="i-lucide-search"
      :placeholder="placeholder"
      size="lg"
      class="w-full"
    >
      <!-- Custom item label inside the dropdown menu -->
      <template #item-label="{ item }">
        <div class="flex flex-col gap-1 py-1 w-full text-left">
          <div class="flex items-center justify-between gap-2">
            <span class="font-medium text-sm text-neutral-900 dark:text-neutral-100 truncate">
              {{ item.name }}
            </span>
            <div class="flex items-center gap-1.5 shrink-0">
              <UBadge
                :color="item.status === 'ACTIVE' ? 'success' : 'neutral'"
                variant="subtle"
                size="xs"
              >
                {{ item.status }}
              </UBadge>
              <UBadge
                color="primary"
                variant="outline"
                size="xs"
              >
                {{ item.legalType }}
              </UBadge>
            </div>
          </div>

          <div class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span class="font-mono">{{ item.identifier }}</span>
            <span v-if="item.bn">· BN: <span class="font-mono">{{ item.bn }}</span></span>
            <span
              v-if="item.goodStanding !== undefined"
              :class="item.goodStanding ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'"
            >
              · {{ item.goodStanding ? 'Good Standing' : 'Not in Good Standing' }}
            </span>
          </div>
        </div>
      </template>

      <!-- Empty state when no results are found -->
      <template #empty>
        <div class="py-4 px-3 text-center text-sm text-neutral-500 dark:text-neutral-400">
          <div
            v-if="searchTerm.trim().length < minLength"
            class="flex flex-col items-center gap-1"
          >
            <UIcon
              name="i-lucide-info"
              class="w-5 h-5 text-neutral-400"
            />
            <span>Type at least {{ minLength }} characters to search the registry</span>
          </div>
          <div
            v-else-if="searchError"
            class="flex flex-col items-center gap-1 text-red-500"
          >
            <UIcon
              name="i-lucide-alert-circle"
              class="w-5 h-5"
            />
            <span>{{ searchError }}</span>
          </div>
          <div
            v-else
            class="flex flex-col items-center gap-1"
          >
            <UIcon
              name="i-lucide-building"
              class="w-5 h-5 text-neutral-400"
            />
            <span>No businesses found matching "{{ searchTerm.trim() }}"</span>
          </div>
        </div>
      </template>
    </UInputMenu>

    <!-- Source badge indicator below input -->
    <div
      v-if="dataSource"
      class="mt-1.5 flex items-center justify-between text-xs px-1 text-neutral-400"
    >
      <div class="flex items-center gap-1.5">
        <span
          class="w-2 h-2 rounded-full"
          :class="dataSource === 'live' ? 'bg-emerald-500' : 'bg-amber-500'"
        />
        <span>Source: {{ dataSource === 'live' ? 'BC Gov Sandbox API' : 'Demo Mock Mode (Configure .env for live)' }}</span>
      </div>
      <span v-if="items.length > 0">{{ items.length }} result{{ items.length === 1 ? '' : 's' }}</span>
    </div>
  </div>
</template>
