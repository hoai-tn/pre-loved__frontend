'use client'

import { useState } from 'react'
import { Facebook, Heart, MessageCircle, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ProductShareActions() {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" className="h-8 w-8">
          <Facebook className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" className="h-8 w-8">
          <MessageCircle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" className="h-8 w-8">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsFavorite(!isFavorite)}
        className={cn('gap-2', isFavorite && 'text-red-500')}
      >
        <Heart className={cn('h-4 w-4', isFavorite && 'fill-red-500')} />
        <span>Đã thích ({isFavorite ? 1 : 0})</span>
      </Button>
    </div>
  )
}
