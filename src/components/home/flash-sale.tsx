import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { SectionHeader } from './section-header'
import { ProductCard } from '@/components/product/product-card'
import { cn } from '@/lib/utils'

interface FlashSaleProduct {
  id: string
  image: string
  title: string
  price: number
  originalPrice: number
  discount: number
  sold: number
  stock: number
  location?: string
}

interface FlashSaleProps {
  products: Array<FlashSaleProduct>
  endTime: Date
  favorites?: Set<string>
  onFavoriteToggle?: (id: string) => void
  onAddToCart?: (id: string) => void
  onBuy?: (id: string) => void
  className?: string
}

interface TimeLeft {
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(endTime: Date): TimeLeft {
  const difference = endTime.getTime() - new Date().getTime()

  if (difference <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    hours: Math.floor(difference / (1000 * 60 * 60)),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

export function FlashSale({
  products,
  endTime,
  favorites = new Set(),
  onFavoriteToggle,
  onAddToCart,
  onBuy,
  className,
}: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(endTime))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endTime))
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  const formatTime = (value: number) => value.toString().padStart(2, '0')

  return (
    <div className={cn('bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-6 rounded-xl', className)}>
      <div className="flex items-center justify-between mb-6">
        <SectionHeader
          title="⚡ Flash Sale"
          subtitle="Giá sốc trong thời gian có hạn"
          icon={<Clock className="size-6 text-orange-500" />}
          className="mb-0"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Kết thúc trong
          </span>
          <div className="flex items-center gap-1">
            <TimeBox value={formatTime(timeLeft.hours)} />
            <span className="text-lg font-bold">:</span>
            <TimeBox value={formatTime(timeLeft.minutes)} />
            <span className="text-lg font-bold">:</span>
            <TimeBox value={formatTime(timeLeft.seconds)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <div key={product.id} className="relative">
            <ProductCard
              {...product}
              isFavorite={favorites.has(product.id)}
              isHideFavoriteButton={true}
              isHideHeartButton={true}
              onFavoriteToggle={onFavoriteToggle}
              onAddToCart={onAddToCart}
              onBuy={onBuy}
            />
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
              -{product.discount}%
            </div>
            <div className="mt-2">
              <ProgressBar
                sold={product.sold}
                stock={product.stock}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TimeBox({ value }: { value: string }) {
  return (
    <div className="bg-primary text-primary-foreground w-9 h-9 rounded-md flex items-center justify-center font-bold text-lg">
      {value}
    </div>
  )
}

function ProgressBar({ sold, stock }: { sold: number; stock: number }) {
  const percentage = (sold / stock) * 100
  const remaining = stock - sold

  return (
    <div className="space-y-1">
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full flex items-center justify-center text-[10px] text-white font-bold transition-all duration-300"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        >
          {percentage > 20 && `${Math.round(percentage)}%`}
        </div>
      </div>
      <div className="text-xs text-center text-muted-foreground">
        Còn {remaining} sản phẩm
      </div>
    </div>
  )
}
