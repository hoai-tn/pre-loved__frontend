import { Link } from '@tanstack/react-router'
import {
  Camera,
  Headphones,
  Home,
  Laptop,
  ShoppingBag,
  Smartphone,
  Tv,
  Watch,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Category {
  id: string | number
  name: string
  icon?: string
  image?: string
  link: string
}

interface CategoryGridProps {
  categories: Array<Category>
  className?: string
}

const iconMap: Partial<Record<string, React.ComponentType<{ className?: string }>>> = {
  smartphone: Smartphone,
  laptop: Laptop,
  watch: Watch,
  headphones: Headphones,
  camera: Camera,
  tv: Tv,
  home: Home,
  shopping: ShoppingBag,
}

export function CategoryGrid({ categories, className }: CategoryGridProps) {
  const getIconComponent = (iconName?: string) => {
    if (!iconName) return ShoppingBag
    return iconMap[iconName.toLowerCase()] || ShoppingBag
  }

  return (
    <div
      className={cn(
        'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4',
        className,
      )}
    >
      {categories.map((category) => {
        const Icon = getIconComponent(category.icon)
        return (
          <Link
            key={category.id}
            to={category.link}
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors group"
          >
            {category.image ? (
              <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                <img
                  src={category.image}
                  alt={category.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="size-6 text-primary" />
              </div>
            )}
            <span className="text-xs text-center line-clamp-2 font-medium">
              {category.name}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
