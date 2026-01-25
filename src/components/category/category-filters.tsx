import { useState } from 'react'
import { X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface CategoryFiltersProps {
  onSortChange?: (sort: string) => void
  onPriceChange?: (min: number, max: number) => void
  onConditionChange?: (condition: string | null) => void
  onRatingChange?: (rating: number | null) => void
  activeSort?: string
  activeCondition?: string | null
  activeRating?: number | null
  activeMinPrice?: number | null
  activeMaxPrice?: number | null
  onClearFilters?: () => void
}

export function CategoryFilters({
  onSortChange,
  onPriceChange,
  onConditionChange,
  onRatingChange,
  activeSort = 'newest',
  activeCondition = null,
  activeRating = null,
  activeMinPrice = null,
  activeMaxPrice = null,
  onClearFilters,
}: CategoryFiltersProps) {
  const [minPrice, setMinPrice] = useState<string>(activeMinPrice?.toString() || '')
  const [maxPrice, setMaxPrice] = useState<string>(activeMaxPrice?.toString() || '')

  const handleSortChange = (value: string) => {
    onSortChange?.(value)
  }

  const handlePriceApply = () => {
    const min = minPrice ? Number(minPrice) : 0
    const max = maxPrice ? Number(maxPrice) : 999999999
    onPriceChange?.(min, max)
  }

  const handleConditionChange = (value: string) => {
    if (activeCondition === value) {
      onConditionChange?.(null)
    } else {
      onConditionChange?.(value)
    }
  }

  const handleRatingChange = (value: number) => {
    if (activeRating === value) {
      onRatingChange?.(null)
    } else {
      onRatingChange?.(value)
    }
  }

  const hasActiveFilters =
    activeCondition || activeRating || activeMinPrice || activeMaxPrice

  return (
    <div className="space-y-6">
      {/* Active Filters Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {activeCondition && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              {conditionLabel(activeCondition)}
              <button
                onClick={() => onConditionChange?.(null)}
                className="ml-1 hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {activeRating && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              ⭐ {activeRating}+ sao
              <button
                onClick={() => onRatingChange?.(null)}
                className="ml-1 hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {(activeMinPrice || activeMaxPrice) && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              {activeMinPrice && `₫${activeMinPrice.toLocaleString()}`}
              {activeMinPrice && activeMaxPrice ? ' - ' : ''}
              {activeMaxPrice && `₫${activeMaxPrice.toLocaleString()}`}
              <button
                onClick={() => {
                  setMinPrice('')
                  setMaxPrice('')
                  onPriceChange?.(0, 999999999)
                }}
                className="ml-1 hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearFilters}
              className="text-xs"
            >
              Xóa tất cả
            </Button>
          )}
        </div>
      )}

      <div className="bg-card rounded-lg p-6 shadow-sm space-y-6">
        {/* Sort */}
        <div>
          <h3 className="font-semibold mb-3 text-sm">Sắp xếp theo</h3>
          <Select value={activeSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="price-asc">Giá: Thấp → Cao</SelectItem>
              <SelectItem value="price-desc">Giá: Cao → Thấp</SelectItem>
              <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
              <SelectItem value="popular">Phổ biến nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-px bg-border" />

        {/* Price Range */}
        <div>
          <h3 className="font-semibold mb-3 text-sm">Khoảng giá</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Từ"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="text-sm"
              />
              <Input
                type="number"
                placeholder="Đến"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="text-sm"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePriceApply}
              className="w-full"
            >
              Áp dụng
            </Button>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Condition */}
        <div>
          <h3 className="font-semibold mb-3 text-sm">Tình trạng</h3>
          <RadioGroup
            value={activeCondition || ''}
            onValueChange={handleConditionChange}
          >
            {['new', 'like-new', 'good', 'fair'].map((cond) => (
              <div key={cond} className="flex items-center space-x-2">
                <RadioGroupItem value={cond} id={cond} />
                <Label
                  htmlFor={cond}
                  className="font-normal cursor-pointer text-sm"
                >
                  {conditionLabel(cond)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="h-px bg-border" />

        {/* Rating */}
        <div>
          <h3 className="font-semibold mb-3 text-sm">Đánh giá</h3>
          <div className="space-y-2">
            {[4, 3, 2].map((stars) => (
              <Button
                key={stars}
                size="sm"
                variant={activeRating === stars ? 'default' : 'outline'}
                onClick={() => handleRatingChange(stars)}
                className="w-full justify-start text-xs"
              >
                {'⭐'.repeat(stars)} {stars}+ sao
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function conditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    new: 'Mới',
    'like-new': 'Như mới',
    good: 'Tốt',
    fair: 'Bình thường',
  }
  return labels[condition] || condition
}
