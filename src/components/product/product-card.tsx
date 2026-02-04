'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { ProductCardIconButton } from './product-card-icon-button'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/date-utils'

interface ProductCardProps {
  id: string
  image: string
  title: string
  price: number
  location?: string
  isFavorite?: boolean
  onFavoriteToggle?: (id: string) => void
  onAddToCart?: (id: string) => void
  onBuy?: (id: string) => void
  className?: string
}

export function ProductCard({
  id,
  image,
  title,
  price,
  location,
  isFavorite = false,
  onFavoriteToggle,
  onAddToCart,
  // onBuy,
  className,
}: ProductCardProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavoriteToggle?.(id)
  }

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart?.(id)
  }

  // const handleBuyClick = (e: React.MouseEvent) => {
  //   e.preventDefault()
  //   e.stopPropagation()
  //   onBuy?.(id)
  // }

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-lg hover:border-primary/50 cursor-pointer flex flex-col',
        className,
      )}
    >
      <Link
        to="/products/$productId"
        params={{ productId: id }}
        className="block"
      >
        {/* Image Container with Icons */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted rounded-t-xl">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Heart Icon - Top Right */}
          <ProductCardIconButton
            icon={Heart}
            onClick={handleFavoriteClick}
            ariaLabel={isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
            position="top-right"
            iconClassName={cn(
              isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-muted-foreground group-hover:text-red-500',
            )}
          />

          {/* Add to Cart Icon - Top Left */}
          <ProductCardIconButton
            icon={ShoppingCart}
            onClick={handleAddToCartClick}
            ariaLabel="Thêm vào giỏ hàng"
            position="top-left"
            iconClassName="text-muted-foreground group-hover:text-primary"
          />
        </div>

        {/* Content */}
        <div className="p-3 space-y-1">
          <h3 className="font-medium text-sm line-clamp-2 min-h-10 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>

          {location && (
            <p className="text-xs text-muted-foreground truncate">{location}</p>
          )}
        </div>

        {/* Footer with Price, Time, and Buy Button */}
        <div className="px-3 pb-3 pt-0 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg font-bold text-primary">
                {formatPrice(price)}
              </p>
            </div>
          </div>

          {/* Buy Button */}
          {/* <BuyButton onClick={handleBuyClick} /> */}
        </div>
      </Link>
    </div>
  )
}
