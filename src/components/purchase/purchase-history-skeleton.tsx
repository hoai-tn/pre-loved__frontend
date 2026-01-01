'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function OrderCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-4">
          <div>
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="h-4 w-px bg-border" />
          <div>
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-6 w-24" />
      </div>

      {/* Items */}
      <div className="p-4">
        <div className="space-y-4 mb-4">
          {[1, 2].map((index) => (
            <div key={index} className="flex gap-4">
              {/* Product Image */}
              <Skeleton className="w-20 h-20 shrink-0 rounded-lg" />

              {/* Product Info */}
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Skeleton className="h-4 w-32" />
          <div className="text-right space-y-2">
            <Skeleton className="h-8 w-32 ml-auto" />
            <Skeleton className="h-3 w-24 ml-auto" />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
    </Card>
  )
}

export function PurchaseHistoryPageSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Search */}
        <div className="mb-6">
          <Skeleton className="h-10 w-full max-w-md" />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((index) => (
              <Skeleton key={index} className="h-10 w-32" />
            ))}
          </div>

          {/* Order Cards Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((index) => (
              <OrderCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

