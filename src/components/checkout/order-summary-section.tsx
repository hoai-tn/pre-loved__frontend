'use client'

import { ShoppingBag } from 'lucide-react'
import { AuthButton } from '@/components/shared/auth-button'
import { Card } from '@/components/ui/card'

interface OrderSummarySectionProps {
  subtotal: number
  shippingFee: number
  discount: number
  total: number
  onPlaceOrder: () => void | Promise<void>
  isLoading?: boolean
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export function OrderSummarySection({
  subtotal,
  shippingFee,
  discount,
  total,
  onPlaceOrder,
  isLoading = false,
}: OrderSummarySectionProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Tóm tắt đơn hàng</h3>
      </div>

      <div className="space-y-3 mb-4">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tổng tiền hàng</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping Fee */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Tổng tiền phí vận chuyển
          </span>
          <span className="font-medium">{formatPrice(shippingFee)}</span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Giảm giá</span>
            <span className="font-medium text-green-600">
              -{formatPrice(discount)}
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t my-4" />

      {/* Total */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          Tổng thanh toán (2 sản phẩm):
        </span>
        <span className="text-2xl font-bold text-primary">
          {formatPrice(total)}
        </span>
      </div>

      {/* Place Order Button */}
      <AuthButton
        size="lg"
        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
        onAuthenticatedClick={onPlaceOrder}
        disabled={isLoading}
      >
        {isLoading ? 'Đang xử lý...' : 'Đặt hàng'}
      </AuthButton>

      {/* Additional Info */}
      <div className="mt-4 space-y-2">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <span>•</span>
          <span>
            Bằng việc tiến hành đặt mua hàng, bạn đồng ý với Điều khoản dịch vụ
          </span>
        </div>
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <span>•</span>
          <span>Đơn hàng sẽ được xử lý trong vòng 24h</span>
        </div>
      </div>
    </Card>
  )
}
