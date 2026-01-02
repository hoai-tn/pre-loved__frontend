import type { CartStore } from './types'
import { setLocalStorage } from '@/lib/storage'

/**
 * Async actions for cart store
 * These can be extended when backend API is available
 */

export const createAsyncActions = (
  get: () => CartStore,
  set: (partial: Partial<CartStore>) => void,
) => ({
  /**
   * Sync cart with server
   * TODO: Implement API call when backend is ready
   */
  syncCartWithServer: async () => {
    const { items, setLoading, setError } = get()

    try {
      setLoading(true)
      setError(null)

      // TODO: API call to sync cart
      // await apiClient.post('/cart/sync', { items })
      new Promise((resolve) => {
        setTimeout(() => {
          console.log('Cart synced with server:', items)
          resolve(items)
        }, 1000)
      })

      // Save to localStorage as fallback
      setLocalStorage('cart', JSON.stringify(items))
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to sync cart'
      setError(errorMessage)
      console.error('Error syncing cart:', error)
    } finally {
      setLoading(false)
    }
  },

  /**
   * Load cart from server
   * TODO: Implement API call when backend is ready
   */
  loadCartFromServer: async () => {
    const { setLoading, setError } = get()

    try {
      setLoading(true)
      setError(null)

      // TODO: API call to load cart
      // const response = await apiClient.get('/cart')
      // set({ items: response.data.items })

      // Load from localStorage as fallback
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        set({ items: JSON.parse(savedCart) })
        console.log('Cart loaded from localStorage')
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load cart'
      setError(errorMessage)
      console.error('Error loading cart:', error)
    } finally {
      setLoading(false)
    }
  },
})
