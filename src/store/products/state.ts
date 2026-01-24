import type { ProductState } from './types'

/**
 * Initial product store state
 */
export const initialProductState: ProductState = {
  // Product data
  products: [],
  total: 0,
  currentPage: 1,
  totalPages: 0,
  limit: 20,

  // Loading and error states
  isLoading: false,
  error: null,

  // Filters
  filters: {
    search: '',
    categoryId: null,
    brandId: null,
    minPrice: null,
    maxPrice: null,
    condition: null,
    sortBy: null,
    sortOrder: 'DESC',
    isFeatured: undefined,
    isTrending: undefined,
  },

  // Search dropdown (merged from search store)
  searchQuery: '',
  searchResults: [],
  isSearchLoading: false,
  searchError: null,
  isSearchOpen: false,
}
