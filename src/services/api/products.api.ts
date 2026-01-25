import { get } from './api-client'
import { API_ROUTES } from './routes.api'
import type {
  ApiProduct,
  GetProductsQueryDto,
  GetProductsByCategoryQueryDto,
  PaginatedResponse,
} from './types'

/**
 * Get all products with query parameters
 */
export async function getProducts(
  query?: GetProductsQueryDto,
): Promise<PaginatedResponse<ApiProduct>> {
  const response = await get<PaginatedResponse<ApiProduct>>(
    API_ROUTES.PRODUCT.GET_ALL,
    query as Record<string, unknown>,
  )

  if (response.error) {
    throw new Error(response.error)
  }

  return (
    response.data || {
      total: 0,
      items: [],
      page: 1,
      limit: 10,
      totalPages: 0,
    }
  )
}

/**
 * Search products (alias for getProducts with search parameter)
 */
export async function searchProducts(
  query: GetProductsQueryDto,
): Promise<PaginatedResponse<ApiProduct>> {
  return getProducts(query)
}

/**
 * Get products by category with query parameters
 */
export async function getProductsByCategory(
  categoryId: number,
  query?: GetProductsByCategoryQueryDto,
): Promise<PaginatedResponse<ApiProduct>> {
  const endpoint = API_ROUTES.PRODUCT.GET_BY_CATEGORY.replace(
    ':categoryId',
    String(categoryId),
  )
  const response = await get<PaginatedResponse<ApiProduct>>(
    endpoint,
    query as Record<string, unknown>,
  )

  if (response.error) {
    throw new Error(response.error)
  }

  return (
    response.data || {
      total: 0,
      items: [],
      page: 1,
      limit: 10,
      totalPages: 0,
    }
  )
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<ApiProduct> {
  const endpoint = API_ROUTES.PRODUCT.GET_BY_ID.replace(':id', id)
  const response = await get<ApiProduct>(endpoint)

  if (response.error) {
    throw new Error(response.error)
  }

  if (!response.data) {
    throw new Error('Product not found')
  }

  return response.data
}
