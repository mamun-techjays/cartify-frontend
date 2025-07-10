import { Suspense } from "react"
import ProductGridEnhanced from "@/components/product-grid-enhanced"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">All Products</h1>
        <p className="text-lg text-gray-600">Discover our complete collection of premium products</p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductGridEnhanced showFilters={true} />
      </Suspense>
    </div>
  )
}
