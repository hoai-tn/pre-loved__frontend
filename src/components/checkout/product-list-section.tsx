'use client'

import { Card } from '@/components/ui/card'

interface Product {
  id: string
  title: string
  image: string
  price: number
  quantity: number
  category?: string
}

interface ProductListSectionProps {
  products: Array<Product>
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export function ProductListSection({ products }: ProductListSectionProps) {
  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-lg">Sản phẩm</h3>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex gap-4">
            {/* Product Image */}
            <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border bg-muted">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm mb-1 line-clamp-2">
                {product.title}
              </h4>
              {product.category && (
                <p className="text-xs text-muted-foreground mb-2">
                  {product.category}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  x{product.quantity}
                </span>
                <span className="font-semibold text-primary">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t my-4" />

      {/* Total Items */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Tổng số tiền ({products.length} sản phẩm):
        </span>
        <span className="font-semibold text-lg">
          {formatPrice(
            products.reduce((sum, item) => sum + item.price * item.quantity, 0),
          )}
        </span>
      </div>
    </Card>
  )
}

