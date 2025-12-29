'use client'

import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronRight, Edit, MapPin } from 'lucide-react'
import { DeliveryAddressSection } from './delivery-address-section'
import { ProductListSection } from './product-list-section'
import { ShippingMethodSection } from './shipping-method-section'
import { PaymentMethodSection } from './payment-method-section'
import { OrderSummarySection } from './order-summary-section'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Mock data - will be replaced with store data later
const mockUser = {
  name: 'Trần Ngọc Hoài',
  phone: '(+84) 342 219 503',
  address:
    'Tòa nhà VCN đường A1, Vĩnh Điềm Trung, Xã Vĩnh Hiệp, Thành Phố Nha Trang, Khánh Hòa',
  isDefault: true,
}

const mockProducts = [
  {
    id: '1',
    title: 'Đồng Hồ Thông Minh HUAWEI WATCH GT6 Series',
    image: '/api/placeholder/80/80',
    price: 8070000,
    quantity: 1,
    category: 'Phân loại: Pro Deri/Cao Sang',
  },
]

export function CheckoutPage() {
  const navigate = useNavigate()
  const [shippingMethod, setShippingMethod] = useState('nhanh')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [note, setNote] = useState('')
  const [voucherCode, setVoucherCode] = useState('')

  // Calculate totals - will be handled by store later
  const subtotal = mockProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
  const shippingFee = shippingMethod === 'nhanh' ? 77800 : 50000
  const discount = 0 // Will calculate based on voucher
  const total = subtotal + shippingFee - discount

  const handlePlaceOrder = () => {
    // TODO: Implement order placement with store
    console.log('Place order:', {
      products: mockProducts,
      shippingMethod,
      paymentMethod,
      note,
      voucherCode,
      total,
    })
    // Navigate to success page or show confirmation
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
              user={mockUser}
              onEdit={() => console.log('Edit address')}
            />

            {/* Product List */}
            <ProductListSection products={mockProducts} />

            {/* Shipping Method */}
            <ShippingMethodSection
              selectedMethod={shippingMethod}
              onMethodChange={setShippingMethod}
              shippingFee={shippingFee}
            />

            {/* Payment Method */}
            <PaymentMethodSection
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
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
                  placeholder="Nhập mã voucher"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <Button variant="outline">Áp dụng</Button>
              </div>
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
