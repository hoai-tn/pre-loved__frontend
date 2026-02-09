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

// TODO: Remove mock data when API is ready
const MOCK_ORDERS: Array<Order> = [
  {
    id: 'ORD-2024-001',
    orderDate: '2024-12-20T10:30:00',
    status: 'delivered',
    items: [
      {
        id: '1',
        productId: 'p1',
        name: 'Đồng Hồ Thông Minh HUAWEI WATCH GT6 Series',
        imageUrl:
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        price: 8070000,
        quantity: 1,
        category: 'Phân loại: Pro Deri/Cao Sang',
      },
    ],
    total: 8070000,
    shippingFee: 0,
    deliveryAddress: {
      name: 'Trần Ngọc Hoài',
      phone: '(+84) 342 219 503',
      address:
        'Tòa nhà VCN đường A1, Vĩnh Điềm Trung, Xã Vĩnh Hiệp, Thành Phố Nha Trang, Khánh Hòa',
    },
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    shippingMethod: 'Nhanh',
  },
  {
    id: 'ORD-2024-002',
    orderDate: '2024-12-22T15:45:00',
    status: 'shipping',
    items: [
      {
        id: '2',
        productId: 'p2',
        name: 'iPhone 15 Pro Max 256GB - Chính Hãng VN/A',
        imageUrl:
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
        price: 29990000,
        quantity: 1,
        category: 'Phân loại: Titan Xanh',
      },
    ],
    total: 29990000,
    shippingFee: 0,
    trackingNumber: 'SPX987654321',
    estimatedDelivery: '2024-12-27',
    deliveryAddress: {
      name: 'Trần Ngọc Hoài',
      phone: '(+84) 342 219 503',
      address:
        'Tòa nhà VCN đường A1, Vĩnh Điềm Trung, Xã Vĩnh Hiệp, Thành Phố Nha Trang, Khánh Hòa',
    },
    paymentMethod: 'Ví MoMo',
    shippingMethod: 'Nhanh',
  },
  {
    id: 'ORD-2024-003',
    orderDate: '2024-12-18T09:00:00',
    status: 'cancelled',
    items: [
      {
        id: '3',
        productId: 'p3',
        name: 'Laptop ASUS ROG Strix G16 2024',
        imageUrl:
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
        price: 35990000,
        quantity: 1,
        category: 'Phân loại: RTX 4060',
      },
    ],
    total: 35990000,
    shippingFee: 0,
    cancelledAt: '2024-12-19T11:00:00',
    cancelReason: 'Đổi ý không muốn mua',
    deliveryAddress: {
      name: 'Trần Ngọc Hoài',
      phone: '(+84) 342 219 503',
      address:
        'Tòa nhà VCN đường A1, Vĩnh Điềm Trung, Xã Vĩnh Hiệp, Thành Phố Nha Trang, Khánh Hòa',
    },
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    shippingMethod: 'Tiêu chuẩn',
  },
  {
    id: 'ORD-2024-004',
    orderDate: '2024-12-25T08:15:00',
    status: 'processing',
    items: [
      {
        id: '4',
        productId: 'p4',
        name: 'Tai Nghe Sony WH-1000XM5 Chống Ồn',
        imageUrl:
          'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop',
        price: 6990000,
        quantity: 1,
        category: 'Phân loại: Đen',
      },
      {
        id: '5',
        productId: 'p5',
        name: 'Bàn Phím Cơ Keychron K8 Pro',
        imageUrl:
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
        price: 2490000,
        quantity: 1,
        category: 'Phân loại: Brown Switch',
      },
    ],
    total: 9480000,
    shippingFee: 0,
    deliveryAddress: {
      name: 'Trần Ngọc Hoài',
      phone: '(+84) 342 219 503',
      address:
        'Tòa nhà VCN đường A1, Vĩnh Điềm Trung, Xã Vĩnh Hiệp, Thành Phố Nha Trang, Khánh Hòa',
    },
    paymentMethod: 'Thẻ tín dụng',
    shippingMethod: 'Nhanh',
  },
]

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
          // TODO: Remove mock fallback when API is ready
          setOrders(MOCK_ORDERS)
          return
        }

        const apiOrders = await getOrders(user.id)
        const transformedOrders = await Promise.all(
          apiOrders.map(transformOrderToComponentOrder),
        )
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
