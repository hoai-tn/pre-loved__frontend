'use client'

import { Minus, Plus } from 'lucide-react'

interface ProductQuantitySelectorProps {
  quantity: number
  stock: number
  onQuantityChange: (delta: number) => void
  onQuantityInputChange: (value: number) => void
}

export function ProductQuantitySelector({
  quantity,
  stock,
  onQuantityChange,
  onQuantityInputChange,
}: ProductQuantitySelectorProps) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Số Lượng</div>
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => onQuantityChange(-1)}
            disabled={quantity <= 1}
            className="p-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            min="1"
            max={stock}
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1
              onQuantityInputChange(Math.max(1, Math.min(stock, val)))
            }}
            className="w-16 text-center border-0 focus:outline-none focus:ring-0"
          />
          <button
            onClick={() => onQuantityChange(1)}
            disabled={quantity >= stock}
            className="p-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="text-sm text-muted-foreground">
          {stock} sản phẩm có sẵn
        </span>
      </div>
    </div>
  )
}
