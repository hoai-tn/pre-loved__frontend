import { initialCartState } from './state'
import type { CartItem } from '@/lib/types/cart'
import type { StateCreator } from 'zustand'
import type { CartStore } from './types'

export const createCartActions: StateCreator<CartStore, [], [], CartStore> = (
  set,
  get,
) => ({
  ...initialCartState,

  // Synchronous actions
  addItem: (newItem: Omit<CartItem, 'quantity'>) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.productId === newItem.productId,
      )

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.productId === newItem.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        }
      }

      return {
        items: [...state.items, { ...newItem, quantity: 1 }],
      }
    })
  },

  removeItem: (id: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }))
  },

  updateQuantity: (id: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(id)
      return
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    }))
  },

  clearCart: () => {
    set({ items: [] })
  },

  // Computed values
  getTotalPrice: () => {
    const { items } = get()
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  },

  getItemCount: () => {
    const { items } = get()
    return items.reduce((count, item) => count + item.quantity, 0)
  },

  // Internal state setters
  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },

  setError: (error: string | null) => {
    set({ error })
  },

  // Placeholder for async actions (implemented in asyncActions.ts)
  syncCartWithServer: async () => {
    // Placeholder
  },

  loadCartFromServer: async () => {
    // Placeholder
  },
})
