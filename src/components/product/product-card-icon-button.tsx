'use client'

import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProductCardIconButtonProps {
  icon: LucideIcon
  onClick: (e: React.MouseEvent) => void
  ariaLabel: string
  className?: string
  iconClassName?: string
  position?: 'top-left' | 'top-right'
}

export function ProductCardIconButton({
  icon: Icon,
  onClick,
  ariaLabel,
  className,
  iconClassName,
  position = 'top-right',
}: ProductCardIconButtonProps) {
  const positionClasses =
    position === 'top-left' ? 'top-2 left-2' : 'top-2 right-2'

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'absolute h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors z-10',
        positionClasses,
        className,
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <Icon className={cn('h-4 w-4 transition-colors', iconClassName)} />
    </Button>
  )
}
