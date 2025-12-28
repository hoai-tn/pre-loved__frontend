'use client'

import { createFileRoute } from '@tanstack/react-router'
import { PurchaseHistoryPage } from '@/components/purchase/purchase-history-page'

export const Route = createFileRoute('/user/purchase')({
  component: PurchaseHistoryPage,
})

