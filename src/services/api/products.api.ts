import { get } from './api-client'
import { API_ROUTES } from './routes.api'
import type { ApiProduct } from './types.api'
/**
 * Get all products
 */
export async function getProducts(): Promise<Array<ApiProduct>> {
  const response = await get<Array<ApiProduct>>(API_ROUTES.PRODUCT.GET_ALL)

  if (response.error) {
    throw new Error(response.error)
  }

  return response.data || []
}
