import { createFileRoute } from '@tanstack/react-router'
import { ProductDetail } from '@/components/product-detail'
import { mockProducts } from '@/lib/mock-products'

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetailPage,
  loader: ({ params }) => {
    const product = mockProducts.find((p) => p.id === params.productId)
    if (!product) {
      throw new Error('Product not found')
    }

    // Mock detailed product data
    const productDetail = {
      ...product,
      images: [
        product.image,
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&q=90',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&q=95',
      ],
      originalPrice: product.price * 1.1,
      discount: 10,
      colors: [
        { id: '1', name: 'Space Black', code: 'MDE04SA/A', available: true },
        { id: '2', name: 'Silver', code: 'MDE44SA/A', available: true },
      ],
      stock: 5,
      rating: 4.5,
      reviews: 1230,
      sold: 0,
      seller: {
        name: 'Futureworld',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        isOnline: true,
        lastSeen: '8 phút trước',
        isMall: true,
        rating: 4.8,
        products: 171,
        responseRate: 90,
        responseTime: 'trong vài giờ',
        joined: '7 năm trước',
        followers: 9900,
      },
      shipping: {
        fee: 0,
        estimatedDays: '2-7 ngày',
        description:
          'Hàng Đặt Trước (có hàng sau 5 ngày) Nhận từ 2 Th01 - 7 Th01',
        voucher: 'Tặng Voucher 15.000₫ nếu đơn giao sau thời gian trên.',
      },
      vouchers: [{ label: 'Giảm 2tr₫', value: 2000000 }],
      installment: {
        months: 12,
        monthlyPayment: 3683250,
        interestRate: 0,
      },
      warranty:
        'Trả hàng miễn phí 15 ngày - Chính hãng 100% - Miễn phí vận chuyển',
    }

    return { productDetail }
  },
})

function ProductDetailPage() {
  const { productDetail } = Route.useLoaderData()
  return <ProductDetail product={productDetail} />
}
