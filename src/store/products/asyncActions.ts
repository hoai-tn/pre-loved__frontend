import type { StoreApi } from 'zustand'
import { getProducts } from '@/services/api/products.api'
import type { GetProductsQueryDto } from '@/services/api/types/product.types'
import type { ProductStore } from './types'

/**
 * Create async product store actions
 */
export const createAsyncActions = (
  get: () => ProductStore,
  set: StoreApi<ProductStore>['setState']
) => ({
  /**
   * Fetch products with filters and pagination
   */
  fetchProducts: async (params?: Partial<GetProductsQueryDto>) => {
    const store = get()
    
    try {
      store.setLoading(true)
      store.setError(null)

      const { filters, limit } = store

      // Build query parameters
      const queryParams: GetProductsQueryDto = {
        page: 1, // Reset to page 1 when fetching
        limit,
        ...params,
      }

      // Apply filters if not overridden by params
      if (!params?.search && filters.search) {
        queryParams.search = filters.search
      }
      if (!params?.categoryId && filters.categoryId) {
        queryParams.categoryId = filters.categoryId
      }
      if (filters.brandId) {
        queryParams.brandId = filters.brandId
      }
      if (filters.minPrice) {
        queryParams.minPrice = filters.minPrice
      }
      if (filters.maxPrice) {
        queryParams.maxPrice = filters.maxPrice
      }
      if (filters.condition) {
        queryParams.condition = filters.condition
      }
      if (filters.sortBy) {
        queryParams.sortBy = filters.sortBy
        queryParams.sortOrder = filters.sortOrder
      }
      if (filters.isFeatured !== undefined) {
        queryParams.isFeatured = filters.isFeatured
      }
      if (filters.isTrending !== undefined) {
        queryParams.isTrending = filters.isTrending
      }

      const response = await getProducts(queryParams)

      store.setProducts(response.items, response.total, response.totalPages, response.page)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products'
      store.setError(errorMessage)
      console.error('Error fetching products:', error)
    }
  },

  /**
   * Search products for dropdown (merged from search store)
   */
  searchProducts: async (query: string) => {
    const store = get()

    if (!query.trim()) {
      store.setSearchOpen(false)
      return
    }

    try {
      store.setSearchLoading(true)
      store.setSearchError(null)

      const response = await getProducts({
        search: query,
        limit: 10,
        page: 1,
      })

      set({
        searchQuery: query,
        searchResults: response.items,
        isSearchOpen: true,
        isSearchLoading: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search products'
      store.setSearchError(errorMessage)
      console.error('Error searching products:', error)
    }
  },

  /**
   * Load more products (pagination)
   */
  loadMoreProducts: async () => {
    const store = get()
    const { currentPage, totalPages, filters, limit, isLoading } = store

    // Don't load if already loading or no more pages
    if (isLoading || currentPage >= totalPages) {
      return
    }

    try {
      store.setLoading(true)

      const nextPage = currentPage + 1

      // Build query parameters with current filters
      const queryParams: GetProductsQueryDto = {
        page: nextPage,
        limit,
      }

      if (filters.search) {
        queryParams.search = filters.search
      }
      if (filters.categoryId) {
        queryParams.categoryId = filters.categoryId
      }
      if (filters.brandId) {
        queryParams.brandId = filters.brandId
      }
      if (filters.minPrice) {
        queryParams.minPrice = filters.minPrice
      }
      if (filters.maxPrice) {
        queryParams.maxPrice = filters.maxPrice
      }
      if (filters.condition) {
        queryParams.condition = filters.condition
      }
      if (filters.sortBy) {
        queryParams.sortBy = filters.sortBy
        queryParams.sortOrder = filters.sortOrder
      }
      if (filters.isFeatured !== undefined) {
        queryParams.isFeatured = filters.isFeatured
      }
      if (filters.isTrending !== undefined) {
        queryParams.isTrending = filters.isTrending
      }

      const response = await getProducts(queryParams)

      store.appendProducts(response.items)
      store.setPage(nextPage)
      store.setLoading(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load more products'
      store.setError(errorMessage)
      console.error('Error loading more products:', error)
    }
  },

  /**
   * Refresh products (re-fetch with current filters)
   */
  refreshProducts: async () => {
    const store = get()
    await store.fetchProducts()
  },
})

//