interface ProductHeaderProps {
  title: string
  sold: number
}

export function ProductHeader({ title, sold }: ProductHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <h1 className="text-2xl font-semibold flex-1">{title}</h1>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>Chưa Có Đánh Giá</span>
        <span>Đã Bán {sold}</span>
      </div>
    </div>
  )
}
