"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { apiService } from "@/services/api"
import { getCategoryImageUrl } from "@/utils/image-utils"

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
}

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.get("/api/categories")
        const categoriesData = response.data || []
        
        // Process category images to ensure correct URLs
        const processedCategories = Array.isArray(categoriesData) 
          ? categoriesData.map((category: any) => ({
              ...category,
              image: getCategoryImageUrl(category)
            }))
          : []
        
        setCategories(processedCategories)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        // Fallback categories
        setCategories([
          {
            id: 1,
            name: "Electronics",
            slug: "electronics",
            image:
              "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&h=100&fit=crop",
          },
          {
            id: 2,
            name: "Fashion",
            slug: "fashion",
            image:
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop",
          },
          {
            id: 3,
            name: "Home & Garden",
            slug: "home-garden",
            image:
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop",
          },
          {
            id: 4,
            name: "Sports",
            slug: "sports",
            image:
              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
          },
          {
            id: 5,
            name: "Books",
            slug: "books",
            image:
              "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop",
          },
          {
            id: 6,
            name: "Beauty",
            slug: "beauty",
            image:
              "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop",
          },
          {
            id: 7,
            name: "Toys & Games",
            slug: "toys-games",
            image:
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
          },
          {
            id: 8,
            name: "Automotive",
            slug: "automotive",
            image:
              "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=100&h=100&fit=crop",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return null
  }

  // Show only 12 categories (2 rows of 6) initially
  const displayedCategories = showAll ? categories : categories.slice(0, 12)
  const hasMoreCategories = categories.length > 12

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayedCategories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`} className="group">
              <div className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <img
                    src={category.image || "/placeholder.svg?height=40&width=40"}
                    alt={category.name}
                    className="w-8 h-8"
                  />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        
        {hasMoreCategories && (
          <div className="text-center mt-8">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="px-8 py-3 rounded-xl font-medium hover:bg-primary hover:text-white transition-all duration-200"
            >
              {showAll ? (
                <>
                  Show Less Categories
                  <ChevronDown className="ml-2 h-4 w-4 rotate-180 transition-transform" />
                </>
              ) : (
                <>
                  Load More Categories
                  <ChevronDown className="ml-2 h-4 w-4 transition-transform" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
