"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, Eye, ThumbsUp, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/services/api"
import { getProductImageUrl } from "@/utils/image-utils"
import Link from "next/link"

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

interface Review {
  id: number
  user_name: string
  rating: number
  title: string
  comment: string
  date: string
  helpful_count: number
  verified: boolean
}

const mockReviews: Review[] = [
  {
    id: 1,
    user_name: "Sarah Johnson",
    rating: 5,
    title: "Excellent quality and fast delivery!",
    comment: "I'm really impressed with this product. The quality is outstanding and it arrived much faster than expected. Highly recommend!",
    date: "2024-01-15",
    helpful_count: 24,
    verified: true,
  },
  {
    id: 2,
    user_name: "Mike Chen",
    rating: 4,
    title: "Great value for money",
    comment: "Good product overall. The only minor issue is the packaging could be better, but the product itself works perfectly.",
    date: "2024-01-12",
    helpful_count: 18,
    verified: true,
  },
  {
    id: 3,
    user_name: "Emily Rodriguez",
    rating: 5,
    title: "Exceeded my expectations",
    comment: "This product is even better than I expected. The features are amazing and the customer service was top-notch.",
    date: "2024-01-10",
    helpful_count: 31,
    verified: false,
  },
  {
    id: 4,
    user_name: "David Thompson",
    rating: 3,
    title: "Good but could be better",
    comment: "The product is decent but I think it's a bit overpriced for what you get. It works well though.",
    date: "2024-01-08",
    helpful_count: 12,
    verified: true,
  },
  {
    id: 5,
    user_name: "Lisa Wang",
    rating: 5,
    title: "Perfect for my needs",
    comment: "Exactly what I was looking for. The quality is excellent and it's very easy to use. Will definitely buy again!",
    date: "2024-01-05",
    helpful_count: 27,
    verified: true,
  },
]

const recentlyViewedProducts = [
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Premium Running Shoes",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    rating: 4.6,
  },
  {
    id: 4,
    name: "Designer Coffee Maker",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
    rating: 4.4,
  },
  {
    id: 5,
    name: "Travel Laptop Backpack",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    rating: 4.7,
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)

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
      image: getProductImageUrl(product),
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

  const displayedReviews = showAllReviews ? mockReviews : mockReviews.slice(0, 3)

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

  const images = product.images || [getProductImageUrl(product)]

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

          <p className="text-gray-600 leading-relaxed text-lg" 
             dangerouslySetInnerHTML={{ __html: product.description }} />

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

      {/* Recently Viewed Products Section */}
      <section className="mt-16 py-12 border-t border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Eye className="h-6 w-6 mr-2 text-primary" />
            Recently Viewed
          </h2>
          <Link href="/products" className="text-primary hover:text-primary/80 font-medium">
            View All Products
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentlyViewedProducts.map((item) => (
            <Link key={item.id} href={`/products/${item.id}`} className="group">
              <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 hover:shadow-medium transition-shadow">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="mt-16 py-12 border-t border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="h-6 w-6 mr-2 text-primary" />
            Customer Reviews
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="flex mr-2">{renderStars(4.5)}</div>
              <span className="text-gray-600 font-medium">4.5 out of 5</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{mockReviews.length} reviews</span>
          </div>
        </div>

        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
                    {review.verified && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-gray-600 text-sm">{review.title}</span>
                  </div>
                </div>
                <span className="text-gray-500 text-sm">{new Date(review.date).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-primary transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm">Helpful ({review.helpful_count})</span>
                </button>
                <button className="text-gray-500 hover:text-primary transition-colors text-sm">
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>

        {mockReviews.length > 3 && (
          <div className="text-center mt-8">
            <Button
              onClick={() => setShowAllReviews(!showAllReviews)}
              variant="outline"
              className="px-8 py-3 rounded-xl font-medium hover:bg-primary hover:text-white transition-all duration-200"
            >
              {showAllReviews ? "Show Less Reviews" : "Show All Reviews"}
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
