import { get, post } from './api-client'
import { API_ROUTES } from './routes.api'
import type {
  ApiOrder,
  CreateOrderRequest,
  GetOrdersResponse,
  OrderResponse,
} from './types'

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
 * Transform API order to internal OrderResponse format
 */
function transformApiOrder(apiOrder: ApiOrder): OrderResponse {
  return {
    id: String(apiOrder.id),
    userId: Number(apiOrder.user_id),
    status: apiOrder.status,
    totalAmount: parseFloat(apiOrder.total),
    items: apiOrder.items.map((item) => ({
      id: String(item.id),
      productId: String(item.product_id),
      quantity: item.quantity,
      price: parseFloat(item.price),
    })),
    createdAt: apiOrder.created_at,
    updatedAt: apiOrder.updated_at,
  }
}

/**
 * Get all orders for the current user
 */
export async function getOrders(userId: string): Promise<Array<OrderResponse>> {
  const response = await get<GetOrdersResponse>(API_ROUTES.ORDER.GET_ALL_BY_USER.replace(':userId', userId))

  if (response.error) {
    throw new Error(response.error)
  }

  if (!response.data) {
    return []
  }

  // Transform API orders to internal format
  return response.data.orders.map(transformApiOrder)
}

/**
 * Get order by ID
 */
export async function getOrderById(id: string): Promise<OrderResponse> {
  const endpoint = API_ROUTES.ORDER.GET_BY_ID.replace(':id', id)
  const response = await get<ApiOrder>(endpoint)

  if (response.error) {
    throw new Error(response.error)
  }

  if (!response.data) {
    throw new Error('Order not found')
  }

  return transformApiOrder(response.data)
}
