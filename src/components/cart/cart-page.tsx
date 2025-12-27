'use client'

import { ShoppingCart } from 'lucide-react'
import { CartItemCard } from './cart-item-card'
import { CartSummary } from './cart-summary'
import { useCartStore } from '@/store/cart'

export function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const getItemCount = useCartStore((state) => state.getItemCount)

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    console.log('Checkout', items)
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <ShoppingCart className="h-24 w-24 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Giỏ hàng trống</h2>
          <p className="text-muted-foreground mb-6">
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Giỏ hàng của tôi</h1>
        <p className="text-muted-foreground">
          Bạn có {items.length} sản phẩm trong giỏ hàng
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onRemove={removeItem}
              onQuantityChange={updateQuantity}
            />
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary
            totalPrice={getTotalPrice()}
            itemCount={getItemCount()}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  )
}
