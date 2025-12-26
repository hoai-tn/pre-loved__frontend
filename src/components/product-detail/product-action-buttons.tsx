import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductActionButtonsProps {
  price: number
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

export function ProductActionButtons({ price }: ProductActionButtonsProps) {
  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        size="lg"
        className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        Thêm Vào Giỏ Hàng
      </Button>
      <Button
        size="lg"
        className="flex-1 bg-red-500 hover:bg-red-600 text-white"
      >
        Mua Với Voucher {formatPrice(price)}
      </Button>
    </div>
  )
}

