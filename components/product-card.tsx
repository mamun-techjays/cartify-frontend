"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import { getProductImageUrl } from "@/utils/image-utils"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  rating?: number
  category?: string
  stock?: number
  onSale?: boolean
}

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

// Function to get a real product image based on product name/category
const getProductImage = (product: Product): string => {
  // First, try to normalize the product's image URL
  const normalizedImage = getProductImageUrl(product)
  
  if (
    normalizedImage &&
    normalizedImage !== "/placeholder.svg?height=250&width=250" &&
    !normalizedImage.includes("placeholder")
  ) {
    return normalizedImage
  }

  // Real product images based on product name or category
  const productName = product.name.toLowerCase()
  const category = product.category?.toLowerCase() || ""

  if (productName.includes("headphone") || productName.includes("audio")) {
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
  if (productName.includes("watch") || productName.includes("smart")) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
  if (productName.includes("shoe") || productName.includes("running") || category.includes("sport")) {
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
  if (productName.includes("coffee") || productName.includes("maker")) {
    return "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
  if (productName.includes("backpack") || productName.includes("bag")) {
    return "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
  if (productName.includes("speaker") || productName.includes("bluetooth")) {
    return "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
  if (category.includes("electronic")) {
    return "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
  if (category.includes("clothing") || category.includes("fashion")) {
    return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
  if (category.includes("home") || category.includes("garden")) {
    return "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
  if (category.includes("book")) {
    return "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
  if (category.includes("beauty")) {
    return "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }

  // Default fallback image
  return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const isWishlisted = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: getProductImage(product),
      quantity: 1,
    })

    toast({
      title: "Added to cart! 🛒",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: getProductImage(product),
      })
      toast({
        title: "Added to wishlist! ❤️",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const productImage = imageError ? getProductImage(product) : getProductImageUrl(product) || getProductImage(product)

  if (viewMode === "list") {
    return (
      <Link href={`/products/${product.id}`}>
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 hover:shadow-medium transition-all duration-300 p-6">
          <div className="flex space-x-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <img
                src={productImage || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl"
                loading="lazy"
                onError={() => setImageError(true)}
              />
              {product.onSale && (
                <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded-lg text-xs font-bold">
                  SALE
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2" 
                   dangerouslySetInnerHTML={{ __html: product.description }} />
                {product.rating && (
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">{renderStars(Math.floor(product.rating))}</div>
                    <span className="text-sm text-gray-500">({product.rating})</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  {product.onSale && (
                    <span className="text-sm text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleWishlistToggle}
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-2 bg-transparent"
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? "text-red-500 fill-current" : "text-gray-600"}`} />
                  </Button>
                  <Button onClick={handleAddToCart} className="rounded-xl">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/products/${product.id}`}>
      <div
        className="group bg-white rounded-2xl shadow-soft overflow-hidden transition-all duration-300 hover:shadow-medium hover:-translate-y-1 cursor-pointer border border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden">
          <img
            src={productImage || "/placeholder.svg"}
            alt={product.name}
            className={`w-full h-56 object-cover transition-transform duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            loading="lazy"
            onError={() => setImageError(true)}
          />

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition-all hover:bg-white hover:scale-110"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${isWishlisted ? "text-red-500 fill-current" : "text-gray-600"}`}
            />
          </button>

          {/* Hover Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-all duration-300">
              <Button
                onClick={handleAddToCart}
                className="gradient-primary text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-xl font-semibold"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          )}

          {/* Sale Badge */}
          {product.onSale && (
            <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-lg text-xs font-bold">
              SALE
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed" 
             dangerouslySetInnerHTML={{ __html: product.description }} />

          {product.rating && (
            <div className="flex items-center mb-3">
              <div className="flex mr-2">{renderStars(Math.floor(product.rating))}</div>
              <span className="text-sm text-gray-500 font-medium">({product.rating})</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
              {product.onSale && (
                <span className="text-sm text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</span>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="md:hidden rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
