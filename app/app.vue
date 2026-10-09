<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'BC Registry Business Search | Nuxt 4 Architecture Showcase'
const description = 'A production-grade, secure reference implementation of real-time BC Business Registry search with Nitro proxying and Nuxt UI.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-2 focus-visible:outline-3 outline-primary/25 rounded-md p-1 -ms-1"
        >
          <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
            <UIcon
              name="i-lucide-building-2"
              class="w-5 h-5"
            />
          </div>
          <span class="font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">
            BC Registries
          </span>
        </NuxtLink>

        <UBadge
          color="primary"
          variant="subtle"
          size="xs"
        >
          Search API v2
        </UBadge>
      </template>

      <template #right>
        <UButton
          to="/architecture"
          icon="i-lucide-book-open"
          label="Architecture Guide"
          color="neutral"
          variant="ghost"
          size="sm"
        />

        <UColorModeButton />

        <UButton
          to="https://developer.api.bcregistry.gov.bc.ca/"
          target="_blank"
          icon="i-lucide-external-link"
          label="BC Dev Portal"
          color="neutral"
          variant="ghost"
          size="sm"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator />

    <UFooter>
      <template #left>
        <p class="text-xs text-neutral-500">
          BC Business Registry Search Reference Implementation • Powered by Nuxt 4 & Nuxt UI
        </p>
      </template>

      <template #right>
        <span class="text-xs text-neutral-400">
          Service BC Connect API v2.2.0
        </span>
      </template>
    </UFooter>
  </UApp>
</template>
