'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/product/product-card'
import { getProductsByCategory } from '@/services/api/products.api'
import type { ApiProduct } from '@/services/api'

const RELATED_LIMIT = 6

interface ProductRelatedProps {
  categoryId?: string
  excludeProductId: string
}

export function ProductRelated({
  categoryId,
  excludeProductId,
}: ProductRelatedProps) {
  const [products, setProducts] = useState<Array<ApiProduct>>([])

  useEffect(() => {
    if (!categoryId) return

    getProductsByCategory(Number(categoryId))
      .then(({ items }) => {
        setProducts(
          items
            .filter((p) => p.id !== excludeProductId)
            .slice(0, RELATED_LIMIT),
        )
      })
      .catch(() => {})
  }, [categoryId, excludeProductId])

  if (!products.length) return null

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold mb-4">Sản Phẩm Tương Tự</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={product.thumbnailUrl || ''}
            title={product.name}
            price={product.price}
          />
        ))}
      </div>
    </section>
  )
}
