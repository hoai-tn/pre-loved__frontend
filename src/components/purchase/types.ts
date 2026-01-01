export interface OrderItem {
  id: string
  productId: string
  name: string
  imageUrl: string
  price: number
  quantity: number
  category?: string
}

export interface DeliveryAddress {
  name: string
  phone: string
  address: string
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipping'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface Order {
  id: string
  orderDate: string
  status: OrderStatus
  items: Array<OrderItem>
  total: number
  shippingFee: number
  discount?: number
  deliveryAddress: DeliveryAddress
  trackingNumber?: string
  estimatedDelivery?: string
  deliveredAt?: string
  cancelledAt?: string
  cancelReason?: string
  paymentMethod?: string
  shippingMethod?: string
}

export interface OrderStatusInfo {
  label: string
  color: string
  bgColor: string
  icon: string
}
