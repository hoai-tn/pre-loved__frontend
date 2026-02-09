'use client'

import { useState } from 'react'
import { ProductBreadcrumb } from './product-breadcrumb'
import { ProductImageCarousel } from './product-image-carousel'
import { ProductShareActions } from './product-share-actions'
import { ProductHeader } from './product-header'
import { ProductPricing } from './product-pricing'
import { ProductShippingInfo } from './product-shipping-info'
import { ProductColorSelector } from './product-color-selector'
import { ProductQuantitySelector } from './product-quantity-selector'
import { ProductActionButtons } from './product-action-buttons'
import { ProductSellerInfo } from './product-seller-info'
import type { ProductDetailData } from './types'

interface ProductDetailProps {
  product: ProductDetailData
  categorySlug?: string
}

export function ProductDetail({ product, categorySlug }: ProductDetailProps) {
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.id || '',
  )
  const [quantity, setQuantity] = useState(1)

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(product.stock, prev + delta)))
  }

  const handleQuantityInputChange = (value: number) => {
    setQuantity(value)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <ProductBreadcrumb title={product.title} categorySlug={categorySlug} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 lg:items-start">
        {/* Image Carousel Section */}
        <div className="space-y-4 lg:sticky lg:top-4">
          <ProductImageCarousel images={product.images} title={product.title} />
          <ProductShareActions />
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <ProductHeader title={product.title} sold={product.sold} />

          <ProductPricing
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
            vouchers={product.vouchers}
          />

          <ProductShippingInfo
            shipping={product.shipping}
            warranty={product.warranty}
          />

          <ProductColorSelector
            colors={product.colors}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />

          <ProductQuantitySelector
            quantity={quantity}
            stock={product.stock}
            onQuantityChange={handleQuantityChange}
            onQuantityInputChange={handleQuantityInputChange}
          />

          <ProductActionButtons
            productId={product.id}
            image={product.images[0] || ''}
            title={product.title}
            price={product.price}
            location={product.location}
          />
        </div>
      </div>
    </div>
  )
}
