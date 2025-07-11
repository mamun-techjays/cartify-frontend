import { NextResponse } from 'next/server'

const categories = [
  {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and electronic devices',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    productCount: 156,
    featured: true,
  },
  {
    id: 2,
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trendy clothing and accessories',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    productCount: 234,
    featured: true,
  },
  {
    id: 3,
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Everything for your home and garden',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    productCount: 189,
    featured: true,
  },
  {
    id: 4,
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Equipment and gear for active lifestyles',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    productCount: 98,
    featured: false,
  },
  {
    id: 5,
    name: 'Books & Media',
    slug: 'books-media',
    description: 'Books, movies, and digital content',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    productCount: 312,
    featured: false,
  },
  {
    id: 6,
    name: 'Health & Beauty',
    slug: 'health-beauty',
    description: 'Personal care and wellness products',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
    productCount: 145,
    featured: false,
  },
  {
    id: 7,
    name: 'Toys & Games',
    slug: 'toys-games',
    description: 'Fun for all ages',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    productCount: 87,
    featured: false,
  },
  {
    id: 8,
    name: 'Automotive',
    slug: 'automotive',
    description: 'Car parts and accessories',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
    productCount: 67,
    featured: false,
  },
]

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return NextResponse.json({
      success: true,
      data: categories,
      total: categories.length,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
} 