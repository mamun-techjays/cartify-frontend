import { Suspense } from "react"
import HeroBanner from "@/components/hero-banner"
import ProductGridEnhanced from "@/components/product-grid-enhanced"
import CategorySection from "@/components/category-section"

export default function HomePage() {
  return (
    <div className="flex flex-col bg-gray-50">
      <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-2xl mx-4 mt-4" />}>
        <HeroBanner />
      </Suspense>

      <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse mx-4 mt-8 rounded-2xl" />}>
        <CategorySection />
      </Suspense>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium products at unbeatable prices
            </p>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 animate-pulse"
                  >
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
                ))}
              </div>
            }
          >
            <ProductGridEnhanced showFilters={false} limit={12} />
          </Suspense>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">Our Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our complete range of quality products across all categories
            </p>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 animate-pulse"
                  >
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
                ))}
              </div>
            }
          >
            <ProductGridEnhanced showFilters={false} limit={16} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
