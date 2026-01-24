import type { ApiProduct, GetProductsQueryDto } from '@/services/api/types/product.types'

/**
 * Product filters state
 */
export interface ProductFilters {
  search: string
  categoryId: number | null
  brandId: number | null
  minPrice: number | null
  maxPrice: number | null
  condition: string | null
  sortBy: string | null
  sortOrder: 'ASC' | 'DESC'
  isFeatured?: boolean
  isTrending?: boolean
}

/**
 * Product store state
 */
export interface ProductState {
  // Product data
  products: Array<ApiProduct>
  total: number
  currentPage: number
  totalPages: number
  limit: number

  // Loading and error states
  isLoading: boolean
  error: string | null

  // Filters
  filters: ProductFilters

  // Search dropdown (merged from search store)
  searchQuery: string
  searchResults: Array<ApiProduct>
  isSearchLoading: boolean
  searchError: string | null
  isSearchOpen: boolean
}

/**
 * Product store actions
 */
export interface ProductActions {
  // Product management
  setProducts: (
    products: Array<ApiProduct>,
    total: number,
    totalPages: number,
    page: number,
  ) => void
  appendProducts: (products: Array<ApiProduct>) => void
  clearProducts: () => void

  // Filter actions
  setFilter: <TKey extends keyof ProductFilters>(
    key: TKey,
    value: ProductFilters[TKey],
  ) => void
  setFilters: (filters: Partial<ProductFilters>) => void
  clearFilters: () => void
  setCategoryFilter: (categoryId: number | null) => void
  clearCategoryFilter: () => void

  // Search actions (merged from search store)
  setSearchQuery: (query: string) => void
  setSearchOpen: (isOpen: boolean) => void
  clearSearch: () => void

  // Async actions (placeholders overridden in index.ts)
  fetchProducts: (params?: Partial<GetProductsQueryDto>) => Promise<void>
  searchProducts: (query: string) => Promise<void>
  loadMoreProducts: () => Promise<void>
  refreshProducts: () => Promise<void>

  // Internal setters
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setPage: (page: number) => void
  setSearchLoading: (loading: boolean) => void
  setSearchError: (error: string | null) => void
}

/**
 * Combined product store type
 */
export type ProductStore = ProductState & ProductActions
