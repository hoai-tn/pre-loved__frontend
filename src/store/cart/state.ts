import type { CartState } from './types'

export const initialCartState: CartState = {
  items: [],
  isLoading: false,
  error: null,
}
