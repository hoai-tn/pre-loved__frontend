'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem } from '@/store/cart/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CartItemCardProps {
  item: CartItem
  onRemove: (id: string) => void
  onQuantityChange: (id: string, quantity: number) => void
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export function CartItemCard({
  item,
  onRemove,
  onQuantityChange,
}: CartItemCardProps) {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, item.quantity + delta)
    onQuantityChange(item.id, newQuantity)
  }

  const handleQuantityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(e.target.value) || 1
    const newQuantity = Math.max(1, value)
    onQuantityChange(item.id, newQuantity)
  }

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border bg-muted">
          <img
            src={item.image}
            alt={item.title}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base mb-1 line-clamp-2">
            {item.title}
          </h3>
          {item.location && (
            <p className="text-sm text-muted-foreground mb-2">
              {item.location}
            </p>
          )}

          {/* Price */}
          <div className="mb-3">
            <span className="text-lg font-bold text-primary">
              {formatPrice(item.price)}
            </span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={item.quantity <= 1}
                aria-label="Giảm số lượng"
                className={cn(
                  'p-2 hover:bg-muted transition-colors',
                  item.quantity <= 1 && 'opacity-50 cursor-not-allowed',
                )}
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min="1"
                name="quantity"
                aria-label="Số lượng"
                value={item.quantity}
                onChange={handleQuantityInputChange}
                className="w-16 text-center border-0 bg-transparent"
              />
              <button
                onClick={() => handleQuantityChange(1)}
                aria-label="Tăng số lượng"
                className="p-2 hover:bg-muted transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa
            </Button>
          </div>

          {/* Subtotal */}
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Thành tiền:</span>
              <span className="text-lg font-bold text-primary">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
