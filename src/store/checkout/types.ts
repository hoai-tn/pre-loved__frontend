import type { CartItem } from '@/store/cart/types'

export type ShippingMethod = 'nhanh' | 'tietkiem'
export type PaymentMethod = 'cod' | 'bank' | 'card'

export interface CheckoutState {
  shippingMethod: ShippingMethod
  paymentMethod: PaymentMethod
  note: string
  voucherCode: string
  isLoading: boolean
  error: string | null
  buyNowItem: CartItem | null
}

export interface CheckoutActions {
  // State setters
  setShippingMethod: (method: ShippingMethod) => void
  setPaymentMethod: (method: PaymentMethod) => void
  setNote: (note: string) => void
  setVoucherCode: (code: string) => void
  setBuyNowItem: (item: CartItem) => void
  clearBuyNowItem: () => void

  // Computed values (calculated from cart items)
  getSubtotal: (items: Array<CartItem>) => number
  getShippingFee: () => number
  getDiscount: () => number
  getTotal: (items: Array<CartItem>) => number

  // Async actions
  placeOrder: (items: Array<CartItem>, userId: number) => Promise<void>

  // Internal state setters
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export type CheckoutStore = CheckoutState & CheckoutActions
