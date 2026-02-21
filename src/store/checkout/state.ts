import type { CheckoutState } from './types'

export const initialCheckoutState: CheckoutState = {
  shippingMethod: 'nhanh',
  paymentMethod: 'cod',
  note: '',
  voucherCode: '',
  isLoading: false,
  error: null,
  buyNowItem: null,
}
