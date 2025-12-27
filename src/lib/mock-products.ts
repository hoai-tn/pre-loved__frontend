// Mock product data for development
export interface Product {
  id: string
  image: string
  title: string
  price: number
  postedAt: string
  location?: string
}

export const mockProducts: Array<Product> = [
  {
    id: '1',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    title: 'Đồng hồ nam chính hãng, đẹp như mới',
    price: 2500000,
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    location: 'Quận 1, TP. Hồ Chí Minh',
  },
  {
    id: '2',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    title: 'Giày thể thao Nike Air Max size 42',
    price: 1500000,
    postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    location: 'Quận 3, TP. Hồ Chí Minh',
  },
  {
    id: '3',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    title: 'Tai nghe Bluetooth Sony WH-1000XM4',
    price: 3500000,
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    location: 'Quận 7, TP. Hồ Chí Minh',
  },
  {
    id: '4',
    image:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    title: 'Kính mát Ray-Ban chính hãng',
    price: 1200000,
    postedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    location: 'Quận 2, TP. Hồ Chí Minh',
  },
  {
    id: '5',
    image:
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
    title: 'Laptop Dell XPS 13, i7, 16GB RAM, SSD 512GB',
    price: 15000000,
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    location: 'Quận 10, TP. Hồ Chí Minh',
  },
  {
    id: '6',
    image:
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop',
    title: 'Điện thoại iPhone 12 Pro Max 128GB',
    price: 18000000,
    postedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    location: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
  },
  {
    id: '7',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    title: 'Áo khoác da nam thật, size L',
    price: 2800000,
    postedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    location: 'Quận Phú Nhuận, TP. Hồ Chí Minh',
  },
  {
    id: '8',
    image:
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
    title: 'Túi xách nữ hàng hiệu, còn mới 95%',
    price: 3200000,
    postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    location: 'Quận 5, TP. Hồ Chí Minh',
  },
  {
    id: '9',
    image:
      'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?w=400&h=400&fit=crop',
    title: 'Máy ảnh Canon EOS R6 Mark II',
    price: 45000000,
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    location: 'Quận 1, TP. Hồ Chí Minh',
  },
  {
    id: '10',
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    title: 'Xe đạp địa hình Trek, size M',
    price: 8500000,
    postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    location: 'Quận Thủ Đức, TP. Hồ Chí Minh',
  },
  {
    id: '11',
    image:
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop',
    title: 'Giày chạy bộ Adidas Ultraboost',
    price: 2200000,
    postedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    location: 'Quận Tân Bình, TP. Hồ Chí Minh',
  },
  {
    id: '12',
    image:
      'https://images.unsplash.com/photo-1606800057515-f9fc831a7583?w=400&h=400&fit=crop',
    title: 'Bàn phím cơ Logitech MX Keys',
    price: 1800000,
    postedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    location: 'Quận 11, TP. Hồ Chí Minh',
  },
]
