/**
 * Brand data
 */
export interface Brand {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Category data
 */
export interface Category {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * User data from product response
 */
export interface ProductUser {
  id: number
  name: string | null
  email: string
  avatar: string | null
}

/**
 * Product data from API
 */
export interface ApiProduct {
  id: string
  name: string
  description: string
  price: number
  stockQuantity: number
  sku: string
  brandId: string
  categoryId: string
  userId: string
  imageUrl: string | null
  isActive: boolean
  likesCount: number
  commentsCount: number
  sharesCount: number
  viewCount: number
  isFeatured: boolean
  isTrending: boolean
  condition: string
  sellerNotes: string | null
  rating: string
  ratingCount: number
  createdAt: string
  updatedAt: string
  brand: Brand | null
  category: Category | null
  user: ProductUser
}
