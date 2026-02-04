'use client'

import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getProductsByCategory } from '@/services/api/products.api'
import { CategoryFilters } from '@/components/category'
import { ProductGrid } from '@/components/product/product-grid'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'

export interface ValidateSearch {
  sort?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  minRating?: number
}

export interface CategorySlug {
  id: number
  name: string
}
// Static slug to category ID mapping
export const CATEGORY_SLUG_MAP: Record<string, CategorySlug> = {
  laptop: { id: 2, name: 'Laptop' },
  phone: { id: 1, name: 'Điện Thoại' },
  watch: { id: 3, name: 'Đồng Hồ' },
  headphones: { id: 4, name: 'Tai Nghe' },
  camera: { id: 5, name: 'Camera' },
  tv: { id: 6, name: 'TV' },
}


export const Route = createFileRoute('/categories/$slug')({
  component: CategoryPage,
  validateSearch: (search: Record<string, unknown>): ValidateSearch => {
    return {
      sort: (search.sort as string) || 'newest',
      minPrice: search.minPrice as number | undefined,
      maxPrice: search.maxPrice as number | undefined,
      condition: search.condition as string | undefined,
      minRating: search.minRating as number | undefined,
    }
  },
})

function slugToCategoryId(slug: string): number {
  const record = CATEGORY_SLUG_MAP[slug.toLowerCase()]
  return record.id
}

function slugToCategoryName(slug: string): string {
  const record = CATEGORY_SLUG_MAP[slug.toLowerCase()]
  return record.name
}

function getSortByFromQuery(sort?: string): string | undefined {
  if (!sort) return undefined
  if (sort === 'price-asc' || sort === 'price-desc') return 'price'
  if (sort === 'rating') return 'rating'
  if (sort === 'popular') return 'viewCount'
  if (sort === 'newest') return 'createdAt'
  return undefined
}

function getSortOrderFromQuery(sort?: string): 'ASC' | 'DESC' {
  if (sort === 'price-asc') return 'ASC'
  return 'DESC'
}

function CategoryPage() {
  const { slug } = Route.useParams()
  const { sort, minPrice, maxPrice, condition, minRating } = Route.useSearch()
  const navigate = Route.useNavigate()

  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [isLoadingCategory, setIsLoadingCategory] = useState(true)
  const [products, setProducts] = useState<Array<any>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalProducts, setTotalProducts] = useState(0)

  const addItem = useCartStore((state) => state.addItem)

  const categoryId = slugToCategoryId(slug)
  const categoryName = slugToCategoryName(slug)
  const remainingProducts = totalProducts - products.length

  // Fetch products for this category
  const fetchCategoryProducts = async (page: number = 1) => {
    try {
      setIsLoading(true)
      const response = await getProductsByCategory(categoryId, {
        page,
        limit: 20,
        minPrice: minPrice ?? undefined,
        maxPrice: maxPrice ?? undefined,
        condition: condition ?? undefined,
        minRating: minRating ?? undefined,
        sortBy: getSortByFromQuery(sort),
        sortOrder: getSortOrderFromQuery(sort),
      })
      setProducts(response.items)
      setTotalProducts(response.total)
      setCurrentPage(response.page)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch on mount and when filters change
  useEffect(() => {
    setIsLoadingCategory(true)
    fetchCategoryProducts(1)
    setIsLoadingCategory(false)
  }, [slug, sort, minPrice, maxPrice, condition, minRating])

  const handleLoadMore = async () => {
    if (currentPage < totalPages) {
      try {
        setIsLoading(true)
        const response = await getProductsByCategory(categoryId, {
          page: currentPage + 1,
          limit: 20,
          minPrice: minPrice ?? undefined,
          maxPrice: maxPrice ?? undefined,
          condition: condition ?? undefined,
          minRating: minRating ?? undefined,
          sortBy: getSortByFromQuery(sort),
          sortOrder: getSortOrderFromQuery(sort),
        })
        setProducts([...products, ...response.items])
        setCurrentPage(response.page)
      } catch (error) {
        console.error('Error loading more products:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSortChange = (value: string) => {
    navigate({
      search: (prev) => ({ ...prev, sort: value }),
    })
  }

  const handlePriceChange = (min: number, max: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        minPrice: min > 0 ? min : undefined,
        maxPrice: max < 999999999 ? max : undefined,
      }),
    })
  }

  const handleConditionChange = (cond: string | null) => {
    navigate({
      search: (prev) => ({ ...prev, condition: cond || undefined }),
    })
  }

  const handleRatingChange = (rating: number | null) => {
    navigate({
      search: (prev) => ({ ...prev, minRating: rating || undefined }),
    })
  }

  const handleClearFilters = () => {
    navigate({
      search: () => ({ sort: 'newest' }),
    })
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
    const product = products.find((p) => p.id === id)
    if (product) {
      addItem({
        id: `cart-${id}-${Date.now()}`,
        productId: id,
        image:
          product.imageUrl ||
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        title: product.name,
        price: product.price,
      })
    }
  }

  const handleBuy = (id: string) => {
    handleAddToCart(id)
  }

  if (isLoadingCategory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">Đang tải...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sticky category info + filters on the left for desktop */}
          <aside className="lg:col-span-1 order-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-card rounded-lg border p-5 md:p-6">
                <h1 className="text-2xl md:text-3xl font-bold">{categoryName}</h1>
                <p className="text-muted-foreground mt-2">
                  Tìm thấy {totalProducts} sản phẩm
                </p>
              </div>
              <CategoryFilters
                onSortChange={handleSortChange}
                onPriceChange={handlePriceChange}
                onConditionChange={handleConditionChange}
                onRatingChange={handleRatingChange}
                activeSort={sort}
                activeCondition={condition}
                activeRating={minRating}
                activeMinPrice={minPrice}
                activeMaxPrice={maxPrice}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3 order-2">
            {isLoading && products.length === 0 && (
              <div className="text-center text-muted-foreground">
                Đang tải sản phẩm...
              </div>
            )}

            {!isLoading && products.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                <p>Không tìm thấy sản phẩm phù hợp</p>
              </div>
            )}

            {products.length > 0 && (
              <>
                <ProductGrid
                  products={products.map((p) => ({
                    id: p.id,
                    image:
                      p.imageUrl ||
                      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
                    title: p.name,
                    price: p.price,
                    isTrending: p.isTrending,
                  }))}
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
                      {isLoading
                        ? 'Đang tải...'
                        : `Xem thêm ${remainingProducts} sản phẩm`}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
