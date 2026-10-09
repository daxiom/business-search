<script setup lang="ts">
import type { BusinessSearchResult } from '~~/shared/types/business'

const selectedBusiness = ref<BusinessSearchResult | undefined>(undefined)
const dropdownRef = ref<{ search: (query: string) => void, searchTerm: string } | null>(null)
const copied = ref(false)

const quickSearches = [
  { label: 'DAX', query: 'DAX' },
  { label: 'KYLE', query: 'KYLE' },
  { label: 'PACIFIC', query: 'PACIFIC' },
  { label: 'BC1255196', query: 'BC1255196' }
]

function applyQuickSearch(query: string) {
  if (dropdownRef.value) {
    dropdownRef.value.search(query)
  }
}

async function copyIdentifier(id: string) {
  try {
    await navigator.clipboard.writeText(id)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy to clipboard', err)
  }
}

const architectureTabs = [
  {
    label: 'Architecture Diagram & Flow',
    icon: 'i-lucide-git-branch',
    value: 'diagram'
  },
  {
    label: 'Nitro Server Proxy',
    icon: 'i-lucide-shield-check',
    value: 'proxy'
  },
  {
    label: 'Vue Component',
    icon: 'i-lucide-component',
    value: 'component'
  },
  {
    label: 'How to Crib This Code',
    icon: 'i-lucide-copy',
    value: 'crib'
  }
]
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8 space-y-12">
    <!-- Hero Header -->
    <div class="text-center space-y-3">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
        <UIcon
          name="i-lucide-sparkles"
          class="w-3.5 h-3.5"
        />
        Production Reference Architecture · BC Registries Search API v2
      </div>

      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
        BC Business Registry Search
      </h1>

      <p class="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
        A debounced autocomplete dropdown for looking up British Columbia businesses. All API calls are securely proxied through a Nitro server route to isolate authentication secrets.
      </p>

      <!-- Video Demo & Architecture CTAs -->
      <div class="flex flex-wrap items-center justify-center gap-2 pt-1">
        <UModal
          title="BC Registry Search — Feature & Architecture Walkthrough"
          description="A 51-second screen recording showing quick queries, live debounced search, tabs, and the architecture guide."
          :ui="{ content: 'sm:max-w-3xl' }"
        >
          <UButton
            icon="i-lucide-play-circle"
            label="Watch Demo Video (51s)"
            color="primary"
            variant="solid"
            size="sm"
          />

          <template #body>
            <div class="space-y-3">
              <div class="rounded-xl overflow-hidden bg-black border border-neutral-800 aspect-video flex items-center justify-center shadow-lg">
                <video
                  controls
                  autoplay
                  loop
                  playsinline
                  class="w-full h-full object-contain"
                  src="/videos/business-search-demo.webm"
                />
              </div>

              <div class="flex items-center justify-between text-xs text-neutral-500 pt-1">
                <span class="flex items-center gap-1.5">
                  <UIcon
                    name="i-lucide-sparkles"
                    class="w-3.5 h-3.5 text-emerald-500"
                  />
                  Live sandbox recording · Full HD 1280x800
                </span>
                <UButton
                  to="/videos/business-search-demo.webm"
                  target="_blank"
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  icon="i-lucide-external-link"
                  label="Open Raw Video File"
                />
              </div>
            </div>
          </template>
        </UModal>

        <UButton
          to="/architecture"
          icon="i-lucide-book-open"
          label="Architecture Guide"
          color="neutral"
          variant="outline"
          size="sm"
        />
      </div>
    </div>

    <!-- Live Search Sandbox Card -->
    <UCard class="shadow-sm border border-neutral-200 dark:border-neutral-800">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-search"
              class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
            />
            <h2 class="font-semibold text-base text-neutral-900 dark:text-neutral-100">
              Interactive Component Sandbox
            </h2>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs text-neutral-500 hidden sm:inline">Try quick queries:</span>
            <div class="flex gap-1">
              <UButton
                v-for="item in quickSearches"
                :key="item.label"
                size="xs"
                color="neutral"
                variant="subtle"
                @click="applyQuickSearch(item.query)"
              >
                {{ item.label }}
              </UButton>
            </div>
          </div>
        </div>
      </template>

      <div class="space-y-6 py-2">
        <!-- Search Dropdown Component -->
        <div class="max-w-2xl mx-auto">
          <label class="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Search Business Name or Registration ID (min. 3 characters)
          </label>
          <BusinessSearchDropdown
            ref="dropdownRef"
            v-model="selectedBusiness"
            placeholder="Type a company name or identifier (e.g. Kyle, Pacific, BC019)..."
          />
        </div>

        <!-- Selected Business Result Card -->
        <div
          v-if="selectedBusiness"
          class="max-w-2xl mx-auto pt-4"
        >
          <div class="rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 space-y-4">
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                    {{ selectedBusiness.name }}
                  </h3>
                  <UBadge
                    :color="selectedBusiness.status === 'ACTIVE' ? 'success' : 'neutral'"
                    variant="solid"
                    size="xs"
                  >
                    {{ selectedBusiness.status }}
                  </UBadge>
                </div>
                <p class="text-xs text-neutral-500 dark:text-neutral-400">
                  Business Entity Profile
                </p>
              </div>

              <UButton
                icon="i-lucide-x"
                color="neutral"
                variant="ghost"
                size="xs"
                aria-label="Clear selection"
                @click="selectedBusiness = undefined"
              />
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div class="p-2.5 rounded-lg bg-white/70 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800">
                <span class="text-neutral-500 block">Identifier</span>
                <div class="flex items-center gap-1 font-mono font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                  <span>{{ selectedBusiness.identifier }}</span>
                  <UButton
                    :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                    variant="ghost"
                    color="neutral"
                    size="xs"
                    class="p-0.5 h-auto text-neutral-400"
                    @click="copyIdentifier(selectedBusiness.identifier)"
                  />
                </div>
              </div>

              <div class="p-2.5 rounded-lg bg-white/70 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800">
                <span class="text-neutral-500 block">Legal Type</span>
                <span class="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5 block">
                  {{ selectedBusiness.legalType }}
                </span>
              </div>

              <div class="p-2.5 rounded-lg bg-white/70 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800">
                <span class="text-neutral-500 block">Good Standing</span>
                <span
                  class="font-semibold mt-0.5 block"
                  :class="selectedBusiness.goodStanding ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'"
                >
                  {{ selectedBusiness.goodStanding ? 'Yes (Compliant)' : 'No / N/A' }}
                </span>
              </div>

              <div class="p-2.5 rounded-lg bg-white/70 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800">
                <span class="text-neutral-500 block">Modernized</span>
                <span class="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5 block">
                  {{ selectedBusiness.modernized ? 'Modern System' : 'Legacy System' }}
                </span>
              </div>
            </div>

            <!-- Business Number & Relevance -->
            <div
              v-if="selectedBusiness.bn || selectedBusiness.score"
              class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60 text-xs text-neutral-500"
            >
              <div
                v-if="selectedBusiness.bn"
                class="flex items-center gap-1"
              >
                <span>CRA Business Number:</span>
                <span class="font-mono font-medium text-neutral-700 dark:text-neutral-300">{{ selectedBusiness.bn }}</span>
              </div>
              <div
                v-if="selectedBusiness.score"
                class="flex items-center gap-1"
              >
                <span>SOLR Relevance Score:</span>
                <span class="font-mono font-medium text-neutral-700 dark:text-neutral-300">{{ selectedBusiness.score.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Architecture & Integration Reference Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-neutral-900 dark:text-neutral-50">
            Architecture & Integration Blueprint
          </h2>
          <p class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            A comprehensive reference for other teams looking to integrate BC Registry Business Search.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <UModal
            title="Feature Walkthrough & Architecture Demo"
            description="51-second screen recording demonstrating quick queries, debouncing, and architecture guide."
            :ui="{ content: 'sm:max-w-3xl' }"
          >
            <UButton
              icon="i-lucide-play-circle"
              label="Watch Walkthrough (51s)"
              color="primary"
              variant="subtle"
              size="sm"
            />

            <template #body>
              <div class="space-y-3">
                <div class="rounded-xl overflow-hidden bg-black border border-neutral-800 aspect-video flex items-center justify-center shadow-lg">
                  <video
                    controls
                    autoplay
                    loop
                    playsinline
                    class="w-full h-full object-contain"
                    src="/videos/business-search-demo.webm"
                  />
                </div>
                <div class="flex items-center justify-between text-xs text-neutral-500 pt-1">
                  <span class="flex items-center gap-1.5">
                    <UIcon
                      name="i-lucide-sparkles"
                      class="w-3.5 h-3.5 text-emerald-500"
                    />
                    Full HD Screen Recording (51 seconds)
                  </span>
                  <UButton
                    to="/videos/business-search-demo.webm"
                    target="_blank"
                    variant="ghost"
                    color="neutral"
                    size="xs"
                    icon="i-lucide-external-link"
                    label="Open Raw Video File"
                  />
                </div>
              </div>
            </template>
          </UModal>

          <UButton
            to="/architecture"
            icon="i-lucide-file-text"
            label="View Architecture.md"
            color="neutral"
            variant="outline"
            size="sm"
          />
        </div>
      </div>

      <UTabs
        :items="architectureTabs"
        :unmount-on-hide="false"
        class="w-full"
      >
        <template #content="{ item }">
          <!-- Tab 1: Architecture Diagram & Flow -->
          <div
            v-if="item.value === 'diagram'"
            class="space-y-6 py-4"
          >
            <!-- System Architecture Diagram Graphic -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs text-neutral-500">
                <span class="font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <UIcon
                    name="i-lucide-network"
                    class="w-4 h-4 text-emerald-500"
                  />
                  End-to-End System Architecture Diagram
                </span>
                <UButton
                  to="/images/architecture-diagram.jpg"
                  target="_blank"
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  icon="i-lucide-maximize-2"
                  label="Open Fullscreen"
                />
              </div>

              <div class="relative group rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-950 shadow-md">
                <img
                  src="/images/architecture-diagram.jpg"
                  alt="BC Registry Business Search System Architecture Diagram"
                  class="w-full h-auto object-cover max-h-[460px] transition duration-300 group-hover:scale-[1.01]"
                  loading="lazy"
                >
              </div>
            </div>

            <!-- Visual Flow Stages -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 space-y-2">
                <div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 class="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                  User Keystroke Input
                </h3>
                <p class="text-xs text-neutral-500 leading-relaxed">
                  &lt;UInputMenu&gt; captures user typing into a reactive <code class="font-mono">searchTerm</code>. No network requests are fired immediately.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 space-y-2">
                <div class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h3 class="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                  VueUse Debounce
                </h3>
                <p class="text-xs text-neutral-500 leading-relaxed">
                  `refDebounced` buffers keystrokes for 350ms and checks minimum length (&ge; 3 characters) before triggering.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 space-y-2">
                <div class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h3 class="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                  Nitro Server Proxy
                </h3>
                <p class="text-xs text-neutral-500 leading-relaxed">
                  Calls internal `/api/search/businesses`. Nitro injects secret `Account-Id` and `x-apikey` from `runtimeConfig`.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 space-y-2">
                <div class="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <h3 class="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                  BC Gov API v2
                </h3>
                <p class="text-xs text-neutral-500 leading-relaxed">
                  Upstream returns `{ searchResults: { results: [...] } }`. Nitro formats data and feeds the dropdown options.
                </p>
              </div>
            </div>

            <!-- Security & Design Note Callout -->
            <div class="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-2">
              <div class="flex items-center gap-2 font-semibold text-neutral-800 dark:text-neutral-200">
                <UIcon
                  name="i-lucide-shield-alert"
                  class="w-4 h-4 text-emerald-500"
                />
                <span>Why Direct Client Calls to BC Gov APIs are Forbidden</span>
              </div>
              <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Calling BC Registries API directly from the browser would expose the provincial <code class="font-mono bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded">x-apikey</code> and <code class="font-mono bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded">Account-Id</code> in client JavaScript and network inspector. Proxied execution via Nitro ensures API keys remain strictly confined to the server environment.
              </p>
            </div>

            <!-- Dedicated Page Link Banner -->
            <div class="flex items-center justify-between p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 text-xs">
              <div class="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <UIcon
                  name="i-lucide-book-open"
                  class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0"
                />
                <span>Want to see full architecture specs, data tables, and copy-paste files?</span>
              </div>
              <UButton
                to="/architecture"
                size="xs"
                color="primary"
                variant="subtle"
                icon="i-lucide-arrow-right"
                label="Open Architecture Guide"
              />
            </div>
          </div>

          <!-- Tab 2: Nitro Server Proxy -->
          <div
            v-else-if="item.value === 'proxy'"
            class="space-y-4 py-4"
          >
            <div class="text-xs text-neutral-500">
              Located at: <code class="font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-800 dark:text-neutral-200">server/api/search/businesses.post.ts</code>
            </div>

            <div class="p-4 rounded-xl bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800">
              <pre v-pre><code>// 1. Validate incoming client query
const body = await readBody(event)
const query = body?.query?.trim()
if (!query || query.length &lt; 3) return { totalResults: 0, results: [] }

// 2. Load secure credentials from server environment
const config = useRuntimeConfig(event)
const apiKey = config.bcRegistryApiKey
const accountId = config.bcRegistryAccountId
const baseUrl = config.bcRegistryBaseUrl

// 3. Forward request with required headers & structured categories
const response = await $fetch(`${baseUrl}/registry-search/api/v2/search/businesses`, {
  method: 'POST',
  headers: {
    'Account-Id': accountId,
    'x-apikey': apiKey,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: {
    query: { value: query, name: '', identifier: '', bn: '' },
    categories: {
      legalType: ['[\"BC\", \"BEN\", \"CP\"]'],
      status: ['[\"ACTIVE\"]']
    },
    rows: 10,
    start: 0
  }
})

// 4. Return formatted response to the client
return {
  totalResults: response.searchResults.totalResults,
  results: response.searchResults.results
}</code></pre>
            </div>
          </div>

          <!-- Tab 3: Vue Component -->
          <div
            v-else-if="item.value === 'component'"
            class="space-y-4 py-4"
          >
            <div class="text-xs text-neutral-500">
              Located at: <code class="font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-800 dark:text-neutral-200">app/components/BusinessSearchDropdown.vue</code>
            </div>

            <div class="p-4 rounded-xl bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800">
              <pre v-pre><code>&lt;!-- Using Nuxt UI UInputMenu with ignore-filter for remote search --&gt;
&lt;UInputMenu
  v-model="selectedBusiness"
  v-model:search-term="searchTerm"
  :items="items"
  :loading="isLoading"
  ignore-filter
  label-key="name"
  icon="i-lucide-search"
  placeholder="Search BC business registry..."
&gt;
  &lt;!-- Custom dropdown item display --&gt;
  &lt;template #item-label="{ item }"&gt;
    &lt;div class="flex flex-col gap-1 py-1"&gt;
      &lt;div class="flex items-center justify-between"&gt;
        &lt;span class="font-medium"&gt;{{ item.name }}&lt;/span&gt;
        &lt;UBadge :color="item.status === 'ACTIVE' ? 'success' : 'neutral'" size="xs"&gt;
          {{ item.status }}
        &lt;/UBadge&gt;
      &lt;/div&gt;
      &lt;span class="text-xs text-neutral-500"&gt;
        {{ item.identifier }} · {{ item.legalType }}
      &lt;/span&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/UInputMenu&gt;</code></pre>
            </div>
          </div>

          <!-- Tab 4: How to Crib This Code -->
          <div
            v-else-if="item.value === 'crib'"
            class="space-y-4 py-4 text-xs"
          >
            <h3 class="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              Copy-and-Paste Integration Guide for Other Teams
            </h3>

            <div class="space-y-3">
              <div class="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 space-y-1">
                <span class="font-semibold text-neutral-800 dark:text-neutral-200">Step 1: Install Dependencies</span>
                <p class="text-neutral-500 font-mono bg-neutral-100 dark:bg-neutral-800 p-2 rounded mt-1">
                  pnpm add @nuxt/ui @vueuse/core
                </p>
              </div>

              <div class="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 space-y-1">
                <span class="font-semibold text-neutral-800 dark:text-neutral-200">Step 2: Add Runtime Configuration in nuxt.config.ts</span>
                <pre class="text-neutral-500 font-mono bg-neutral-100 dark:bg-neutral-800 p-2 rounded mt-1 overflow-x-auto"><code>runtimeConfig: {
  bcRegistryApiKey: process.env.BC_REGISTRY_API_KEY || '',
  bcRegistryAccountId: process.env.BC_REGISTRY_ACCOUNT_ID || '',
  bcRegistryBaseUrl: process.env.BC_REGISTRY_BASE_URL || 'https://sandbox.api.connect.gov.bc.ca'
}</code></pre>
              </div>

              <div class="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 space-y-1">
                <span class="font-semibold text-neutral-800 dark:text-neutral-200">Step 3: Copy Three Core Files</span>
                <ul class="list-disc list-inside text-neutral-500 space-y-1 mt-1">
                  <li><code class="font-mono text-neutral-700 dark:text-neutral-300">shared/types/business.ts</code> (Data contracts)</li>
                  <li><code class="font-mono text-neutral-700 dark:text-neutral-300">server/api/search/businesses.post.ts</code> (Nitro secure proxy)</li>
                  <li><code class="font-mono text-neutral-700 dark:text-neutral-300">app/components/BusinessSearchDropdown.vue</code> (Dropdown UI)</li>
                </ul>
              </div>

              <div class="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 space-y-1">
                <span class="font-semibold text-neutral-800 dark:text-neutral-200">Step 4: Use Directly in Any Vue Template</span>
                <pre class="text-neutral-500 font-mono bg-neutral-100 dark:bg-neutral-800 p-2 rounded mt-1"><code>&lt;BusinessSearchDropdown v-model="selectedCompany" @select="handleSelected" /&gt;</code></pre>
              </div>
            </div>
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>
