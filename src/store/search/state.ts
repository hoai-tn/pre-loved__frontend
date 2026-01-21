import type { SearchState } from './types'

export const initialSearchState: SearchState = {
  query: '',
  results: [],
  isLoading: false,
  error: null,
  isOpen: false,
}
