'use client'

import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { ApiProduct } from '@/services/api/types'
import type { Product } from '@/lib/mock-products'
import { ProductGrid } from '@/components/product/product-grid'
import { useCartStore } from '@/store/cart'
import {
  selectCurrentPage,
  selectIsLoading,
  selectProducts,
  selectTotal,
  selectTotalPages,
  useProductStore,
} from '@/store/products'
import { Button } from '@/components/ui/button'

/**
 * Map API product to Product interface for components
 */
function mapApiProductToProduct(apiProduct: ApiProduct): Product {
  // Use a default placeholder image if imageUrl is null
  const defaultImage =
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'
  return {
    id: apiProduct.id,
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:90/plain/https://cellphones.com.vn/media/catalog/product' + apiProduct.imageUrl || defaultImage,
    title: apiProduct.name,
    price: apiProduct.price,
    postedAt: apiProduct.createdAt,
    location: undefined, // API doesn't provide location, can be added later
  }
}

export const Route = createFileRoute('/')({
  component: App,
  validateSearch: (search: Record<string, unknown>): { categoryId?: string } => {
    return {
      categoryId: search.categoryId as string | undefined,
    }
  },
})

function App() {
  const { categoryId } = Route.useSearch()
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const addItem = useCartStore((state) => state.addItem)

  // Product store selectors
  const apiProducts = useProductStore(selectProducts)
  const isLoading = useProductStore(selectIsLoading)
  const currentPage = useProductStore(selectCurrentPage)
  const totalPages = useProductStore(selectTotalPages)
  const totalProducts = useProductStore(selectTotal)
  const { fetchProducts, loadMoreProducts, setCategoryFilter } = useProductStore()

  // Map API products to UI products
  const allProducts = apiProducts.map(mapApiProductToProduct)
  const remainingProducts = totalProducts - allProducts.length

  // Fetch products on mount and when category changes
  useEffect(() => {
    const categoryIdNum = categoryId ? Number(categoryId) : null
    setCategoryFilter(categoryIdNum)
    fetchProducts()
  }, [categoryId, fetchProducts, setCategoryFilter])

  const handleLoadMore = async () => {
    await loadMoreProducts()
  }

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
    const product = allProducts.find((p) => p.id === id)
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
        products={allProducts}
        favorites={favorites}
        onFavoriteToggle={handleFavoriteToggle}
        onAddToCart={handleAddToCart}
        onBuy={handleBuy}
      />
      
      {remainingProducts > 0 && currentPage < totalPages && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            {isLoading ? 'Đang tải...' : `Xem thêm ${remainingProducts} sản phẩm`}
          </Button>
        </div>
      )}
    </div>
  )
}
