'use client'

import { useEffect, useState } from 'react'
import { Package, Search } from 'lucide-react'
import { OrderCard } from './order-card'
import { PurchaseHistoryPageSkeleton } from './purchase-history-skeleton'
import type { Order } from './types'
import type { ApiProduct, OrderResponse } from '@/services/api/types'
import { getOrders } from '@/services/api/orders.api'
import { getProductById } from '@/services/api/products.api'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/store/auth'

/**
 * Transform API order response to component Order type
 */
async function transformOrderToComponentOrder(
  apiOrder: OrderResponse,
): Promise<Order> {
  // Default placeholder image
  const defaultImage =
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'

  // Fetch product details for each item
  const items = await Promise.all(
    apiOrder.items.map(async (item) => {
      let product: ApiProduct | null = null
      try {
        product = await getProductById(item.productId)
      } catch (error) {
        // If product fetch fails, use placeholder data
        console.warn(`Failed to fetch product ${item.productId}:`, error)
      }

      return {
        id: item.id,
        productId: item.productId,
        name: product?.name || `Sản phẩm #${item.productId}`,
        imageUrl: product?.thumbnailUrl || defaultImage,
        price: item.price,
        quantity: item.quantity,
        category: product?.category?.name
          ? `Phân loại: ${product.category.name}`
          : undefined,
      }
    }),
  )

  // Map status from API to component status
  const statusMap: Record<string, Order['status']> = {
    pending: 'pending',
    processing: 'processing',
    shipping: 'shipping',
    delivered: 'delivered',
    cancelled: 'cancelled',
    refunded: 'refunded',
  }

  const orderStatus: Order['status'] = statusMap[apiOrder.status] ?? 'pending'

  return {
    id: apiOrder.id,
    orderDate: apiOrder.createdAt,
    status: orderStatus,
    items,
    total: apiOrder.totalAmount,
    shippingFee: 0, // API doesn't provide shipping fee separately
    deliveryAddress: {
      name: 'Người nhận',
      phone: 'Chưa cập nhật',
      address: 'Chưa cập nhật',
    },
  }
}

export function PurchaseHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [orders, setOrders] = useState<Array<Order>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuthStore()

  useEffect(() => {
    async function fetchOrders() {
      try {
        setIsLoading(true)
        setError(null)

        if (!user?.id) {
          throw new Error('Đăng nhập để xem lịch sử mua hàng')
        }

        const apiOrders = await getOrders(user.id)
        const transformedOrders = await Promise.all(
          apiOrders.map(transformOrderToComponentOrder),
        )
        setOrders(transformedOrders)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Không thể tải danh sách đơn hàng',
        )
        console.error('Error fetching orders:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user?.id])

  // Calculate tab counts
  const orderTabs = [
    {
      value: 'all',
      label: 'Tất cả',
      count: orders.length,
    },
    {
      value: 'processing',
      label: 'Chờ xử lý',
      count: orders.filter((o) => o.status === 'processing').length,
    },
    {
      value: 'shipping',
      label: 'Đang giao',
      count: orders.filter((o) => o.status === 'shipping').length,
    },
    {
      value: 'delivered',
      label: 'Đã giao',
      count: orders.filter((o) => o.status === 'delivered').length,
    },
    {
      value: 'cancelled',
      label: 'Đã hủy',
      count: orders.filter((o) => o.status === 'cancelled').length,
    },
  ]

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )

    const matchesTab = activeTab === 'all' || order.status === activeTab

    return matchesSearch && matchesTab
  })

  if (isLoading) {
    return <PurchaseHistoryPageSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-24 w-24 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Có lỗi xảy ra</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Lịch Sử Mua Hàng</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi đơn hàng của bạn
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            {orderTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                    {tab.count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Package className="h-24 w-24 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Không tìm thấy đơn hàng
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? 'Thử tìm kiếm với từ khóa khác'
                    : 'Bạn chưa có đơn hàng nào'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
