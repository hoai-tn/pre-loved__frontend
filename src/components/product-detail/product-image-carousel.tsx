"use client"

import { useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { cn } from "@/lib/utils"

interface ProductImageCarouselProps {
  images: Array<string>
  title: string
}

export function ProductImageCarousel({ images, title }: ProductImageCarouselProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  const [thumbRef] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  })

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedImageIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on("select", onSelect)
    onSelect()

    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  const handleThumbClick = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index)
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Image Carousel */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
        <div className="embla overflow-hidden h-full" ref={emblaRef}>
          <div className="embla__container flex h-full">
            {images.map((image, index) => {
              // Use larger image size for main display
              const mainImageUrl = image.includes('?') 
                ? image.replace(/w=\d+/, 'w=800').replace(/h=\d+/, 'h=800')
                : `${image}?w=800&h=800&fit=crop`
              
              return (
                <div key={index} className="embla__slide flex-[0_0_100%] min-w-0 relative">
                  <img
                    src={mainImageUrl}
                    alt={`${title} - ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Thumbnail Carousel */}
      <div className="embla-thumb overflow-hidden" ref={thumbRef}>
        <div className="embla-thumb__container flex gap-2">
          {images.map((image, index) => {
            // Use smaller image size for thumbnails
            const thumbnailUrl = image.includes('?') 
              ? image.replace(/w=\d+/, 'w=80').replace(/h=\d+/, 'h=80')
              : `${image}?w=80&h=80&fit=crop`
            
            return (
              <button
                key={index}
                onClick={() => handleThumbClick(index)}
                className={cn(
                  "embla-thumb__slide flex-[0_0_auto] min-w-0 relative w-20 h-20 rounded border-2 overflow-hidden bg-muted transition-all shrink-0",
                  selectedImageIndex === index
                    ? "border-primary"
                    : "border-transparent hover:border-primary/50"
                )}
              >
                <img
                  src={thumbnailUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

