'use client'

import { createFileRoute } from '@tanstack/react-router'
import { OrderDetailPage } from '@/components/purchase/order-detail-page'

export const Route = createFileRoute('/user/purchase/$orderId')({
  component: OrderDetailPage,
})
