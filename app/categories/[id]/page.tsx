"use client"

import { useState, useEffect, Suspense } from "react"
import { useParams } from "next/navigation"
import ProductGridEnhanced from "@/components/product-grid-enhanced"
import { apiService } from "@/services/api"

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  product_count?: number
}

function CategoryProducts() {
  const params = useParams()
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await apiService.get<Category[]>("/api/categories")
        const categories = response.data || []
        const foundCategory = categories.find((cat: Category) => cat.id === Number(params.id))
        setCategory(foundCategory || null)
      } catch (error) {
        console.error("Failed to fetch category:", error)
        setCategory(null)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCategory()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">{category?.name || "Category"}</h1>
        {category?.description && <p className="text-lg text-gray-600">{category.description}</p>}
        {category?.product_count && (
          <p className="text-sm text-gray-500 mt-2">{category.product_count} products available</p>
        )}
      </div>
      <ProductGridEnhanced categoryId={Number(params.id)} showFilters={true} />
    </div>
  )
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryProducts />
    </Suspense>
  )
}
