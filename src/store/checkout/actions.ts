import { initialCheckoutState } from './state'
import type { CartItem } from '@/store/cart/types'
import type { StateCreator } from 'zustand'
import type { CheckoutStore } from './types'

export const createCheckoutActions: StateCreator<
  CheckoutStore,
  [],
  [],
  CheckoutStore
> = (set, get) => ({
  ...initialCheckoutState,

  // State setters
  setShippingMethod: (method) => {
    set({ shippingMethod: method })
  },

  setPaymentMethod: (method) => {
    set({ paymentMethod: method })
  },

  setNote: (note) => {
    set({ note })
  },

  setVoucherCode: (code) => {
    set({ voucherCode: code })
  },

  setBuyNowItem: (item) => {
    set({ buyNowItem: item })
  },

  clearBuyNowItem: () => {
    set({ buyNowItem: null })
  },

  // Computed values
  getSubtotal: (items: Array<CartItem>) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },

  getShippingFee: () => {
    const { shippingMethod } = get()
    return shippingMethod === 'nhanh' ? 77800 : 50000
  },

  getDiscount: () => {
    // TODO: Calculate discount based on voucher code
    // For now, return 0
    return 0
  },

  getTotal: (items: Array<CartItem>) => {
    const subtotal = get().getSubtotal(items)
    const shippingFee = get().getShippingFee()
    const discount = get().getDiscount()
    return subtotal + shippingFee - discount
  },

  // Internal state setters
  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },

  setError: (error: string | null) => {
    set({ error })
  },

  reset: () => {
    set(initialCheckoutState)
  },

  // Placeholder for async actions (implemented in asyncActions.ts)
  placeOrder: async () => {
    // Placeholder
  },
})
