import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Seller } from "./types"

interface ProductSellerInfoProps {
  seller: Seller
}

export function ProductSellerInfo({ seller }: ProductSellerInfoProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={seller.avatar}
            alt={seller.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          {seller.isMall && (
            <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
              Mall
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{seller.name}</h3>
            {seller.isOnline && (
              <span className="text-xs text-green-600">
                Online {seller.lastSeen}
              </span>
            )}
          </div>
          <div className="flex gap-4 mb-4">
            <Button variant="outline" size="sm">
              Chat Ngay
            </Button>
            <Button variant="outline" size="sm">
              Xem Shop
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Đánh Giá</div>
              <div className="font-semibold">{seller.rating.toFixed(1)}k</div>
            </div>
            <div>
              <div className="text-muted-foreground">Sản Phẩm</div>
              <div className="font-semibold">{seller.products}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Tỉ Lệ Phản Hồi</div>
              <div className="font-semibold">{seller.responseRate}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Thời Gian Phản Hồi</div>
              <div className="font-semibold">{seller.responseTime}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Tham Gia</div>
              <div className="font-semibold">{seller.joined}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Người Theo Dõi</div>
              <div className="font-semibold">{seller.followers.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

