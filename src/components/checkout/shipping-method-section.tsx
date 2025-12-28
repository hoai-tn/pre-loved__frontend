'use client'

import { Truck, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface ShippingMethodSectionProps {
  selectedMethod: string
  onMethodChange: (method: string) => void
  shippingFee: number
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

const shippingMethods = [
  {
    id: 'nhanh',
    name: 'Nhanh',
    description: 'Nhận từ 31 Th12 - 3 Th01',
    subDescription: 'Nhận Voucher trị giá 15.000đ nếu đơn hàng được giao đến bạn sau ngày 3 Tháng 1 2026.',
    price: 77800,
    icon: Truck,
  },
  {
    id: 'tietkiem',
    name: 'Tiết Kiệm',
    description: 'Nhận từ 5 Th1 - 8 Th01',
    subDescription: 'Phí vận chuyển rẻ hơn',
    price: 50000,
    icon: Clock,
  },
]

export function ShippingMethodSection({
  selectedMethod,
  onMethodChange,
  shippingFee,
}: ShippingMethodSectionProps) {
  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-1">
          Phương thức vận chuyển
        </h3>
        <p className="text-sm text-muted-foreground">
          Chọn phương thức giao hàng phù hợp với bạn
        </p>
      </div>

      <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
        <div className="space-y-3">
          {shippingMethods.map((method) => {
            const Icon = method.icon
            const isSelected = selectedMethod === method.id

            return (
              <div
                key={method.id}
                className={`relative flex items-start gap-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => onMethodChange(method.id)}
              >
                <RadioGroupItem
                  value={method.id}
                  id={method.id}
                  className="mt-1"
                />
                <Icon
                  className={`h-5 w-5 mt-0.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}
                />
                <div className="flex-1">
                  <Label
                    htmlFor={method.id}
                    className="font-semibold cursor-pointer"
                  >
                    {method.name}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {method.description}
                  </p>
                  {method.subDescription && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {method.subDescription}
                    </p>
                  )}
                </div>
                <span className="font-semibold text-primary">
                  {formatPrice(method.price)}
                </span>
              </div>
            )
          })}
        </div>
      </RadioGroup>
    </Card>
  )
}

