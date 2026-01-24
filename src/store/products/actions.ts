import type { StateCreator } from 'zustand'
import { initialProductState } from './state'
import type { ProductStore } from './types'

/**
 * Create synchronous product store actions
 */
export const createProductActions: StateCreator<ProductStore> = (set) => ({
  ...initialProductState,

  // Product management
  setProducts: (products, total, totalPages, page) =>
    set({
      products,
      total,
      totalPages,
      currentPage: page,
      isLoading: false,
      error: null,
    }),

  appendProducts: (newProducts) =>
    set((state) => ({
      products: [...state.products, ...newProducts],
    })),

  clearProducts: () =>
    set({
      products: [],
      total: 0,
      currentPage: 1,
      totalPages: 0,
    }),

  // Filter actions
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    })),

  clearFilters: () =>
    set({
      filters: initialProductState.filters,
      currentPage: 1,
    }),

  setCategoryFilter: (categoryId) =>
    set((state) => ({
      filters: {
        ...state.filters,
        categoryId,
      },
      currentPage: 1,
    })),

  clearCategoryFilter: () =>
    set((state) => ({
      filters: {
        ...state.filters,
        categoryId: null,
      },
      currentPage: 1,
    })),

  // Search actions (merged from search store)
  setSearchQuery: (query) =>
    set({
      searchQuery: query,
    }),

  setSearchOpen: (isOpen) =>
    set({
      isSearchOpen: isOpen,
    }),

  clearSearch: () =>
    set({
      searchQuery: '',
      searchResults: [],
      isSearchOpen: false,
      searchError: null,
    }),

  // Async action placeholders (overridden in index.ts)
  fetchProducts: async () => {},
  searchProducts: async () => {},
  loadMoreProducts: async () => {},
  refreshProducts: async () => {},

  // Internal setters
  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  setPage: (page) =>
    set({
      currentPage: page,
    }),

  setSearchLoading: (loading) =>
    set({
      isSearchLoading: loading,
    }),

  setSearchError: (error) =>
    set({
      searchError: error,
      isSearchLoading: false,
    }),
})
