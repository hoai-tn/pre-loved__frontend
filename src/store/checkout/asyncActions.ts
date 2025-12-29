import type { CartItem } from '@/lib/types/cart'
import type { CheckoutStore } from './types'
import { useCartStore } from '@/store/cart'
import { createOrder } from '@/services/api'

/**
 * Async actions for checkout store
 */
export const createAsyncActions = (
  get: () => CheckoutStore,
  set: (partial: Partial<CheckoutStore>) => void,
) => ({
  /**
   * Place an order
   */
  placeOrder: async (items: Array<CartItem>, userId: number) => {
    const { setLoading, setError, shippingMethod, paymentMethod, note } = get()

    try {
      setLoading(true)
      setError(null)

      // Transform cart items to order items
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))

      // Create order via API
      await createOrder({
        userId,
        items: orderItems,
      })

      // Reset checkout state after successful order
      get().reset()

      // Clear cart items after successful order
      useCartStore.getState().clearCart()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to place order'
      setError(errorMessage)
      console.error('Error placing order:', error)
      throw error // Re-throw so component can handle it
    } finally {
      setLoading(false)
    }
  },
})
