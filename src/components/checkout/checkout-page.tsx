'use client'

import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { DeliveryAddressSection } from './delivery-address-section'
import { ProductListSection } from './product-list-section'
import { ShippingMethodSection } from './shipping-method-section'
import { PaymentMethodSection } from './payment-method-section'
import { OrderSummarySection } from './order-summary-section'
import type { AddressResponse } from '@/services/api'
import type { PaymentMethod, ShippingMethod } from '@/store/checkout/types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { selectCartItems, useCartStore } from '@/store/cart'
import { useCheckoutStore } from '@/store/checkout'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const cartItems = useCartStore(selectCartItems)
  const [, setSelectedAddress] = useState<AddressResponse | null>(null)

  // Checkout store
  const {
    shippingMethod,
    paymentMethod,
    note,
    voucherCode,
    isLoading,
    error,
    buyNowItem,
    setShippingMethod,
    setPaymentMethod,
    setNote,
    setVoucherCode,
    clearBuyNowItem,
    getSubtotal,
    getShippingFee,
    getDiscount,
    getTotal,
    placeOrder,
  } = useCheckoutStore()

  const checkoutItems = buyNowItem ? [buyNowItem] : cartItems

  // Calculate totals using store methods
  const subtotal = getSubtotal(checkoutItems)
  const shippingFee = getShippingFee()
  const discount = getDiscount()
  const total = getTotal(checkoutItems)

  const handlePlaceOrder = async () => {
    if (!user?.id) {
      // open login dialog or navigate to login page
      return
    }

    try {
      await placeOrder(checkoutItems, Number(user.id))
      clearBuyNowItem()
      // Navigate to success page or order confirmation
      // TODO: Navigate to order success page when available
      navigate({ to: '/user/purchase' })
    } catch (err) {
      // Error is already handled in the store
      console.error('Failed to place order:', err)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Thanh Toán</h1>
          <p className="text-muted-foreground">
            Hoàn tất đơn hàng của bạn trong vài bước đơn giản
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Delivery Address */}
            <DeliveryAddressSection
              onAddressChange={(address) => setSelectedAddress(address)}
            />

            {/* Product List */}
            <ProductListSection
              products={checkoutItems.map((item) => ({
                id: item.id,
                title: item.title,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                category: item.location,
              }))}
            />

            {/* Shipping Method */}
            <ShippingMethodSection
              selectedMethod={shippingMethod}
              onMethodChange={(method) =>
                setShippingMethod(method as ShippingMethod)
              }
              shippingFee={shippingFee}
            />

            {/* Payment Method */}
            <PaymentMethodSection
              selectedMethod={paymentMethod}
              onMethodChange={(method) =>
                setPaymentMethod(method as PaymentMethod)
              }
            />

            {/* Voucher Section */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Shopee Voucher</h3>
                <Button variant="link" className="text-primary p-0 h-auto">
                  Chọn Voucher
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  name="voucherCode"
                  autoComplete="off"
                  aria-label="Mã voucher"
                  placeholder="Nhập mã voucher"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: Implement voucher validation
                    console.log('Apply voucher:', voucherCode)
                  }}
                >
                  Áp dụng
                </Button>
              </div>
              {error && (
                <p className="text-sm text-destructive mt-2">{error}</p>
              )}
            </Card>

            {/* Note Section */}
            <Card className="p-4">
              <Label htmlFor="note" className="font-semibold mb-2 block">
                Lời nhắn
              </Label>
              <Input
                id="note"
                placeholder="Lưu ý cho Người bán..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <OrderSummarySection
                subtotal={subtotal}
                shippingFee={shippingFee}
                discount={discount}
                total={total}
                onPlaceOrder={handlePlaceOrder}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
