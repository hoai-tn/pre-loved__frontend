import { createFileRoute } from '@tanstack/react-router'
import type { ProductDetailData } from '@/components/product-detail'
import type { ApiProduct } from '@/services/api'
import { ProductDetail, ProductDetailSkeleton } from '@/components/product-detail'
import { getProductById } from '@/services/api/products.api'

/**
 * Map API product to ProductDetailData interface
 */
function mapApiProductToProductDetail(
  apiProduct: ApiProduct,
): ProductDetailData {
  // Default placeholder image
  const defaultImage =
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=800&fit=crop'

  // Use thumbnailUrl or default as fallback
  const mainImage = apiProduct.thumbnailUrl || defaultImage
  
  // Use catalogImagesUrl if available, otherwise fall back to thumbnailUrl
  const images = apiProduct.catalogImagesUrl.length > 0
    ? apiProduct.catalogImagesUrl
    : [mainImage]

  // Calculate original price and discount (10% discount as default)
  const originalPrice = Math.round(apiProduct.price * 1.1)
  const discount = Math.round(
    ((originalPrice - apiProduct.price) / originalPrice) * 100,
  )

  // Parse rating from string to number
  const rating = parseFloat(apiProduct.rating) || 0

  // Default avatar for seller
  const defaultAvatar =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'

  // Calculate monthly payment for installment (12 months, 0% interest)
  const monthlyPayment = Math.round(apiProduct.price / 12)

  return {
    id: apiProduct.id,
    title: apiProduct.name,
    price: apiProduct.price,
    originalPrice,
    discount,
    images,
    colors: [], // API doesn't provide colors, can be empty or add defaults
    stock: apiProduct.stockQuantity,
    rating,
    reviews: apiProduct.ratingCount,
    sold: 0, // API doesn't provide sold count, using 0

    shipping: {
      fee: 0,
      estimatedDays: '2-7 ngày',
      description: 'Miễn phí vận chuyển toàn quốc',
      voucher: 'Tặng Voucher 15.000₫ nếu đơn giao sau thời gian trên.',
    },
    vouchers: [], // API doesn't provide vouchers
    installment: {
      months: 12,
      monthlyPayment,
      interestRate: 0,
    },
    warranty:
      apiProduct.sellerNotes ||
      'Trả hàng miễn phí 15 ngày - Chính hãng 100% - Miễn phí vận chuyển',
  }
}

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetailPage,
  loader: async ({ params }) => {
    const apiProduct = await getProductById(params.productId)
    const productDetail = mapApiProductToProductDetail(apiProduct)
    return { productDetail }
  },
  pendingComponent: ProductDetailSkeleton,
})

function ProductDetailPage() {
  const { productDetail } = Route.useLoaderData()
  return <ProductDetail product={productDetail} />
}
