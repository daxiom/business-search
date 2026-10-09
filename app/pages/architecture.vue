<script setup lang="ts">
import rawMarkdown from '~~/docs/ARCHITECTURE.md?raw'

useSeoMeta({
  title: 'Architecture & Integration Guide | BC Registry Business Search',
  description: 'Technical architecture, security proxy pattern, and code-sharing guide for BC Business Registry search.'
})

const viewMode = ref<'rendered' | 'markdown'>('rendered')
const copiedMd = ref(false)

async function copyMarkdown() {
  try {
    await navigator.clipboard.writeText(rawMarkdown)
    copiedMd.value = true
    setTimeout(() => {
      copiedMd.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy', err)
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8 space-y-10">
    <!-- Top Action Bar -->
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
      <div class="flex items-center gap-3">
        <UButton
          to="/"
          icon="i-lucide-arrow-left"
          label="Back to Search Demo"
          color="neutral"
          variant="ghost"
          size="sm"
        />
        <UBadge
          color="primary"
          variant="subtle"
          size="sm"
        >
          Architecture.md Reference
        </UBadge>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
          <UButton
            size="xs"
            :color="viewMode === 'rendered' ? 'primary' : 'neutral'"
            :variant="viewMode === 'rendered' ? 'solid' : 'ghost'"
            label="Rendered Guide"
            icon="i-lucide-layout"
            @click="viewMode = 'rendered'"
          />
          <UButton
            size="xs"
            :color="viewMode === 'markdown' ? 'primary' : 'neutral'"
            :variant="viewMode === 'markdown' ? 'solid' : 'ghost'"
            label="Raw Markdown"
            icon="i-lucide-file-text"
            @click="viewMode = 'markdown'"
          />
        </div>

        <UButton
          :icon="copiedMd ? 'i-lucide-check' : 'i-lucide-copy'"
          :label="copiedMd ? 'Copied Markdown!' : 'Copy Markdown'"
          color="neutral"
          variant="outline"
          size="sm"
          @click="copyMarkdown"
        />

        <UModal
          title="BC Registry Search — Feature Walkthrough Video"
          description="A 51-second screen recording demonstrating quick queries, debouncing, and architecture guide."
          :ui="{ content: 'sm:max-w-3xl' }"
        >
          <UButton
            icon="i-lucide-play-circle"
            label="Watch Video Demo (51s)"
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
                  Full HD 1280x800 Screen Recording
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
      </div>
    </div>

    <!-- Rendered Guide View -->
    <div
      v-if="viewMode === 'rendered'"
      class="space-y-12"
    >
      <!-- Title & Intro -->
      <div class="space-y-3">
        <h1 class="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
          BC Registry Business Search — Architectural Guide
        </h1>
        <p class="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed">
          This document explains the architecture, security patterns, and integration guide for the <strong>BC Registry Business Search</strong> feature. Other development teams can use this reference to implement or integrate real-time registry searches into their own Nuxt or Vue applications.
        </p>
      </div>

      <!-- Section 1: Visual Architecture Diagram -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-network"
            class="w-5 h-5 text-emerald-500"
          />
          <h2 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            1. System Architecture Overview & Flow
          </h2>
        </div>

        <p class="text-sm text-neutral-600 dark:text-neutral-400">
          To comply with provincial API governance and security best practices, the client application never interacts directly with the external BC Registries Search API. All calls are mediated through a Nitro server route.
        </p>

        <!-- System Architecture Diagram Graphic -->
        <div class="relative group rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-950 shadow-md">
          <img
            src="/images/architecture-diagram.jpg"
            alt="BC Registry Business Search System Architecture Diagram"
            class="w-full h-auto object-cover max-h-[500px]"
            loading="lazy"
          >
        </div>

        <!-- Visual Flow Pipeline Cards -->
        <div class="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            <!-- Node 1: Browser Client -->
            <div class="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3 relative">
              <div class="flex items-center justify-between">
                <UBadge
                  color="primary"
                  variant="subtle"
                  size="xs"
                >
                  Step 1: Frontend Client
                </UBadge>
                <UIcon
                  name="i-lucide-laptop"
                  class="w-5 h-5 text-neutral-400"
                />
              </div>
              <h3 class="font-bold text-base text-neutral-900 dark:text-neutral-100">
                &lt;BusinessSearchDropdown /&gt;
              </h3>
              <p class="text-xs text-neutral-500 leading-relaxed">
                Powered by Nuxt UI <code>&lt;UInputMenu ignore-filter /&gt;</code>. Captures keystrokes, applies 350ms debounce buffer, and validates <code>query.length &ge; 3</code>.
              </p>
              <div class="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400">
                Emits: <code>update:modelValue</code> &amp; <code>select</code>
              </div>
            </div>

            <!-- Node 2: Nitro Proxy -->
            <div class="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-emerald-500/40 dark:border-emerald-500/30 shadow-sm space-y-3 relative">
              <div class="flex items-center justify-between">
                <UBadge
                  color="success"
                  variant="solid"
                  size="xs"
                >
                  Step 2: Server Proxy
                </UBadge>
                <UIcon
                  name="i-lucide-shield-check"
                  class="w-5 h-5 text-emerald-500"
                />
              </div>
              <h3 class="font-bold text-base text-neutral-900 dark:text-neutral-100">
                Nitro Endpoint (/api/search/businesses)
              </h3>
              <p class="text-xs text-neutral-500 leading-relaxed">
                Reads <code>Account-Id</code> and <code>X-Apikey</code> from secure <code>runtimeConfig</code>. Builds verified OAS v2 payload and forwards request upstream.
              </p>
              <div class="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Headers Injected: Account-Id, X-Apikey, Accept
              </div>
            </div>

            <!-- Node 3: Upstream BC Gov -->
            <div class="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3 relative">
              <div class="flex items-center justify-between">
                <UBadge
                  color="neutral"
                  variant="subtle"
                  size="xs"
                >
                  Step 3: Provincial Gateway
                </UBadge>
                <UIcon
                  name="i-lucide-building"
                  class="w-5 h-5 text-neutral-400"
                />
              </div>
              <h3 class="font-bold text-base text-neutral-900 dark:text-neutral-100">
                BC Registries Search API v2
              </h3>
              <p class="text-xs text-neutral-500 leading-relaxed">
                Apigee Gateway validates credentials and queries SOLR index. Returns <code>searchResults.results</code> with business entity metadata.
              </p>
              <div class="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400">
                Endpoint: <code>/registry-search/api/v2/search/businesses</code>
              </div>
            </div>
          </div>

          <!-- Flow Summary Banner -->
          <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
            <UIcon
              name="i-lucide-info"
              class="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
            />
            <div>
              <span class="font-bold">Credential Protection Guarantee:</span> The API key and Account ID are never bundled into client JavaScript. If an attacker inspects browser network traffic, they only see calls to the internal <code>/api/search/businesses</code> endpoint.
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Step-by-Step Sequence -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-git-commit"
            class="w-5 h-5 text-emerald-500"
          />
          <h2 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            2. Request & Response Lifecycle
          </h2>
        </div>

        <div class="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
          <table class="w-full text-left text-xs">
            <thead class="bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 font-semibold border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th class="p-3 w-16">
                  Step
                </th>
                <th class="p-3">
                  Component / Actor
                </th>
                <th class="p-3">
                  Action Description
                </th>
                <th class="p-3">
                  Payload / Protocol
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-600 dark:text-neutral-400">
              <tr>
                <td class="p-3 font-bold text-emerald-600">
                  01
                </td>
                <td class="p-3 font-semibold text-neutral-800 dark:text-neutral-200">
                  User / UI
                </td>
                <td class="p-3">
                  User types "DAX" into &lt;UInputMenu&gt;
                </td>
                <td class="p-3 font-mono text-[11px]">
                  searchTerm.value = "DAX"
                </td>
              </tr>
              <tr>
                <td class="p-3 font-bold text-emerald-600">
                  02
                </td>
                <td class="p-3 font-semibold text-neutral-800 dark:text-neutral-200">
                  VueUse refDebounced
                </td>
                <td class="p-3">
                  Delays fetch 350ms to prevent server spamming
                </td>
                <td class="p-3 font-mono text-[11px]">
                  debounce: 350ms buffer
                </td>
              </tr>
              <tr>
                <td class="p-3 font-bold text-emerald-600">
                  03
                </td>
                <td class="p-3 font-semibold text-neutral-800 dark:text-neutral-200">
                  Browser → Nitro Proxy
                </td>
                <td class="p-3">
                  Internal client fetch to local Nuxt server
                </td>
                <td class="p-3 font-mono text-[11px]">
                  POST /api/search/businesses { "query": "DAX" }
                </td>
              </tr>
              <tr>
                <td class="p-3 font-bold text-emerald-600">
                  04
                </td>
                <td class="p-3 font-semibold text-neutral-800 dark:text-neutral-200">
                  Nitro Proxy → BC Gov API
                </td>
                <td class="p-3">
                  Server forwards query with secret headers
                </td>
                <td class="p-3 font-mono text-[11px]">
                  Account-Id, X-Apikey, Accept: application/json
                </td>
              </tr>
              <tr>
                <td class="p-3 font-bold text-emerald-600">
                  05
                </td>
                <td class="p-3 font-semibold text-neutral-800 dark:text-neutral-200">
                  BC Gov API → Nitro Proxy
                </td>
                <td class="p-3">
                  Returns SOLR matching businesses and facet counts
                </td>
                <td class="p-3 font-mono text-[11px]">
                  200 OK { searchResults: { results: [...] } }
                </td>
              </tr>
              <tr>
                <td class="p-3 font-bold text-emerald-600">
                  06
                </td>
                <td class="p-3 font-semibold text-neutral-800 dark:text-neutral-200">
                  Nitro Proxy → UI Dropdown
                </td>
                <td class="p-3">
                  Formats results array; dropdown renders options
                </td>
                <td class="p-3 font-mono text-[11px]">
                  { totalResults: 21, results: [...], source: "live" }
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 3: Verified Headers & Upstream Payload -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-code-2"
            class="w-5 h-5 text-emerald-500"
          />
          <h2 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            3. Verified Upstream Headers & Payload Specifications
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
            <h3 class="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              Required Headers
            </h3>
            <div class="p-3 rounded-lg bg-neutral-950 font-mono text-xs text-neutral-300 space-y-1">
              <div><span class="text-neutral-500">Account-Id:</span>  &lt;YOUR_ACCOUNT_ID&gt;</div>
              <div><span class="text-neutral-500">X-Apikey:</span> &lt;YOUR_API_KEY&gt;</div>
              <div><span class="text-neutral-500">Content-Type:</span> application/json</div>
              <div><span class="text-emerald-400">Accept:</span> application/json <span class="text-neutral-500 text-[10px]">(Mandatory)</span></div>
            </div>
            <p class="text-[11px] text-neutral-500">
              The <code>Accept: application/json</code> header is mandatory for BC Gov Apigee Gateway; without it, the server rejects requests with 401/406 errors.
            </p>
          </div>

          <div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
            <h3 class="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              Verified Payload Structure
            </h3>
            <div class="p-3 rounded-lg bg-neutral-950 font-mono text-xs text-neutral-300">
              <pre v-pre><code>{
  "query": { "value": "DAX", "name": "", "identifier": "", "bn": "" },
  "categories": {
    "legalType": ["[\"BC\", \"BEN\", \"CP\"]"],
    "status": ["[\"ACTIVE\"]"]
  },
  "rows": 10,
  "start": 0
}</code></pre>
            </div>
            <p class="text-[11px] text-neutral-500">
              <code>categories</code> requires stringified JSON arrays. <code>start: 0</code> ensures 0-indexed pagination without skipping record 1.
            </p>
          </div>
        </div>
      </div>

      <!-- Section 4: Quick Crib Guide -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-copy"
            class="w-5 h-5 text-emerald-500"
          />
          <h2 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            4. Quick Start Checklist for Other Teams
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
            <span class="font-bold text-neutral-800 dark:text-neutral-200">1. Install Dependencies</span>
            <pre class="bg-neutral-100 dark:bg-neutral-800 p-2.5 rounded font-mono text-neutral-700 dark:text-neutral-300">pnpm add @nuxt/ui @vueuse/core</pre>
          </div>

          <div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
            <span class="font-bold text-neutral-800 dark:text-neutral-200">2. Configure nuxt.config.ts</span>
            <pre class="bg-neutral-100 dark:bg-neutral-800 p-2.5 rounded font-mono text-neutral-700 dark:text-neutral-300">runtimeConfig: {
  bcRegistryApiKey: process.env.BC_REGISTRY_API_KEY || '',
  bcRegistryAccountId: process.env.BC_REGISTRY_ACCOUNT_ID || '',
  bcRegistryBaseUrl: 'https://sandbox.api.connect.gov.bc.ca'
}</pre>
          </div>

          <div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
            <span class="font-bold text-neutral-800 dark:text-neutral-200">3. Copy 3 Core Files</span>
            <ul class="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400">
              <li><code>shared/types/business.ts</code></li>
              <li><code>server/api/search/businesses.post.ts</code></li>
              <li><code>app/components/BusinessSearchDropdown.vue</code></li>
            </ul>
          </div>

          <div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
            <span class="font-bold text-neutral-800 dark:text-neutral-200">4. Use in Any Template</span>
            <pre class="bg-neutral-100 dark:bg-neutral-800 p-2.5 rounded font-mono text-neutral-700 dark:text-neutral-300">&lt;BusinessSearchDropdown
  v-model="selectedCompany"
  @select="(item) => onSelect(item)"
/&gt;</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Raw Markdown View -->
    <div
      v-else
      class="space-y-4"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs text-neutral-500 font-mono">docs/ARCHITECTURE.md</span>
        <UButton
          :icon="copiedMd ? 'i-lucide-check' : 'i-lucide-copy'"
          :label="copiedMd ? 'Copied to Clipboard' : 'Copy Full Markdown'"
          color="neutral"
          variant="subtle"
          size="xs"
          @click="copyMarkdown"
        />
      </div>

      <div class="p-6 rounded-xl bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800 max-h-[75vh]">
        <pre class="whitespace-pre-wrap"><code>{{ rawMarkdown }}</code></pre>
      </div>
    </div>
  </div>
</template>
