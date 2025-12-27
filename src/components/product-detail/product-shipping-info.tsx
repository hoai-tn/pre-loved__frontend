import { Check } from 'lucide-react'
import type { Shipping } from './types'
import { Card } from '@/components/ui/card'

interface ProductShippingInfoProps {
  shipping: Shipping
  warranty: string
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export function ProductShippingInfo({
  shipping,
  warranty,
}: ProductShippingInfoProps) {
  return (
    <Card className="p-4 space-y-2">
      <div className="text-sm font-medium">Vận Chuyển</div>
      <div className="text-sm text-muted-foreground space-y-1">
        <div>{shipping.description}</div>
        <div>Phí ship {formatPrice(shipping.fee)}</div>
        {shipping.voucher && (
          <div className="text-green-600">{shipping.voucher}</div>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-green-600 pt-2 border-t">
        <Check className="h-4 w-4" />
        <span>{warranty}</span>
      </div>
    </Card>
  )
}
