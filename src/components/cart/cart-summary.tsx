'use client'

import { Suspense, lazy, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { selectIsAuthenticated, useAuthStore } from '@/store/auth'

const AuthModal = lazy(() =>
  import('@/components/auth/auth-modal').then((module) => ({
    default: module.AuthModal,
  })),
)

interface CartSummaryProps {
  totalPrice: number
  itemCount: number
  onCheckout?: () => void
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export function CartSummary({
  totalPrice,
  itemCount,
  onCheckout,
}: CartSummaryProps) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    onCheckout?.()
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    // After successful login, proceed with checkout
    onCheckout?.()
  }

  return (
    <>
      <Card className="p-6 sticky top-4">
        <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tổng số lượng:</span>
            <span className="font-medium">{itemCount} sản phẩm</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tạm tính:</span>
            <span className="font-medium">{formatPrice(totalPrice)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Phí vận chuyển:</span>
            <span className="font-medium text-green-600">Miễn phí</span>
          </div>

          <div className="pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Tổng cộng:</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full bg-red-500 hover:bg-red-600 text-white"
          onClick={handleCheckoutClick}
          disabled={itemCount === 0}
        >
          Thanh toán
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Bạn có thể chỉnh sửa đơn hàng trước khi thanh toán
        </p>
      </Card>

      {showAuthModal && (
        <Suspense fallback={null}>
          <AuthModal
            open={showAuthModal}
            onOpenChange={setShowAuthModal}
            defaultTab="signin"
            onSignInSuccess={handleAuthSuccess}
          />
        </Suspense>
      )}
    </>
  )
}
