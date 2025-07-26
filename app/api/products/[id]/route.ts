import { NextResponse } from 'next/server'

const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and long battery life. Perfect for music lovers and professionals who need clear audio quality. Features include:<br><br>• Active noise cancellation<br>• 30-hour battery life<br>• Premium sound quality<br>• Comfortable over-ear design<br>• Built-in microphone for calls<br>• Quick charging capability",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop",
    ],
    rating: 4.5,
    category: "Electronics",
    category_id: 1,
    stock: 25,
    on_sale: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking with heart rate monitor and GPS. Track your workouts, monitor your health, and stay connected with this feature-rich smartwatch.<br><br>• Heart rate monitoring<br>• GPS tracking<br>• Water resistant<br>• Sleep tracking<br>• Smart notifications<br>• 7-day battery life",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    ],
    rating: 4.8,
    category: "Electronics",
    category_id: 1,
    stock: 15,
    on_sale: false,
    created_at: "2024-01-14T10:00:00Z",
    updated_at: "2024-01-14T10:00:00Z",
  },
  {
    id: 3,
    name: "Premium Running Shoes",
    description: "Comfortable and durable running shoes for all terrains. Engineered for maximum comfort and performance during your runs.<br><br>• Lightweight design<br>• Superior cushioning<br>• Breathable mesh upper<br>• Durable rubber outsole<br>• Reflective details<br>• Multiple color options",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop",
    ],
    rating: 4.6,
    category: "Sports",
    category_id: 4,
    stock: 30,
    on_sale: true,
    created_at: "2024-01-13T10:00:00Z",
    updated_at: "2024-01-13T10:00:00Z",
  },
  {
    id: 4,
    name: "Designer Coffee Maker",
    description: "Automatic coffee maker with programmable settings. Start your day with the perfect cup of coffee every time.<br><br>• Programmable timer<br>• 12-cup capacity<br>• Auto-shutoff feature<br>• Permanent filter<br>• Brew strength control<br>• Easy to clean design",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
    ],
    rating: 4.4,
    category: "Home & Garden",
    category_id: 3,
    stock: 12,
    on_sale: false,
    created_at: "2024-01-12T10:00:00Z",
    updated_at: "2024-01-12T10:00:00Z",
  },
  {
    id: 5,
    name: "Travel Laptop Backpack",
    description: "Waterproof laptop backpack with multiple compartments. Perfect for professionals and students who need to carry their devices safely.<br><br>• 15.6\" laptop compartment<br>• Waterproof material<br>• Multiple pockets<br>• Padded shoulder straps<br>• USB charging port<br>• Anti-theft design",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
    ],
    rating: 4.7,
    category: "Fashion",
    category_id: 2,
    stock: 20,
    on_sale: true,
    created_at: "2024-01-11T10:00:00Z",
    updated_at: "2024-01-11T10:00:00Z",
  },
]

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    const product = products.find(p => p.id === id)

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
} 