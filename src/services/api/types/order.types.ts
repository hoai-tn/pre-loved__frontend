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
 * Order item response from API (snake_case)
 */
export interface ApiOrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: string
  thumbnail_url?: string | null
}

/**
 * Order response from API (snake_case)
 */
export interface ApiOrder {
  id: number
  user_id: string
  status: string
  total: string
  created_at: string
  updated_at: string
  items: Array<ApiOrderItem>
}

/**
 * User info in orders response
 */
export interface ApiUser {
  id: number
  username: string
  password: string
  email: string
  name: string | null
  avatar: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Get orders response structure
 */
export interface GetOrdersResponse {
  user: ApiUser
  orders: Array<ApiOrder>
}

/**
 * Order item response (camelCase for internal use)
 */
export interface OrderItemResponse {
  id: string
  productId: number
  quantity: number
  price: number
  thumbnailUrl?: string | null
  product?: ApiProduct
}

/**
 * Order response (camelCase for internal use)
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
