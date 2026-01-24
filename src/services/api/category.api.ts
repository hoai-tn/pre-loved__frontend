import { get } from './api-client'
import { API_ROUTES } from './routes.api'
import type { CategoryResponse } from './types'

/**
 * Get all categories
 */
export async function getCategories(): Promise<CategoryResponse[]> {
  const response = await get<CategoryResponse[]>(API_ROUTES.CATEGORY.GET_ALL)

  if (response.error) {
    throw new Error(response.error)
  }

  return response.data || []
}
