'use client'

import { ShoppingCart } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'
import { useCheckoutStore } from '@/store/checkout'

interface ProductActionButtonsProps {
  productId: string
  image: string
  title: string
  price: number
  location?: string
  quantity?: number
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export function ProductActionButtons({
  productId,
  image,
  title,
  price,
  location,
  quantity = 1,
}: ProductActionButtonsProps) {
  const addItem = useCartStore((state) => state.addItem)
  const setBuyNowItem = useCheckoutStore((state) => state.setBuyNowItem)
  const navigate = useNavigate()

  const handleAddToCart = () => {
    const id = `cart-${productId}-${Date.now()}`
    for (let i = 0; i < quantity; i++) {
      addItem({ id, productId: Number(productId), image, title, price, location })
    }
  }

  const handleBuyNow = () => {
    setBuyNowItem({
      id: `buy-now-${productId}`,
      productId: Number(productId),
      image,
      title,
      price,
      quantity,
      location,
    })
    navigate({ to: '/checkout' })
  }

  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        size="lg"
        className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
        onClick={handleAddToCart}
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        Thêm Vào Giỏ Hàng
      </Button>
      <Button
        size="lg"
        className="flex-1 bg-red-500 hover:bg-red-600 text-white"
        onClick={handleBuyNow}
      >
        Mua Với Voucher {formatPrice(price)}
      </Button>
    </div>
  )
}
