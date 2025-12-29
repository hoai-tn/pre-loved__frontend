'use client'

import { Edit, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DeliveryAddressSectionProps {
  user: {
    name: string
    phone: string
    address: string
    isDefault?: boolean
  }
  onEdit: () => void
}

export function DeliveryAddressSection({
  user,
  onEdit,
}: DeliveryAddressSectionProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Địa Chỉ Nhận Hàng</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="text-primary hover:text-primary/90"
        >
          <Edit className="h-4 w-4 mr-1" />
          Thay Đổi
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{user.name}</span>
          <span className="text-muted-foreground">{user.phone}</span>
          {user.isDefault && (
            <Badge variant="secondary" className="ml-2">
              Mặc Định
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{user.address}</p>
      </div>
    </Card>
  )
}
