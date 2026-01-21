import { Link } from '@tanstack/react-router'
import { Loader2, Package } from 'lucide-react'
import type { ApiProduct } from '@/services/api/types'

interface SearchResultsProps {
  results: ApiProduct[]
  isLoading: boolean
  error: string | null
  onResultClick: () => void
}

export function SearchResults({
  results,
  isLoading,
  error,
  onResultClick,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-4 px-3 text-sm text-destructive">
        Error: {error}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="py-8 px-3 text-center text-sm text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Không tìm thấy sản phẩm</p>
      </div>
    )
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      {results.map((product) => (
        <Link
          key={product.id}
          to="/products/$productId"
          params={{ productId: product.id }}
          onClick={onResultClick}
          className="flex items-center gap-3 px-3 py-3 hover:bg-accent transition-colors border-b last:border-b-0"
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate">{product.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-primary">
                {product.price.toLocaleString('vi-VN')} ₫
              </span>
              {product.condition && (
                <span className="text-xs text-muted-foreground">
                  • {product.condition}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
