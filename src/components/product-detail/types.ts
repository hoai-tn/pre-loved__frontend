export interface ColorOption {
  id: string
  name: string
  code: string
  available: boolean
}

export interface Seller {
  name: string
  avatar: string
  isOnline: boolean
  lastSeen: string
  isMall: boolean
  rating: number
  products: number
  responseRate: number
  responseTime: string
  joined: string
  followers: number
}

export interface Shipping {
  fee: number
  estimatedDays: string
  description: string
  voucher?: string
}

export interface ProductDetailData {
  id: string
  title: string
  price: number
  originalPrice: number
  discount: number
  images: Array<string>
  colors: Array<ColorOption>
  stock: number
  rating: number
  reviews: number
  sold: number
  seller: Seller
  shipping: Shipping
  vouchers: Array<{ label: string; value: number }>
  installment: {
    months: number
    monthlyPayment: number
    interestRate: number
  }
  warranty: string
  location?: string
  postedAt: string
}

