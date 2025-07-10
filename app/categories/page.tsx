"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { apiService } from "@/services/api"

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  product_count?: number
}

const CategorySkeleton = () => (
  <div className="bg-white rounded-2xl shadow-soft p-6 animate-pulse">
    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
    <div className="h-4 bg-gray-200 rounded mb-2" />
    <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto" />
  </div>
)

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.get<Category[]>("/api/categories")
        setCategories(response.data || [])
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <CategorySkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">All Categories</h1>
        <p className="text-lg text-gray-600">Browse products by category to find exactly what you're looking for</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.id}`} className="group">
            <div className="bg-white rounded-2xl shadow-soft p-6 text-center hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <img
                  src={category.image || "/placeholder.svg?height=40&width=40"}
                  alt={category.name}
                  className="w-10 h-10 object-cover rounded-lg"
                />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors mb-2">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{category.description}</p>
              )}
              {category.product_count && <p className="text-xs text-gray-500">{category.product_count} products</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
