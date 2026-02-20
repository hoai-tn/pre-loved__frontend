/**
 * Order item from API response
 */
export interface OrderItem {
  id: number
  order_id: number
  product_id: string
  quantity: number
  price: string
  thumbnail_url?: string | null
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipping'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

/**
 * Order from API response
 */
export interface Order {
  id: number
  user_id: string
  status: OrderStatus
  total: string
  created_at: string
  updated_at: string
  thumbnail_url?: string | null
  items: Array<OrderItem>
}

/**
 * Mocked shipping info (not yet from API)
 */
export interface ShippingInfo {
  name: string
  phone: string
  address: string
  method: string
  trackingNumber?: string
  estimatedDelivery?: string
  deliveredAt?: string
  fee: number
}

/**
 * Mocked payment info (not yet from API)
 */
export interface PaymentInfo {
  method: string
  status: string
  paidAt?: string
}

export interface OrderStatusInfo {
  label: string
  color: string
  bgColor: string
  icon: string
}
