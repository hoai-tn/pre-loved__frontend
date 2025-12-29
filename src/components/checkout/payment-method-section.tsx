'use client'

import { Banknote, CreditCard, Wallet } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface PaymentMethodSectionProps {
  selectedMethod: string
  onMethodChange: (method: string) => void
}

const paymentMethods = [
  {
    id: 'cod',
    name: 'Thanh toán khi nhận hàng',
    description: 'Thanh toán bằng tiền mặt khi nhận hàng',
    icon: Banknote,
  },
  {
    id: 'bank',
    name: 'Chuyển khoản ngân hàng',
    description: 'Chuyển khoản qua ngân hàng hoặc ví điện tử',
    icon: CreditCard,
    disabled: false,
  },
  {
    id: 'ewallet',
    name: 'Ví điện tử',
    description: 'MoMo, ZaloPay, VNPay',
    icon: Wallet,
    disabled: false,
  },
]

export function PaymentMethodSection({
  selectedMethod,
  onMethodChange,
}: PaymentMethodSectionProps) {
  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-1">Phương thức thanh toán</h3>
        <p className="text-sm text-muted-foreground">
          Thanh toán khi nhận hàng
        </p>
      </div>

      <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon
            const isSelected = selectedMethod === method.id
            const isDisabled = method.disabled

            return (
              <div
                key={method.id}
                className={`relative flex items-start gap-3 p-3 rounded-lg border-2 transition-colors ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed bg-muted/50'
                    : 'cursor-pointer'
                } ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => !isDisabled && onMethodChange(method.id)}
              >
                <RadioGroupItem
                  value={method.id}
                  id={method.id}
                  disabled={isDisabled}
                  className="mt-1"
                />
                <Icon
                  className={`h-5 w-5 mt-0.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}
                />
                <div className="flex-1">
                  <Label
                    htmlFor={method.id}
                    className={`font-semibold ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {method.name}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {method.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </RadioGroup>

      {/* Note */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản
          Shopee
        </p>
      </div>
    </Card>
  )
}
