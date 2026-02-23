'use client'

import { useEffect, useState } from 'react'
import { Package, Search } from 'lucide-react'
import { OrderCard } from './order-card'
import { PurchaseHistoryPageSkeleton } from './purchase-history-skeleton'
import type { Order, OrderStatus } from './types'
import type { OrderResponse } from '@/services/api/types'
import { getOrders } from '@/services/api/orders.api'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/store/auth'

// TODO: Remove mock data when API is ready
const MOCK_ORDERS: Array<Order> = [
  {
    id: 31,
    user_id: '7',
    status: 'pending',
    total: '10000000.00',
    created_at: '2026-01-01T00:39:56.373Z',
    updated_at: '2026-01-01T00:39:56.373Z',
    items: [
      {
        id: 45,
        order_id: 31,
        product_id: '9',
        quantity: 2,
        price: '10000000.00',
      },
    ],
  },
  {
    id: 32,
    user_id: '7',
    status: 'shipping',
    total: '29990000.00',
    created_at: '2026-01-02T15:45:00.000Z',
    updated_at: '2026-01-02T15:45:00.000Z',
    items: [
      {
        id: 46,
        order_id: 32,
        product_id: '12',
        quantity: 1,
        price: '29990000.00',
      },
    ],
  },
  {
    id: 33,
    user_id: '7',
    status: 'cancelled',
    total: '35990000.00',
    created_at: '2025-12-18T09:00:00.000Z',
    updated_at: '2025-12-19T11:00:00.000Z',
    items: [
      {
        id: 47,
        order_id: 33,
        product_id: '15',
        quantity: 1,
        price: '35990000.00',
      },
    ],
  },
  {
    id: 34,
    user_id: '7',
    status: 'delivered',
    total: '9480000.00',
    created_at: '2025-12-25T08:15:00.000Z',
    updated_at: '2025-12-28T14:30:00.000Z',
    items: [
      {
        id: 48,
        order_id: 34,
        product_id: '20',
        quantity: 1,
        price: '6990000.00',
      },
      {
        id: 49,
        order_id: 34,
        product_id: '21',
        quantity: 1,
        price: '2490000.00',
      },
    ],
  },
]

/**
 * Transform API order response to component Order type
 */
function transformOrderToComponentOrder(apiOrder: OrderResponse): Order {
  return {
    id: Number(apiOrder.id),
    user_id: String(apiOrder.userId),
    status: (apiOrder.status as OrderStatus) ?? 'pending',
    total: String(apiOrder.totalAmount),
    created_at: apiOrder.createdAt,
    updated_at: apiOrder.updatedAt,
    thumbnail_url: apiOrder.items[0]?.thumbnailUrl ?? null,
    items: apiOrder.items.map((item) => ({
      id: Number(item.id),
      order_id: Number(apiOrder.id),
      product_id: item.productId,
      quantity: item.quantity,
      price: String(item.price),
      thumbnail_url: item.thumbnailUrl ?? null,
    })),
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
          // TODO: Remove mock fallback when API is ready
          setOrders(MOCK_ORDERS)
          return
        }

        const apiOrders = await getOrders(user.id)
        const transformedOrders = apiOrders.map(transformOrderToComponentOrder)
        setOrders(transformedOrders)
      } catch (err) {
        // TODO: Remove mock fallback when API is ready
        console.warn('API failed, using mock data:', err)
        setOrders(MOCK_ORDERS)
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
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      String(order.id).includes(query) ||
      order.items.some((item) =>
        item.product_id.toLowerCase().includes(query),
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
              name="orderSearch"
              autoComplete="off"
              aria-label="Tìm kiếm đơn hàng"
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
