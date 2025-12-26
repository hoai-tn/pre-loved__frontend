interface ProductBreadcrumbProps {
  title: string
}

export function ProductBreadcrumb({ title }: ProductBreadcrumbProps) {
  return (
    <nav className="text-sm text-muted-foreground mb-4">
      <span>Shopee</span>
      <span className="mx-2">/</span>
      <span>Sản phẩm</span>
      <span className="mx-2">/</span>
      <span className="text-foreground">{title}</span>
    </nav>
  )
}

