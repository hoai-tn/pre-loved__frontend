'use client'

import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
  Loader2,
  MessageSquare,
  Package,
  RefreshCw,
  Truck,
  XCircle,
} from 'lucide-react'
import type { Order, OrderStatus, PaymentInfo, ShippingInfo } from './types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getOrderById } from '@/services/api'
import { AddressSection } from '@/components/shared/address-section'

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

  return statusMap[status as keyof typeof statusMap]
}

export function OrderDetailPage() {
  const { orderId } = useParams({ from: '/user/purchase/$orderId' })
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock shipping info (TODO: replace when backend provides this)
  const shipping: ShippingInfo = {
    name: '',
    phone: '',
    address: '',
    method: 'Giao hàng nhanh',
    trackingNumber: undefined,
    estimatedDelivery: '2026-01-05',
    fee: 0,
  }

  // Mock payment info (TODO: replace when backend provides this)
  const payment: PaymentInfo = {
    method: 'Thanh toán khi nhận hàng (COD)',
    status: 'Chưa thanh toán',
  }

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true)
        setError(null)
        const data = await getOrderById(orderId)

        // Transform OrderResponse to Order format
        const transformedOrder: Order = {
          id: Number(data.id),
          user_id: String(data.userId),
          status: data.status as OrderStatus,
          total: String(data.totalAmount),
          created_at: data.createdAt,
          updated_at: data.updatedAt,
          thumbnail_url: data.items[0]?.thumbnailUrl ?? null,
          items: data.items.map((item) => ({
            id: Number(item.id),
            order_id: Number(data.id),
            product_id: item.productId,
            quantity: item.quantity,
            price: String(item.price),
            thumbnail_url: item.thumbnailUrl ?? null,
          })),
        }

        setOrder(transformedOrder)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Không thể tải thông tin đơn hàng',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // TODO: Show toast notification
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">
            Đang tải thông tin đơn hàng...
          </p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate({ to: '/user/purchase' })}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Card className="p-6 text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Không thể tải đơn hàng
            </h2>
            <p className="text-muted-foreground">
              {error || 'Đơn hàng không tồn tại'}
            </p>
          </Card>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate({ to: '/user/purchase' })}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Chi Tiết Đơn Hàng</h1>
            <Badge
              variant="outline"
              className={`${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor} border text-base px-3 py-1`}
            >
              <StatusIcon className="h-4 w-4 mr-2" />
              {statusInfo.label}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div>
              <span>Mã đơn hàng: </span>
              <span className="font-semibold text-foreground">
                #{order.id}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1"
                onClick={() => copyToClipboard(String(order.id))}
                aria-label="Sao chép mã đơn hàng"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="h-4 w-px bg-border" />
            <div>Ngày đặt: {formatDate(order.created_at)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Order Status Timeline */}
            {order.status !== 'cancelled' && (
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Trạng Thái Đơn Hàng
                </h3>
                <div className="space-y-4">
                  <OrderTimeline order={order} shipping={shipping} />
                </div>
              </Card>
            )}

            {/* Products */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Sản Phẩm
              </h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                  >
                    <Link
                      to="/products/$productId"
                      params={{ productId: item.product_id }}
                      search={{ cat: undefined }}
                      className="shrink-0"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border bg-muted hover:opacity-80 transition-opacity">
                        {item.thumbnail_url ? (
                          <img
                            src={item.thumbnail_url}
                            alt={`Sản phẩm #${item.product_id}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Package className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to="/products/$productId"
                        params={{ productId: item.product_id }}
                        search={{ cat: undefined }}
                      >
                        <h4 className="font-medium text-sm mb-1 line-clamp-2 hover:text-primary">
                          Sản phẩm #{item.product_id}
                        </h4>
                      </Link>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          x{item.quantity}
                        </span>
                        <span className="font-semibold text-primary">
                          {formatPrice(Number(item.price))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Delivery Address */}
            <AddressSection readOnly title="Địa Chỉ Nhận Hàng" />

            {/* Payment & Shipping Info */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Thông Tin Thanh Toán
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Phương thức thanh toán:
                  </span>
                  <span className="font-medium">{payment.method}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Trạng thái thanh toán:
                  </span>
                  <span className="font-medium">{payment.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Phương thức vận chuyển:
                  </span>
                  <span className="font-medium">{shipping.method}</span>
                </div>
                {shipping.trackingNumber && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mã vận đơn:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">
                        {shipping.trackingNumber}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() =>
                          copyToClipboard(shipping.trackingNumber!)
                        }
                        aria-label="Sao chép mã vận đơn"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Order Summary */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Tổng Đơn Hàng</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính:</span>
                    <span className="font-medium">
                      {formatPrice(Number(order.total))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Phí vận chuyển:
                    </span>
                    <span className="font-medium">
                      {shipping.fee > 0
                        ? formatPrice(shipping.fee)
                        : 'Miễn phí'}
                    </span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Tổng cộng:</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(Number(order.total) + shipping.fee)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <div className="space-y-2">
                {order.status === 'delivered' && (
                  <>
                    <Button className="w-full" variant="default">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Đánh giá sản phẩm
                    </Button>
                    <Button className="w-full" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Mua lại
                    </Button>
                  </>
                )}
                {order.status === 'shipping' && (
                  <Button className="w-full" variant="default">
                    <Truck className="h-4 w-4 mr-2" />
                    Theo dõi đơn hàng
                  </Button>
                )}
                {order.status === 'processing' && (
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                        // TODO: Implement cancel order API
                      }
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Hủy đơn hàng
                  </Button>
                )}
                <Button className="w-full" variant="outline">
                  Liên hệ người bán
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderTimeline({
  order,
  shipping,
}: {
  order: Order
  shipping: ShippingInfo
}) {
  const steps = [
    { label: 'Đơn hàng đã đặt', date: order.created_at, completed: true },
    {
      label: 'Đơn hàng đã xác nhận',
      date: order.created_at,
      completed: order.status !== 'pending',
    },
    {
      label: 'Đang vận chuyển',
      date: shipping.estimatedDelivery,
      completed: ['shipping', 'delivered'].includes(order.status),
    },
    {
      label: 'Đã giao hàng',
      date: shipping.deliveredAt || shipping.estimatedDelivery,
      completed: order.status === 'delivered',
    },
  ]

  return (
    <div className="relative">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4 pb-6 last:pb-0">
          <div className="relative flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.completed
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step.completed ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-0.5 h-full absolute top-8 ${
                  step.completed ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
          <div className="flex-1 pb-2">
            <div className="font-medium">{step.label}</div>
            {step.date && (
              <div className="text-sm text-muted-foreground">
                {formatDate(step.date)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
