import type { ApiProduct } from './product.types'

/**
 * Order item request
 */
export interface OrderItemRequest {
  productId: string
  quantity: number
}

/**
 * Create order request
 */
export interface CreateOrderRequest {
  userId: number
  items: Array<OrderItemRequest>
}

/**
 * Order item response
 */
export interface OrderItemResponse {
  id: string
  productId: string
  quantity: number
  price: number
  product?: ApiProduct
}

/**
 * Order response
 */
export interface OrderResponse {
  id: string
  userId: number
  status: string
  totalAmount: number
  items: Array<OrderItemResponse>
  createdAt: string
  updatedAt: string
}
