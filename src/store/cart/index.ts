import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createCartActions } from './actions'
import { createAsyncActions } from './asyncActions'
import type { CartStore } from './types'

/**
 * Cart Store using Zustand
 * 
 * Features:
 * - Persistent cart data (localStorage)
 * - DevTools integration for debugging
 * - Async actions support for API integration
 * - Clean separation of concerns (state, actions, async actions)
 */
export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get, store) => {
        const baseStore = createCartActions(set, get, store)
        const asyncActions = createAsyncActions(get, set)

        return {
          ...baseStore,
          // Override async actions with actual implementations
          syncCartWithServer: asyncActions.syncCartWithServer,
          loadCartFromServer: asyncActions.loadCartFromServer,
        }
      },
      {
        name: 'cart-storage', // localStorage key
        partialize: (state) => ({ items: state.items }), // Only persist items
      }
    ),
    {
      name: 'CartStore', // DevTools name
    }
  )
)

// Selectors for optimized re-renders
export const selectCartItems = (state: CartStore) => state.items
export const selectCartItemCount = (state: CartStore) => state.getItemCount()
export const selectCartTotalPrice = (state: CartStore) => state.getTotalPrice()
export const selectCartLoading = (state: CartStore) => state.isLoading
export const selectCartError = (state: CartStore) => state.error

// Export types
export type { CartStore, CartState, CartActions } from './types'

