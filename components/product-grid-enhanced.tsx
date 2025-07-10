"use client"

import { useState, useEffect, useMemo } from "react"
import ProductCard from "./product-card"
import ProductFilters from "./product-filters"
import { Button } from "@/components/ui/button"
import { Grid, List, Filter } from "lucide-react"
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

interface FilterOptions {
  priceRange: [number, number]
  categories: string[]
  rating: number
  sortBy: string
  inStock: boolean
  onSale: boolean
}

interface ProductGridEnhancedProps {
  categoryId?: number
  searchQuery?: string
  showFilters?: boolean
  limit?: number
}

const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 animate-pulse">
    <div className="h-56 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-8 w-8 bg-gray-200 rounded-lg" />
      </div>
    </div>
  </div>
)

export default function ProductGridEnhanced({
  categoryId,
  searchQuery,
  showFilters = true,
  limit = 12,
}: ProductGridEnhancedProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [totalPages, setTotalPages] = useState(1)

  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 1000],
    categories: [],
    rating: 0,
    sortBy: "newest",
    inStock: false,
    onSale: false,
  })

  const fetchProducts = async (pageNum: number, reset = false) => {
    try {
      if (pageNum === 1) setLoading(true)
      else setLoadingMore(true)

      let endpoint = "/api/products"
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString(),
      })

      // Add sorting parameters based on API spec
      if (filters.sortBy === "price-low") {
        params.append("sort_by", "price")
        params.append("sort_order", "ASC")
      } else if (filters.sortBy === "price-high") {
        params.append("sort_by", "price")
        params.append("sort_order", "DESC")
      } else if (filters.sortBy === "rating") {
        params.append("sort_by", "rating")
        params.append("sort_order", "DESC")
      } else {
        params.append("sort_by", "created_at")
        params.append("sort_order", "DESC")
      }

      // Add price filters
      if (filters.priceRange[0] > 0) {
        params.append("min_price", filters.priceRange[0].toString())
      }
      if (filters.priceRange[1] < 1000) {
        params.append("max_price", filters.priceRange[1].toString())
      }

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
  }, [categoryId, searchQuery, limit, filters.sortBy, filters.priceRange])

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Category filter (client-side for additional filtering)
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) => product.category && filters.categories.includes(product.category))
    }

    // Rating filter (client-side)
    if (filters.rating > 0) {
      filtered = filtered.filter((product) => (product.rating || 0) >= filters.rating)
    }

    // Stock filter (client-side)
    if (filters.inStock) {
      filtered = filtered.filter((product) => (product.stock || 0) > 0)
    }

    // Sale filter (client-side)
    if (filters.onSale) {
      filtered = filtered.filter((product) => product.on_sale)
    }

    return filtered
  }, [products, filters])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchProducts(nextPage)
  }

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      categories: [],
      rating: 0,
      sortBy: "newest",
      inStock: false,
      onSale: false,
    })
  }

  if (loading) {
    return (
      <div className={showFilters ? "grid grid-cols-1 lg:grid-cols-4 gap-8" : ""}>
        {showFilters && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          </div>
        )}
        <div className={showFilters ? "lg:col-span-3" : "w-full"}>
          <div
            className={
              showFilters
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            }
          >
            {Array.from({ length: showFilters ? 9 : limit }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => fetchProducts(1, true)}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className={showFilters ? "grid grid-cols-1 lg:grid-cols-4 gap-8" : ""}>
      {/* Filters Sidebar */}
      {showFilters && (
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
              isOpen={filtersOpen}
              onToggle={() => setFiltersOpen(!filtersOpen)}
            />
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className={showFilters ? "lg:col-span-3" : "w-full"}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredProducts.length} Products
              {searchQuery && ` for "${searchQuery}"`}
            </h2>
            {showFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="lg:hidden rounded-xl"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-xl"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-xl"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters</p>
            <Button onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div
              className={
                viewMode === "grid"
                  ? showFilters
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    category: product.category || "General",
                    onSale: product.on_sale || false,
                  }}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <Button onClick={loadMore} disabled={loadingMore} size="lg" className="rounded-xl">
                  {loadingMore ? "Loading..." : "Load More Products"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
