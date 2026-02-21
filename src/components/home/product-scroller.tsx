import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProductScrollerProps<T> {
  items: Array<T>
  renderItem: (item: T, index: number) => React.ReactNode
  itemsPerView?: {
    mobile: number
    tablet: number
    desktop: number
  }
  gap?: number
  className?: string
}

export function ProductScroller<T extends { id: string | number }>({
  items,
  renderItem,
  itemsPerView = { mobile: 2, tablet: 4, desktop: 6 },
  gap = 16,
  className,
}: ProductScrollerProps<T>) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setStartX(e.pageX - e.currentTarget.offsetLeft)
    setScrollLeft(e.currentTarget.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - e.currentTarget.offsetLeft
    const walk = (x - startX) * 2
    e.currentTarget.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('scroller-container')
    if (!container) return

    const scrollAmount = container.offsetWidth * 0.8
    const newPosition =
      direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    })
    setScrollPosition(newPosition)
  }

  const canScrollLeft = scrollPosition > 0
  const canScrollRight = scrollPosition < (items.length - itemsPerView.desktop) * 200

  return (
    <div className={cn('relative group/scroller', className)}>
      {/* Left Arrow */}
      {canScrollLeft && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover/scroller:opacity-100 transition-opacity"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="size-6" />
        </Button>
      )}

      {/* Scrollable Container */}
      <div
        id="scroller-container"
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ gap: `${gap}px` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className="w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(16.666%-14px)]"
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover/scroller:opacity-100 transition-opacity"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="size-6" />
        </Button>
      )}
    </div>
  )
}
