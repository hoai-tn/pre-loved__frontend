"use client"

import { Heart } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  id: string
  image: string
  title: string
  price: number
  postedAt: string
  location?: string
  isFavorite?: boolean
  onFavoriteToggle?: (id: string) => void
  className?: string
}

export function ProductCard({
  id,
  image,
  title,
  price,
  postedAt,
  location,
  isFavorite = false,
  onFavoriteToggle,
  className,
}: ProductCardProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Vừa xong"
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} phút trước`
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} giờ trước`
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ngày trước`
    }
    return date.toLocaleDateString("vi-VN")
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavoriteToggle?.(id)
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/50 cursor-pointer",
        "!p-0 !py-0 !gap-0",
        className
      )}
    >
      <Link to="/" className="block">
        {/* Image Container with Heart Icon */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted rounded-t-xl">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Heart Icon - Top Right */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors z-10"
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-muted-foreground group-hover:text-red-500"
              )}
            />
          </Button>
        </div>

        {/* Content */}
        <CardContent className="p-3 space-y-1">
          <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem] text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          {location && (
            <p className="text-xs text-muted-foreground truncate">
              {location}
            </p>
          )}
        </CardContent>

        {/* Footer with Price and Time */}
        <CardFooter className="px-3 pb-3 pt-0 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-lg font-bold text-primary">
              {formatPrice(price)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatTime(postedAt)}
            </p>
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}
