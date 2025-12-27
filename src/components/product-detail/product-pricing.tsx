import { Button } from '@/components/ui/button'

interface ProductPricingProps {
  price: number
  originalPrice: number
  discount: number
  vouchers: Array<{ label: string; value: number }>
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export function ProductPricing({
  price,
  originalPrice,
  discount,
  vouchers,
}: ProductPricingProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-red-500">
          {formatPrice(price)}
        </span>
        {originalPrice > price && (
          <span className="text-lg text-muted-foreground line-through">
            {formatPrice(originalPrice)}
          </span>
        )}
        {discount > 0 && (
          <span className="px-2 py-1 bg-red-100 text-red-500 text-sm font-semibold rounded">
            -{discount}%
          </span>
        )}
      </div>

      {/* Vouchers */}
      {vouchers.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Voucher Của Shop</div>
          <div className="flex flex-wrap gap-2">
            {vouchers.map((voucher, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                {voucher.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
