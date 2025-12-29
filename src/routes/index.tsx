'use client'

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ProductGrid } from '@/components/product/product-grid'
import { useCartStore } from '@/store/cart'
import { getProducts } from '@/services/api/products.api'
import type { ApiProduct } from '@/services/api/types.api'
import type { Product } from '@/lib/mock-products'

/**
 * Map API product to Product interface for components
 */
function mapApiProductToProduct(apiProduct: ApiProduct): Product {
  // Use a default placeholder image if imageUrl is null
  const defaultImage =
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'

  return {
    id: apiProduct.id,
    image: apiProduct.imageUrl || defaultImage,
    title: apiProduct.name,
    price: apiProduct.price,
    postedAt: apiProduct.createdAt,
    location: undefined, // API doesn't provide location, can be added later
  }
}

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    const apiProducts = await getProducts()
    const products = apiProducts.map(mapApiProductToProduct)
    return { products }
  },
})

function App() {
  const { products } = Route.useLoaderData()
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const addItem = useCartStore((state) => state.addItem)

  const handleFavoriteToggle = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) {
        newFavorites.delete(id)
      } else {
        newFavorites.add(id)
      }
      return newFavorites
    })
  }

  const handleAddToCart = (id: string) => {
    const product = products.find((p) => p.id === id)
    if (product) {
      addItem({
        id: `cart-${id}-${Date.now()}`,
        productId: id,
        image: product.image,
        title: product.title,
        price: product.price,
        location: product.location,
      })
    }
  }

  const handleBuy = (id: string) => {
    handleAddToCart(id)
    // TODO: Navigate to checkout or cart
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Sản phẩm nổi bật</h1>
        <p className="text-muted-foreground">
          Khám phá những sản phẩm chất lượng với giá tốt nhất
        </p>
      </div>
      <ProductGrid
        products={products}
        favorites={favorites}
        onFavoriteToggle={handleFavoriteToggle}
        onAddToCart={handleAddToCart}
        onBuy={handleBuy}
      />
    </div>
  )
}
