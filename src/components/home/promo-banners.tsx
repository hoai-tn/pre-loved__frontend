import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

interface PromoBanner {
  id: string
  title: string
  description?: string
  image: string
  link: string
  backgroundColor?: string
  textColor?: string
}

interface PromoBannersProps {
  banners: Array<PromoBanner>
  className?: string
}

export function PromoBanners({ banners, className }: PromoBannersProps) {
  if (banners.length === 0) return null

  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
        className,
      )}
    >
      {banners.map((banner) => (
        <Link
          key={banner.id}
          to={banner.link}
          className="group relative overflow-hidden rounded-xl aspect-2/1 shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: banner.backgroundColor || '#f5f5f5' }}
        >
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6">
            <h3
              className="text-lg md:text-xl font-bold mb-1"
              style={{ color: banner.textColor || 'white' }}
            >
              {banner.title}
            </h3>
            {banner.description && (
              <p
                className="text-sm opacity-90"
                style={{ color: banner.textColor || 'white' }}
              >
                {banner.description}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
