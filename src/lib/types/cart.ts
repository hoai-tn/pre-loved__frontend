export interface CartItem {
  id: string
  productId: string
  image: string
  title: string
  price: number
  quantity: number
  location?: string
}
