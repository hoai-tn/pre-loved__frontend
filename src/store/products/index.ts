import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createProductActions } from './actions'
import { createAsyncActions } from './asyncActions'
import type { ProductStore } from './types'

/**
 * Product store
 * Manages product listing, filtering, pagination, and search functionality
 */
export const useProductStore = create<ProductStore>()(
  devtools(
    (set, get, store) => {
      const baseStore = createProductActions(set, get, store)
      const asyncActions = createAsyncActions(get, set)

      // Override placeholder async actions with actual implementations
      return {
        ...baseStore,
        fetchProducts: asyncActions.fetchProducts,
        searchProducts: asyncActions.searchProducts,
        loadMoreProducts: asyncActions.loadMoreProducts,
        refreshProducts: asyncActions.refreshProducts,
      }
    },
    { name: 'ProductStore' }
  )
)

// Selectors for optimized re-renders
export const selectProducts = (state: ProductStore) => state.products
export const selectTotal = (state: ProductStore) => state.total
export const selectCurrentPage = (state: ProductStore) => state.currentPage
export const selectTotalPages = (state: ProductStore) => state.totalPages
export const selectIsLoading = (state: ProductStore) => state.isLoading
export const selectError = (state: ProductStore) => state.error
export const selectFilters = (state: ProductStore) => state.filters
export const selectCategoryId = (state: ProductStore) => state.filters.categoryId

// Search selectors (merged from search store)
export const selectSearchQuery = (state: ProductStore) => state.searchQuery
export const selectSearchResults = (state: ProductStore) => state.searchResults
export const selectSearchIsLoading = (state: ProductStore) => state.isSearchLoading
export const selectSearchError = (state: ProductStore) => state.searchError
export const selectSearchIsOpen = (state: ProductStore) => state.isSearchOpen

// Re-export types
export type { ProductStore, ProductState, ProductActions, ProductFilters } from './types'
