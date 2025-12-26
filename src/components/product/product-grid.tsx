import { ProductCard } from "./product-card"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  image: string
  title: string
  price: number
  postedAt: string
  location?: string
}

interface ProductGridProps {
  products: Array<Product>
  favorites?: Set<string>
  onFavoriteToggle?: (id: string) => void
  className?: string
}

export function ProductGrid({
  products,
  favorites = new Set(),
  onFavoriteToggle,
  className,
}: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6",
        className
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          isFavorite={favorites.has(product.id)}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  )
}
