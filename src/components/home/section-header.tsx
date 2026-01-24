import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  viewAllLink?: string
  viewAllText?: string
  icon?: React.ReactNode
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  viewAllLink,
  viewAllText = 'Xem tất cả',
  icon,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-primary">{icon}</div>}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
        >
          {viewAllText}
          <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  )
}
