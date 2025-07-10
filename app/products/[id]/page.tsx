"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/services/api"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  images?: string[]
  rating?: number
  category?: string
  category_id?: number
  stock?: number
  on_sale?: boolean
  created_at?: string
  updated_at?: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)

  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiService.get<Product>(`/api/products/${params.id}`)
        setProduct(response.data)
      } catch (err) {
        console.error("Failed to fetch product:", err)
        // Product not found or error
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    })

    toast({
      title: "Added to cart! 🛒",
      description: `${quantity} x ${product.name} added to your cart.`,
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="flex space-x-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Product Not Found</h1>
        <p className="text-gray-600">The product you're looking for doesn't exist.</p>
      </div>
    )
  }

  const images = product.images || [product.image]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl shadow-medium">
            <img
              src={images[selectedImage] || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover"
            />
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all hover:bg-white hover:scale-110"
            >
              <Heart
                className={`h-6 w-6 transition-colors ${isLiked ? "text-red-500 fill-current" : "text-gray-600"}`}
              />
            </button>
            {product.on_sale && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Sale
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index ? "border-primary shadow-md" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg?height=80&width=80"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {product.category && (
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                {product.category}
              </span>
            )}
          </div>

          {product.rating && (
            <div className="flex items-center space-x-2">
              <div className="flex">{renderStars(Math.floor(product.rating))}</div>
              <span className="text-gray-600 font-medium">({product.rating} out of 5)</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">128 reviews</span>
            </div>
          )}

          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</span>
            {product.on_sale && (
              <span className="text-xl text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>

          {/* Stock Status */}
          {product.stock !== undefined && (
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
              <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Quantity:</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {Array.from({ length: Math.min(10, product.stock || 10) }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="flex-1 gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl font-semibold h-14"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl border-2 hover:bg-gray-50 h-14 px-6 bg-transparent"
            >
              Buy Now
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center">
              <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Free Shipping</p>
              <p className="text-xs text-gray-500">On orders over $50</p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">2 Year Warranty</p>
              <p className="text-xs text-gray-500">Full protection</p>
            </div>
            <div className="text-center">
              <RotateCcw className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">30-Day Returns</p>
              <p className="text-xs text-gray-500">Easy returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
