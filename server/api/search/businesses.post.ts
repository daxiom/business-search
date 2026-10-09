import type {
  BusinessSearchRequestBody,
  BusinessSearchResponse,
  BusinessSearchResult
} from '~~/shared/types/business'

// Representative sample dataset matching BC Registry OAS schema for uncredentialed development & demonstration
const MOCK_BUSINESSES: BusinessSearchResult[] = [
  {
    identifier: 'BC0809115',
    name: 'DAX AIR ENTERPRISES INC.',
    legalType: 'BC',
    status: 'ACTIVE',
    bn: '123456789BC0001',
    goodStanding: true,
    modernized: false,
    score: 126.58
  },
  {
    identifier: 'BC0195391',
    name: 'KYLE ELECTRIC LTD.',
    legalType: 'BC',
    status: 'ACTIVE',
    bn: '123456789BC0001',
    goodStanding: true,
    modernized: false,
    score: 95.93
  },
  {
    identifier: 'BC0602833',
    name: 'KYLE ENTERPRISES LTD.',
    legalType: 'BC',
    status: 'ACTIVE',
    bn: '987654321BC0001',
    goodStanding: true,
    modernized: true,
    score: 95.93
  },
  {
    identifier: 'BC0103657',
    name: 'KYLE HOLDINGS LTD.',
    legalType: 'BC',
    status: 'ACTIVE',
    bn: '112233445BC0001',
    goodStanding: false,
    modernized: false,
    score: 95.93
  },
  {
    identifier: 'CP0002144',
    name: 'PACIFIC CLEAN ENERGY COOPERATIVE',
    legalType: 'CP',
    status: 'ACTIVE',
    bn: '445566778BC0001',
    goodStanding: true,
    modernized: true,
    score: 89.4
  },
  {
    identifier: 'BEN0072447',
    name: 'VANCOUVER SOCIAL IMPACT BENEFIT COMPANY',
    legalType: 'BEN',
    status: 'ACTIVE',
    bn: '556677889BC0001',
    goodStanding: true,
    modernized: true,
    score: 87.1
  },
  {
    identifier: 'BC0481924',
    name: 'PACIFIC WAVE TECHNOLOGIES LTD.',
    legalType: 'BC',
    status: 'ACTIVE',
    bn: '667788990BC0001',
    goodStanding: true,
    modernized: false,
    score: 82.5
  },
  {
    identifier: 'BC0360244',
    name: 'ISLAND MARINE LOGISTICS INC.',
    legalType: 'BC',
    status: 'ACTIVE',
    bn: '778899001BC0001',
    goodStanding: true,
    modernized: true,
    score: 79.2
  },
  {
    identifier: 'CP0011171',
    name: 'COASTAL COMMUNITY ROASTERS CO-OP',
    legalType: 'CP',
    status: 'ACTIVE',
    bn: '889900112BC0001',
    goodStanding: true,
    modernized: false,
    score: 75.0
  }
]

export default defineEventHandler(async (event): Promise<BusinessSearchResponse> => {
  const body = await readBody<BusinessSearchRequestBody>(event).catch(() => null)
  const rawQuery = body?.query

  if (!rawQuery || typeof rawQuery !== 'string') {
    return { totalResults: 0, results: [] }
  }

  const query = rawQuery.trim()

  // Guard: minimum 3 characters required before executing search
  if (query.length < 3) {
    return { totalResults: 0, results: [] }
  }

  const config = useRuntimeConfig(event)
  const apiKey = config.bcRegistryApiKey
  const accountId = config.bcRegistryAccountId
  const baseUrl = config.bcRegistryBaseUrl || 'https://sandbox.api.connect.gov.bc.ca'

  // If credentials are not configured, provide mock results for frictionless team evaluation
  if (!apiKey || !accountId) {
    const qLower = query.toLowerCase()
    const matches = MOCK_BUSINESSES.filter(
      b =>
        b.name.toLowerCase().includes(qLower)
        || b.identifier.toLowerCase().includes(qLower)
        || (b.bn && b.bn.toLowerCase().includes(qLower))
    )

    return {
      totalResults: matches.length,
      results: matches,
      source: 'mock'
    }
  }

  // Construct upstream request to BC Registries Search API v2
  const upstreamUrl = `${baseUrl.replace(/\/$/, '')}/registry-search/api/v2/search/businesses`

  // Per verified BC Registries API requirement:
  // Categories legalType and status must be wrapped as stringified arrays
  const payload = {
    query: {
      value: query,
      name: '',
      identifier: '',
      bn: ''
    },
    categories: {
      legalType: [
        '["BC", "BEN", "CP"]'
      ],
      status: [
        '["ACTIVE"]'
      ]
    },
    rows: 10,
    start: 0
  }

  try {
    const upstreamResponse = await $fetch<{
      searchResults?: {
        totalResults?: number
        results?: BusinessSearchResult[]
      }
    }>(upstreamUrl, {
      method: 'POST',
      headers: {
        'Account-Id': String(accountId),
        'X-Apikey': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: payload
    })

    const results = upstreamResponse?.searchResults?.results || []
    const totalResults = upstreamResponse?.searchResults?.totalResults ?? results.length

    return {
      totalResults,
      results,
      source: 'live'
    }
  } catch (error: unknown) {
    const err = error as { statusCode?: number, response?: { status?: number }, data?: { message?: string }, message?: string }
    console.error('[BC Registry Proxy] Upstream error calling', upstreamUrl, err?.data || err?.message)

    throw createError({
      statusCode: err?.statusCode || err?.response?.status || 502,
      statusMessage: err?.data?.message || 'BC Registry API request failed'
    })
  }
})
