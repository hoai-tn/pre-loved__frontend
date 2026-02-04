'use client'

import { Link } from '@tanstack/react-router'
import {
  CheckCircle,
  ChevronRight,
  Clock,
  MessageSquare,
  Package,
  RefreshCw,
  Truck,
  XCircle,
} from 'lucide-react'
import type { Order, OrderStatus } from './types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface OrderCardProps {
  order: Order
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getStatusInfo = (status: OrderStatus) => {
  const statusMap = {
    pending: {
      label: 'Chờ xác nhận',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    processing: {
      label: 'Đang xử lý',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    shipping: {
      label: 'Đang giao',
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    delivered: {
      label: 'Đã giao',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    cancelled: {
      label: 'Đã hủy',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    refunded: {
      label: 'Đã hoàn tiền',
      icon: RefreshCw,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
  }

  return statusMap[status]
}

export function OrderCard({ order }: OrderCardProps) {
  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Mã đơn hàng:</span>
            <span className="ml-2 font-semibold">{order.id}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div>
            <span className="text-sm text-muted-foreground">
              {formatDate(order.orderDate)}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor} border`}
        >
          <StatusIcon className="h-3 w-3 mr-1" />
          {statusInfo.label}
        </Badge>
      </div>

      {/* Items */}
      <div className="p-4">
        <div className="space-y-4 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4">
            {/* Product Image */}
            <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border bg-muted">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm mb-1 line-clamp-2">
                {item.name}
              </h4>
                {item.category && (
                  <p className="text-xs text-muted-foreground mb-2">
                    {item.category}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    x{item.quantity}
                  </span>
                  <span className="font-semibold text-primary">
                    {formatPrice(item.price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-sm text-muted-foreground">Tổng tiền:</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(order.total)}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              {order.items.length} sản phẩm
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
        <div className="flex items-center gap-2">
          {order.status === 'delivered' && (
            <>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                Đánh giá
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Mua lại
              </Button>
            </>
          )}
          {order.status === 'shipping' && (
            <Button variant="outline" size="sm">
              <Truck className="h-4 w-4 mr-1" />
              Theo dõi đơn hàng
            </Button>
          )}
          {order.status === 'processing' && (
            <Button variant="outline" size="sm" className="text-red-600">
              <XCircle className="h-4 w-4 mr-1" />
              Hủy đơn hàng
            </Button>
          )}
        </div>
        <Link
          to="/user/purchase/$orderId"
          params={{ orderId: order.id }}
          className="inline-flex"
        >
          <Button variant="ghost" size="sm">
            Xem chi tiết
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  )
}
