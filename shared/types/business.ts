/**
 * Business Search data models based on BC Registries Search API v2 OAS.
 */

export interface BusinessSearchResult {
  /** Unique business registration identifier, e.g. "BC0195391" */
  identifier: string
  /** Official registered legal business name */
  name: string
  /** Legal entity type code, e.g. "BC", "BEN", "CP", "LLC" */
  legalType: string
  /** Current registration status, e.g. "ACTIVE" or "HISTORICAL" */
  status: string
  /** Optional Business Number (15-character BN / BN15) */
  bn?: string
  /** Whether the business is in good standing under the Business Corporations Act */
  goodStanding?: boolean
  /** Whether data has moved to the modernized system */
  modernized?: boolean
  /** SOLR relevance search score */
  score?: number
}

export interface BusinessSearchResponse {
  /** Total count of matching records in the registry */
  totalResults: number
  /** List of business search result items for the current page */
  results: BusinessSearchResult[]
  /** Data source indicator: 'live' from BC Gov sandbox API, or 'mock' when credentials are unconfigured */
  source?: 'live' | 'mock'
}

export interface BusinessSearchRequestBody {
  /** Search string typed by the user */
  query: string
}
