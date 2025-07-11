import { NextResponse } from 'next/server'

const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and long battery life",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.5,
    category: "Electronics",
    stock: 25,
    on_sale: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking with heart rate monitor and GPS",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.8,
    category: "Electronics",
    stock: 15,
    on_sale: false,
    created_at: "2024-01-14T10:00:00Z",
    updated_at: "2024-01-14T10:00:00Z",
  },
  {
    id: 3,
    name: "Premium Running Shoes",
    description: "Comfortable and durable running shoes for all terrains",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    rating: 4.6,
    category: "Sports",
    stock: 30,
    on_sale: true,
    created_at: "2024-01-13T10:00:00Z",
    updated_at: "2024-01-13T10:00:00Z",
  },
  {
    id: 4,
    name: "Designer Coffee Maker",
    description: "Automatic coffee maker with programmable settings",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
    rating: 4.4,
    category: "Home & Garden",
    stock: 12,
    on_sale: false,
    created_at: "2024-01-12T10:00:00Z",
    updated_at: "2024-01-12T10:00:00Z",
  },
  {
    id: 5,
    name: "Travel Laptop Backpack",
    description: "Waterproof laptop backpack with multiple compartments",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    rating: 4.7,
    category: "Fashion",
    stock: 20,
    on_sale: true,
    created_at: "2024-01-11T10:00:00Z",
    updated_at: "2024-01-11T10:00:00Z",
  },
  {
    id: 6,
    name: "Portable Bluetooth Speaker",
    description: "Waterproof portable speaker with 20-hour battery life",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    rating: 4.3,
    category: "Electronics",
    stock: 18,
    on_sale: false,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z",
  },
  {
    id: 7,
    name: "Organic Cotton T-Shirt",
    description: "Comfortable organic cotton t-shirt in various colors",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    rating: 4.2,
    category: "Fashion",
    stock: 50,
    on_sale: true,
    created_at: "2024-01-09T10:00:00Z",
    updated_at: "2024-01-09T10:00:00Z",
  },
  {
    id: 8,
    name: "Smart Home Security Camera",
    description: "1080p security camera with night vision and motion detection",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    rating: 4.5,
    category: "Electronics",
    stock: 8,
    on_sale: false,
    created_at: "2024-01-08T10:00:00Z",
    updated_at: "2024-01-08T10:00:00Z",
  },
  {
    id: 9,
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat with carrying strap",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    rating: 4.6,
    category: "Sports",
    stock: 35,
    on_sale: true,
    created_at: "2024-01-07T10:00:00Z",
    updated_at: "2024-01-07T10:00:00Z",
  },
  {
    id: 10,
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all devices",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
    rating: 4.4,
    category: "Electronics",
    stock: 22,
    on_sale: false,
    created_at: "2024-01-06T10:00:00Z",
    updated_at: "2024-01-06T10:00:00Z",
  },
  {
    id: 11,
    name: "Stainless Steel Water Bottle",
    description: "Insulated water bottle keeps drinks cold for 24 hours",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    rating: 4.8,
    category: "Home & Garden",
    stock: 40,
    on_sale: true,
    created_at: "2024-01-05T10:00:00Z",
    updated_at: "2024-01-05T10:00:00Z",
  },
  {
    id: 12,
    name: "Gaming Mouse RGB",
    description: "High-precision gaming mouse with customizable RGB lighting",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    rating: 4.7,
    category: "Electronics",
    stock: 15,
    on_sale: false,
    created_at: "2024-01-04T10:00:00Z",
    updated_at: "2024-01-04T10:00:00Z",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = searchParams.get('sort_order') || 'DESC'
    const minPrice = parseFloat(searchParams.get('min_price') || '0')
    const maxPrice = parseFloat(searchParams.get('max_price') || '1000')

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))

    // Filter products by price
    let filteredProducts = products.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    )

    // Sort products
    filteredProducts.sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a]
      let bValue = b[sortBy as keyof typeof b]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (sortOrder === 'ASC') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // Paginate results
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
    const total = filteredProducts.length
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        products: paginatedProducts,
        total,
        total_pages: totalPages,
        current_page: page,
        limit,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
} 