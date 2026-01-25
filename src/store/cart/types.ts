export interface CartItem {
  id: string
  productId: string
  image: string
  title: string
  price: number
  quantity: number
  location?: string
}

export interface CartState {
  items: Array<CartItem>
  isLoading: boolean
  error: string | null
}

export interface CartActions {
  // Synchronous actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void

  // Computed values
  getTotalPrice: () => number
  getItemCount: () => number

  // Async actions
  syncCartWithServer?: () => Promise<void>
  loadCartFromServer?: () => Promise<void>

  // Internal state setters
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export type CartStore = CartState & CartActions
