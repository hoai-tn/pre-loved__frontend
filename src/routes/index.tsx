import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ProductGrid } from "@/components/product/product-grid"
import { mockProducts } from "@/lib/mock-products"

export const Route = createFileRoute("/")({ component: App })

function App() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Sản phẩm nổi bật</h1>
        <p className="text-muted-foreground">
          Khám phá những sản phẩm chất lượng với giá tốt nhất
        </p>
      </div>
      <ProductGrid
        products={mockProducts}
        favorites={favorites}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </div>
  )
}
