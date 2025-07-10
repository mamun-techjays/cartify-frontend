"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import ProductGrid from "@/components/product-grid"
import LoadingSkeleton from "@/components/loading-skeleton"

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      {query && <p className="text-gray-600 mb-8">Showing results for "{query}"</p>}
      <ProductGrid searchQuery={query} />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SearchResults />
    </Suspense>
  )
}
