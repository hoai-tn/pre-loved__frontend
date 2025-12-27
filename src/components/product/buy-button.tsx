'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BuyButtonProps {
  onClick: (e: React.MouseEvent) => void
  className?: string
  size?: 'sm' | 'default' | 'lg'
  disabled?: boolean
  children?: React.ReactNode
}

export function BuyButton({
  onClick,
  className,
  size = 'sm',
  disabled = false,
  children = 'Mua ngay',
}: BuyButtonProps) {
  return (
    <Button
      className={cn(
        'w-full bg-primary hover:bg-primary/90 text-primary-foreground',
        className,
      )}
      onClick={onClick}
      size={size}
      disabled={disabled}
    >
      {children}
    </Button>
  )
}
