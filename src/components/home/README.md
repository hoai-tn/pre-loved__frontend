# Home Page Components

This folder contains reusable components for creating an engaging e-commerce home page, inspired by modern marketplaces like Shopee and CellphoneS.

## Components

### 1. HeroCarousel (`hero-carousel.tsx`)
An auto-playing banner carousel for promotional content.

**Features:**
- Auto-play with configurable interval
- Navigation arrows (visible on hover)
- Dot indicators
- Smooth transitions
- Pause on hover
- Support for title, subtitle, and CTA button

**Usage:**
```tsx
<HeroCarousel 
  banners={[
    {
      id: '1',
      image: 'https://...',
      title: 'Big Sale',
      subtitle: 'Up to 50% off',
      backgroundColor: '#ee4d2d'
    }
  ]}
  autoPlayInterval={4000}
/>
```

### 2. CategoryGrid (`category-grid.tsx`)
Display product categories with icons or images.

**Features:**
- Responsive grid layout (4-10 columns)
- Icon or image support
- Hover effects
- Links to category pages

**Usage:**
```tsx
<CategoryGrid 
  categories={[
    { id: 1, name: 'Điện Thoại', icon: 'smartphone', link: '/?categoryId=1' },
    { id: 2, name: 'Laptop', icon: 'laptop', link: '/?categoryId=2' }
  ]}
/>
```

**Available Icons:**
- smartphone, laptop, watch, headphones, camera, tv, home, shopping

### 3. FlashSale (`flash-sale.tsx`)
Time-limited sale section with countdown timer.

**Features:**
- Live countdown timer (hours:minutes:seconds)
- Progress bars showing sold/stock ratio
- Discount badges
- Product grid display
- Gradient background

**Usage:**
```tsx
<FlashSale
  products={flashSaleProducts}
  endTime={new Date(Date.now() + 3 * 60 * 60 * 1000)}
  favorites={favorites}
  onFavoriteToggle={handleFavoriteToggle}
  onAddToCart={handleAddToCart}
  onBuy={handleBuy}
/>
```

### 4. SectionHeader (`section-header.tsx`)
Reusable section title with optional "View All" link.

**Features:**
- Main title and optional subtitle
- Optional icon
- "View All" link with arrow
- Consistent styling

**Usage:**
```tsx
<SectionHeader
  title="Trending Products"
  subtitle="Most popular items"
  icon={<TrendingUp className="size-6" />}
  viewAllLink="/products"
  viewAllText="See all"
/>
```

### 5. ProductScroller (`product-scroller.tsx`)
Horizontal scrollable product list with navigation.

**Features:**
- Smooth scrolling
- Navigation arrows (visible on hover)
- Drag to scroll
- Responsive item sizing
- Generic - works with any item type

**Usage:**
```tsx
<ProductScroller
  items={products}
  renderItem={(product) => <ProductCard {...product} />}
  itemsPerView={{ mobile: 2, tablet: 4, desktop: 6 }}
/>
```

### 6. PromoBanners (`promo-banners.tsx`)
Grid of promotional banner cards.

**Features:**
- Responsive grid (1-3 columns)
- Image overlay with gradient
- Hover effects (scale & shadow)
- Customizable colors

**Usage:**
```tsx
<PromoBanners
  banners={[
    {
      id: '1',
      title: '40% Off Laptops',
      description: 'Limited time offer',
      image: 'https://...',
      link: '/laptops',
      backgroundColor: '#1e293b'
    }
  ]}
/>
```

## Design Principles

1. **Reusability**: All components are generic and can be reused across the app
2. **Responsiveness**: Mobile-first design with breakpoints for tablet and desktop
3. **Accessibility**: Proper semantic HTML and ARIA labels
4. **Performance**: Optimized animations and image loading
5. **Consistency**: Uses shadcn/ui components and Tailwind CSS

## Styling

All components use:
- Tailwind CSS for styling
- shadcn/ui design tokens (colors, spacing, etc.)
- Lucide React for icons
- Custom animations and transitions

## Integration

See [/routes/index.tsx](../../routes/index.tsx) for a complete example of how these components work together to create an engaging home page.
