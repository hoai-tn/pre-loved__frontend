'use client'

import { useState } from 'react'
import { Package, Search } from 'lucide-react'
import { OrderCard } from './order-card'
import type { Order } from './types'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock orders data - will be replaced with store/API later
const mockOrders: Array<Order> = [
  {
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
  },
  {
    id: 'ORD-2024-002',
    orderDate: '2024-12-15T14:20:00',
    status: 'shipping',
    items: [
      {
        id: '3',
        productId: 'p3',
        title: 'MacBook Pro 14" M3 Pro 18GB/512GB - Space Black',
        image: '/api/placeholder/80/80',
        price: 52990000,
        quantity: 1,
        category: 'Phân loại: M3 Pro',
      },
    ],
    total: 52990000,
    shippingFee: 0,
    deliveryAddress: {
      name: 'Trần Ngọc Hoài',
      phone: '(+84) 342 219 503',
      address:
        'Tòa nhà VCN đường A1, Vĩnh Điềm Trung, Xã Vĩnh Hiệp, Thành Phố Nha Trang, Khánh Hòa',
    },
    trackingNumber: 'SPX987654321',
    estimatedDelivery: '2024-12-28',
  },
  {
    id: 'ORD-2024-003',
    orderDate: '2024-12-10T09:15:00',
    status: 'processing',
    items: [
      {
        id: '4',
        productId: 'p4',
        title: 'AirPods Pro (2nd generation) - USB-C',
        image: '/api/placeholder/80/80',
        price: 6490000,
        quantity: 2,
        category: 'Phân loại: Chính Hãng',
      },
    ],
    total: 12980000,
    shippingFee: 0,
    deliveryAddress: {
      name: 'Trần Ngọc Hoài',
      phone: '(+84) 342 219 503',
      address:
        'Tòa nhà VCN đường A1, Vĩnh Điềm Trung, Xã Vĩnh Hiệp, Thành Phố Nha Trang, Khánh Hòa',
    },
    estimatedDelivery: '2024-12-30',
  },
  {
    id: 'ORD-2024-004',
    orderDate: '2024-11-28T16:45:00',
    status: 'cancelled',
    items: [
      {
        id: '5',
        productId: 'p5',
        title: 'Samsung Galaxy S23 Ultra 256GB',
        image: '/api/placeholder/80/80',
        price: 25990000,
        quantity: 1,
        category: 'Phân loại: Phantom Black',
      },
    ],
    total: 25990000,
    shippingFee: 0,
    deliveryAddress: {
      name: 'Trần Ngọc Hoài',
      phone: '(+84) 342 219 503',
      address:
        'Tòa nhà VCN đường A1, Vĩnh Điềm Trung, Xã Vĩnh Hiệp, Thành Phố Nha Trang, Khánh Hòa',
    },
    cancelledAt: '2024-11-29T10:00:00',
    cancelReason: 'Khách hàng yêu cầu hủy',
  },
]

const orderTabs = [
  { value: 'all', label: 'Tất cả', count: 4 },
  { value: 'processing', label: 'Chờ xử lý', count: 1 },
  { value: 'shipping', label: 'Đang giao', count: 1 },
  { value: 'delivered', label: 'Đã giao', count: 1 },
  { value: 'cancelled', label: 'Đã hủy', count: 1 },
]

export function PurchaseHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )

    const matchesTab = activeTab === 'all' || order.status === activeTab

    return matchesSearch && matchesTab
  })

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
