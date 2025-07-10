"use client"

import { useState, useEffect } from "react"
import ProductCard from "./product-card"
import LoadingSkeleton from "./loading-skeleton"
import { Button } from "@/components/ui/button"
import { apiService } from "@/services/api"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  rating?: number
  category?: string
  category_id?: number
  stock?: number
  on_sale?: boolean
  created_at?: string
  updated_at?: string
}

interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  total_pages: number
}

interface ProductGridProps {
  categoryId?: number
  searchQuery?: string
  limit?: number
}

export default function ProductGrid({ categoryId, searchQuery, limit = 12 }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalPages, setTotalPages] = useState(1)

  const fetchProducts = async (pageNum: number, reset = false) => {
    try {
      if (pageNum === 1) setLoading(true)
      else setLoadingMore(true)

      let endpoint = "/api/products"
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString(),
      })

      if (categoryId) {
        endpoint = `/api/categories/${categoryId}/products`
      } else if (searchQuery) {
        endpoint = "/api/products/search"
        params.append("q", searchQuery)
      }

      const response = await apiService.get<ProductListResponse>(`${endpoint}?${params}`)
      const responseData = response.data

      // Handle both direct array and object with products array
      let newProducts: Product[] = []
      let total = 0
      let totalPagesCount = 1

      if (Array.isArray(responseData)) {
        // Direct array response
        newProducts = responseData
        total = responseData.length
        totalPagesCount = Math.ceil(total / limit)
      } else if (responseData && typeof responseData === "object") {
        // Object response with products array
        newProducts = responseData.products || []
        total = responseData.total || newProducts.length
        totalPagesCount = responseData.total_pages || Math.ceil(total / limit)
      }

      if (reset || pageNum === 1) {
        setProducts(newProducts)
      } else {
        setProducts((prev) => [...prev, ...newProducts])
      }

      setTotalPages(totalPagesCount)
      setHasMore(pageNum < totalPagesCount)
      setError(null)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products. Please check your internet connection.")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchProducts(1, true)
  }, [categoryId, searchQuery, limit])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchProducts(nextPage)
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => fetchProducts(1, true)}>Try Again</Button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
        {searchQuery && <p className="text-gray-400 mt-2">Try adjusting your search terms</p>}
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              category: product.category || "General",
              onSale: product.on_sale || false,
            }}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <Button onClick={loadMore} disabled={loadingMore} size="lg">
            {loadingMore ? "Loading..." : "Load More Products"}
          </Button>
        </div>
      )}
    </div>
  )
}
