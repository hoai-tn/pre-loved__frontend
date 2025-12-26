"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ColorOption } from "./types"

interface ProductColorSelectorProps {
  colors: Array<ColorOption>
  selectedColor: string
  onColorChange: (colorId: string) => void
}

export function ProductColorSelector({
  colors,
  selectedColor,
  onColorChange,
}: ProductColorSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Màu Sắc</div>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => onColorChange(color.id)}
            disabled={!color.available}
            className={cn(
              "px-4 py-2 rounded border-2 text-sm font-medium transition-all",
              selectedColor === color.id
                ? "border-red-500 bg-red-50 text-red-700"
                : "border-gray-300 hover:border-red-300",
              !color.available && "opacity-50 cursor-not-allowed"
            )}
          >
            {selectedColor === color.id && (
              <Check className="inline-block h-4 w-4 mr-1" />
            )}
            {color.name} - {color.code}
          </button>
        ))}
      </div>
    </div>
  )
}

