import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createCheckoutActions } from './actions'
import { createAsyncActions } from './asyncActions'
import type { CheckoutStore } from './types'

/**
 * Checkout Store using Zustand
 *
 * Features:
 * - Persistent checkout state (localStorage) - shipping method, payment method, etc.
 * - DevTools integration for debugging
 * - Async actions support for order placement
 * - Clean separation of concerns (state, actions, async actions)
 */
export const useCheckoutStore = create<CheckoutStore>()(
  devtools(
    persist(
      (set, get, store) => {
        const baseStore = createCheckoutActions(set, get, store)
        const asyncActions = createAsyncActions(get, set)

        return {
          ...baseStore,
          // Override async actions with actual implementations
          placeOrder: asyncActions.placeOrder,
        }
      },
      {
        name: 'checkout-storage', // localStorage key
        partialize: (state) => ({
          // Only persist user preferences, not loading/error states
          shippingMethod: state.shippingMethod,
          paymentMethod: state.paymentMethod,
          note: state.note,
          voucherCode: state.voucherCode,
        }),
      },
    ),
    {
      name: 'CheckoutStore', // DevTools name
    },
  ),
)

// Selectors for optimized re-renders
export const selectShippingMethod = (state: CheckoutStore) =>
  state.shippingMethod
export const selectPaymentMethod = (state: CheckoutStore) => state.paymentMethod
export const selectNote = (state: CheckoutStore) => state.note
export const selectVoucherCode = (state: CheckoutStore) => state.voucherCode
export const selectIsLoading = (state: CheckoutStore) => state.isLoading
export const selectError = (state: CheckoutStore) => state.error
