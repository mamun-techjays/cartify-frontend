import { NextResponse } from 'next/server'

const banners = [
  {
    id: "1",
    title: "Summer Sale 2024",
    description: "Up to 70% off on selected items",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2070&h=800&fit=crop",
    cta_text: "Shop Now",
    cta_link: "/products",
  },
  {
    id: "2",
    title: "New Arrivals",
    description: "Discover the latest trends and styles",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=2070&h=800&fit=crop",
    cta_text: "Explore",
    cta_link: "/products",
  },
  {
    id: "3",
    title: "Free Shipping",
    description: "On orders over $50 - Limited time offer",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=2340&h=800&fit=crop",
    cta_text: "Learn More",
    cta_link: "/products",
  },
  {
    id: "4",
    title: "Electronics Sale",
    description: "Latest gadgets at unbeatable prices",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=2126&h=800&fit=crop",
    cta_text: "Shop Electronics",
    cta_link: "/products",
  },
]

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return NextResponse.json({
      success: true,
      data: banners,
      total: banners.length,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    )
  }
} 