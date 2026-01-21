import type { ApiProduct } from '@/services/api/types'

export interface SearchState {
  query: string
  results: ApiProduct[]
  isLoading: boolean
  error: string | null
  isOpen: boolean
}
