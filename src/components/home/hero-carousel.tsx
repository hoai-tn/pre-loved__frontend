import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Banner {
  id: string
  image: string
  title?: string
  subtitle?: string
  link?: string
  backgroundColor?: string
}

interface HeroCarouselProps {
  banners: Array<Banner>
  autoPlayInterval?: number
  className?: string
}

export function HeroCarousel({
  banners,
  autoPlayInterval = 4000,
  className,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (isHovered || banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [banners.length, autoPlayInterval, isHovered])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (banners.length === 0) return null

  return (
    <div
      className={cn('relative group overflow-hidden rounded-xl', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Banner Images */}
      <div className="relative aspect-[16/6] md:aspect-[21/6]">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={cn(
              'absolute inset-0 transition-all duration-500 ease-in-out',
              index === currentIndex
                ? 'opacity-100 translate-x-0'
                : index < currentIndex
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full',
            )}
            style={{ backgroundColor: banner.backgroundColor || '#f5f5f5' }}
          >
            <img
              src={banner.image}
              alt={banner.title || `Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {(banner.title || banner.subtitle) && (
              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 bg-gradient-to-r from-black/30 to-transparent">
                {banner.title && (
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                    {banner.title}
                  </h2>
                )}
                {banner.subtitle && (
                  <p className="text-base md:text-xl text-white/90 mb-4 drop-shadow-md">
                    {banner.subtitle}
                  </p>
                )}
                {banner.link && (
                  <Button
                    size="lg"
                    className="w-fit bg-white text-primary hover:bg-white/90"
                  >
                    Khám phá ngay
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToPrevious}
          >
            <ChevronLeft className="size-6" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToNext}
          >
            <ChevronRight className="size-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75',
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
