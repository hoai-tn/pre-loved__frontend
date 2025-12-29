import { get, post } from './api-client'
import { API_ROUTES } from './routes.api'
import type { CreateOrderRequest, OrderResponse } from './types'

/**
 * Create a new order
 */
export async function createOrder(
  payload: CreateOrderRequest,
): Promise<OrderResponse> {
  const response = await post<OrderResponse>(API_ROUTES.ORDER.CREATE, payload)

  if (response.error) {
    throw new Error(response.error)
  }

  if (!response.data) {
    throw new Error('Failed to create order')
  }

  return response.data
}

/**
 * Get all orders for the current user
 */
export async function getOrders(): Promise<Array<OrderResponse>> {
  const response = await get<Array<OrderResponse>>(API_ROUTES.ORDER.GET_ALL)

  if (response.error) {
    throw new Error(response.error)
  }

  return response.data || []
}

/**
 * Get order by ID
 */
export async function getOrderById(id: string): Promise<OrderResponse> {
  const endpoint = API_ROUTES.ORDER.GET_BY_ID.replace(':id', id)
  const response = await get<OrderResponse>(endpoint)

  if (response.error) {
    throw new Error(response.error)
  }

  if (!response.data) {
    throw new Error('Order not found')
  }

  return response.data
}
