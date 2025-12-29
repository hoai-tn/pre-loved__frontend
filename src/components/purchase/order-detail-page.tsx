'use client'

import { Link, useNavigate, useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
  MapPin,
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

// Mock order data - will be replaced with store/API later
const mockOrder: Order = {
  id: 'ORD-2024-001',
  orderDate: '2024-12-20T10:30:00',
  status: 'delivered',
  items: [
    {
      id: '1',
      productId: 'p1',
      title: 'Đồng Hồ Thông Minh HUAWEI WATCH GT6 Series',
      image: '/api/placeholder/80/80',
      price: 8070000,
      quantity: 1,
      category: 'Phân loại: Pro Deri/Cao Sang',
    },
    {
      id: '2',
      productId: 'p2',
      title: 'iPhone 15 Pro Max 256GB - Chính Hãng VN/A',
      image: '/api/placeholder/80/80',
      price: 29990000,
      quantity: 1,
      category: 'Phân loại: Titan Xanh',
    },
  ],
  total: 38060000,
  shippingFee: 0,
  deliveryAddress: {
    name: 'Trần Ngọc Hoài',
    phone: '(+84) 342 219 503',
    address:
      'Tòa nhà VCN đường A1, Vĩnh Điềm Trung, Xã Vĩnh Hiệp, Thành Phố Nha Trang, Khánh Hòa',
  },
  trackingNumber: 'SPX123456789',
  estimatedDelivery: '2024-12-25',
  deliveredAt: '2024-12-24T14:30:00',
  paymentMethod: 'Thanh toán khi nhận hàng (COD)',
  shippingMethod: 'Nhanh',
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

  return statusMap[status as keyof typeof statusMap]
}

export function OrderDetailPage() {
  const params = useParams({ from: '/user/purchase/$orderId' })
  const navigate = useNavigate()
  const order = mockOrder // TODO: Fetch order by params.orderId from store

  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // TODO: Show toast notification
  }

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
              <span className="font-semibold text-foreground">{order.id}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1"
                onClick={() => copyToClipboard(order.id)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="h-4 w-px bg-border" />
            <div>Ngày đặt: {formatDate(order.orderDate)}</div>
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
                  <OrderTimeline order={order} />
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
                      params={{ productId: item.productId }}
                      className="shrink-0"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border bg-muted hover:opacity-80 transition-opacity">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to="/products/$productId"
                        params={{ productId: item.productId }}
                      >
                        <h4 className="font-medium text-sm mb-1 line-clamp-2 hover:text-primary">
                          {item.title}
                        </h4>
                      </Link>
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
            </Card>

            {/* Delivery Address */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Địa Chỉ Nhận Hàng
              </h3>
              <div className="space-y-2">
                <div className="font-semibold">
                  {order.deliveryAddress.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.deliveryAddress.phone}
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.deliveryAddress.address}
                </div>
              </div>
            </Card>

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
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Phương thức vận chuyển:
                  </span>
                  <span className="font-medium">{order.shippingMethod}</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mã vận đơn:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">
                        {order.trackingNumber}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(order.trackingNumber!)}
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
                      {formatPrice(order.total - order.shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Phí vận chuyển:
                    </span>
                    <span className="font-medium">
                      {order.shippingFee > 0
                        ? formatPrice(order.shippingFee)
                        : 'Miễn phí'}
                    </span>
                  </div>
                  {order.discount && order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Giảm giá:</span>
                      <span className="font-medium text-green-600">
                        -{formatPrice(order.discount)}
                      </span>
                    </div>
                  )}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Tổng cộng:</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(order.total)}
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
                  <Button className="w-full" variant="destructive">
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

function OrderTimeline({ order }: { order: Order }) {
  const steps = [
    { label: 'Đơn hàng đã đặt', date: order.orderDate, completed: true },
    {
      label: 'Đơn hàng đã xác nhận',
      date: order.orderDate,
      completed: order.status !== 'pending',
    },
    {
      label: 'Đang vận chuyển',
      date: order.estimatedDelivery,
      completed: ['shipping', 'delivered'].includes(order.status),
    },
    {
      label: 'Đã giao hàng',
      date: order.deliveredAt || order.estimatedDelivery,
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
