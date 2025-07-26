"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { apiService } from "@/services/api"
import Link from "next/link"
import { getBannerImageUrl } from "@/utils/image-utils"

interface Banner {
  id: string
  title: string
  description: string
  image: string
  cta_text: string
  cta_link: string
}

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        const response = await apiService.get("/api/banners")
        console.log("Banner API response:", response) // Debug log
        
        // Check if response has data property (API service wrapper)
        const bannersData = (response.data as any)?.data || response.data || []
        console.log("Banners data:", bannersData) // Debug log

        if (Array.isArray(bannersData) && bannersData.length > 0) {
          // Process banner images to ensure correct URLs
          const processedBanners = bannersData.map(banner => ({
            ...banner,
            image: getBannerImageUrl(banner)
          }))
          console.log("Processed banners:", processedBanners) // Debug log
          setBanners(processedBanners)
        } else {
          console.warn("API returned empty or invalid banner data, using fallback")
          // Use fallback banners if API returns empty or invalid data
          setBanners([
            {
              id: "1",
              title: "Summer Sale 2024",
              description: "Up to 70% off on selected items",
              image:
                "http://34.102.83.157/assets/images/Banners/banner1.webp",
              cta_text: "Shop Now",
              cta_link: "/products",
            },
            {
              id: "2",
              title: "New Arrivals",
              description: "Discover the latest trends and styles",
              image:
                "http://34.102.83.157/assets/images/Banners/banner2.webp",
              cta_text: "Explore",
              cta_link: "/products",
            },
            {
              id: "3",
              title: "Free Shipping",
              description: "On orders over $50 - Limited time offer",
              image:
                "http://34.102.83.157/assets/images/Banners/banner3.webp",
              cta_text: "Learn More",
              cta_link: "/products",
            },
          ])
        }
        setError(null)
      } catch (error) {
        console.error("Failed to fetch banners:", error)
        setError(error as Error)

        // Only use fallback on actual errors, not empty responses
        setBanners([
          {
            id: "1",
            title: "Welcome to Cartify",
            description: "Your one-stop shop for quality products",
            image:
              "http://34.102.83.157/assets/images/Banners/banner1.webp",
            cta_text: "Start Shopping",
            cta_link: "/products",
          },
          {
            id: "2",
            title: "Quality Products",
            description: "Discover amazing products at great prices",
            image:
              "http://34.102.83.157/assets/images/Banners/banner2.webp",
            cta_text: "Browse Now",
            cta_link: "/products",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [banners.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  if (loading) {
    return <div className="h-96 bg-gray-100 animate-pulse rounded-2xl mx-4 mt-6" />
  }

  if (error) {
    console.error("Banner error:", error)
    return (
      <section className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl mx-4 mt-6 shadow-medium bg-gradient-to-r from-red-500 to-red-600">
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 drop-shadow-lg">Banner Error</h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-md font-medium">Failed to load banners</p>
            <p className="text-lg mb-8 drop-shadow-md">{error.message}</p>
            <Link href="/products">
              <Button
                size="lg"
                className="bg-white text-red-600 hover:bg-gray-100 rounded-xl font-semibold px-8 py-4 text-lg shadow-lg"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (banners.length === 0) {
    return (
      <section className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl mx-4 mt-6 shadow-medium bg-gradient-to-r from-primary to-primary/80">
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 drop-shadow-lg">Welcome to Cartify</h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-md font-medium">Your shopping destination</p>
            <Link href="/products">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 rounded-xl font-semibold px-8 py-4 text-lg shadow-lg"
              >
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const currentBanner = banners[currentSlide]

  return (
    <section className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl mx-4 mt-6 shadow-medium">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${currentBanner.image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 drop-shadow-lg">{currentBanner.title}</h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-md font-medium">{currentBanner.description}</p>
          <Link href={currentBanner.cta_link}>
            <Button
              size="lg"
              className="gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl font-semibold px-8 py-4 text-lg"
            >
              {currentBanner.cta_text}
            </Button>
          </Link>
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all backdrop-blur-sm"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all backdrop-blur-sm"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
