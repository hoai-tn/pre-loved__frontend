'use client'

import { createFileRoute } from '@tanstack/react-router'
import { Sparkles, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ApiProduct } from '@/services/api/types'
import type { Category } from '@/components/home'
import type { Product } from '@/lib/mock-products'
import { getProducts } from '@/services/api/products.api'
import { Button } from '@/components/ui/button'
import {
  CategoryGrid,
  FlashSale,
  HeroCarousel,
  ProductScroller,
  PromoBanners,
  SectionHeader,
} from '@/components/home'
import { ProductCard } from '@/components/product/product-card'
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

/**
 * Map API product to Product interface for components
 */
function mapApiProductToProduct(apiProduct: ApiProduct): Product {
  // Use a default placeholder image if imageUrl is null
  const defaultImage =
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'
  return {
    id: apiProduct.id,
    image: apiProduct.thumbnailUrl || defaultImage,
    title: apiProduct.name,
    price: apiProduct.price,
    isTrending: apiProduct.isTrending,
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
  const [trendingProducts, setTrendingProducts] = useState<Array<Product>>([])
  const [isTrendingLoading, setIsTrendingLoading] = useState(false)
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

  // Mock data for demo - Replace with real data from your API
  const banners = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop',
      title: 'Siêu Sale Cuối Tuần',
      subtitle: 'Giảm giá lên đến 50% cho tất cả sản phẩm công nghệ',
      backgroundColor: '#ee4d2d',
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=400&fit=crop',
      title: 'Công Nghệ Mới Nhất',
      subtitle: 'Khám phá những sản phẩm công nghệ đỉnh cao',
      backgroundColor: '#1e40af',
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=400&fit=crop',
      title: 'Thời Trang Độc Đáo',
      subtitle: 'Phong cách riêng biệt, giá cả phải chăng',
      backgroundColor: '#7c3aed',
    },
  ]

  const categories: Array<Category> = [
    { id: 1, name: 'Điện Thoại', icon: 'smartphone', link: '/categories/phone' },
    { id: 2, name: 'Laptop', icon: 'laptop', link: '/categories/laptop' },
    { id: 3, name: 'Đồng Hồ', icon: 'watch', link: '/categories/watch' },
    { id: 4, name: 'Tai Nghe', icon: 'headphones', link: '/categories/headphones' },
    { id: 5, name: 'Camera', icon: 'camera', link: '/categories/camera' },
    { id: 6, name: 'TV', icon: 'tv', link: '/categories/tv' },
    { id: 7, name: 'Nhà Cửa', icon: 'home', link: '/categories/home-living' },
    { id: 8, name: 'Khác', icon: 'shopping', link: '/' },
  ]

  // Flash sale products (mock - first 6 products with discount)
  const flashSaleProducts = allProducts.slice(0, 6).map((product, index) => ({
    ...product,
    originalPrice: product.price * 1.5,
    discount: 30 + index * 5,
    sold: Math.floor(Math.random() * 100),
    stock: 150,
  }))

  const flashSaleEndTime = new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 hours from now

  const promoBanners = [
    {
      id: '1',
      title: 'Giảm 40% Laptop',
      description: 'Chương trình có thời hạn',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=300&fit=crop',
      link: '/?categoryId=2',
      backgroundColor: '#1e293b',
    },
    {
      id: '2',
      title: 'Phụ Kiện Hot',
      description: 'Xu hướng mới nhất',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=300&fit=crop',
      link: '/?categoryId=4',
      backgroundColor: '#7c3aed',
    },
    {
      id: '3',
      title: 'Đồng Hồ Sang Trọng',
      description: 'Miễn phí vận chuyển',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=300&fit=crop',
      link: '/?categoryId=3',
      backgroundColor: '#dc2626',
    },
  ]

  // Fetch products on mount and when category changes
  useEffect(() => {
    const categoryIdNum = categoryId ? Number(categoryId) : null
    setCategoryFilter(categoryIdNum)
    fetchProducts()
  }, [categoryId, fetchProducts, setCategoryFilter])

  // Fetch trending products via API flag
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setIsTrendingLoading(true)
        const response = await getProducts({
          page: 1,
          limit: 12,
          isTrending: true,
          // sortBy: 'createdAt',
          // sortOrder: 'DESC',
        })
        setTrendingProducts(response.items.map(mapApiProductToProduct))
      } catch (error) {
        console.error('Error fetching trending products:', error)
      } finally {
        setIsTrendingLoading(false)
      }
    }

    fetchTrending()
  }, [])

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
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="container mx-auto px-4 pt-6">
        <HeroCarousel banners={banners} />
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <SectionHeader title="Danh Mục" className="mb-4" />
          <CategoryGrid categories={categories} />
        </div>
      </div>

      {/* Promo Banners */}
      <div className="container mx-auto px-4 pb-8">
        <PromoBanners banners={promoBanners} />
      </div>

      {/* Flash Sale */}
      {flashSaleProducts.length > 0 && (
        <div className="container mx-auto px-4 pb-8">
          <FlashSale
            products={flashSaleProducts}
            endTime={flashSaleEndTime}
            favorites={favorites}
            onFavoriteToggle={handleFavoriteToggle}
            onAddToCart={handleAddToCart}
            onBuy={handleBuy}
          />
        </div>
      )}

      {/* Trending Products */}
      {(trendingProducts.length > 0 || allProducts.length > 0) && (
        <div className="container mx-auto px-4 pb-8">
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <SectionHeader
              title="Sản Phẩm Trending"
              subtitle="Được yêu thích nhất"
              icon={<TrendingUp className="size-6" />}
              viewAllLink="/"
            />
            <ProductScroller
              items={
                trendingProducts.length > 0
                  ? trendingProducts
                  : allProducts.slice(0, 12)
              }
              renderItem={(product) => (
                <ProductCard
                  {...product}
                  isFavorite={favorites.has(product.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                  onAddToCart={handleAddToCart}
                  onBuy={handleBuy}
                />
              )}
            />
            {isTrendingLoading && (
              <p className="text-sm text-muted-foreground mt-4">
                Đang tải sản phẩm trending...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Featured Products */}
      <div className="container mx-auto px-4 pb-8">
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <SectionHeader
            title="Gợi Ý Hôm Nay"
            subtitle="Những sản phẩm dành riêng cho bạn"
            icon={<Sparkles className="size-6" />}
          />
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
                className="min-w-50"
              >
                {isLoading ? 'Đang tải...' : `Xem thêm ${remainingProducts} sản phẩm`}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
