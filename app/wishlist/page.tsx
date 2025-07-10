"use client"

import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/contexts/wishlist-context"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function WishlistPage() {
  const { user } = useAuth()
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    })

    toast({
      title: "Added to cart! 🛒",
      description: `${item.name} has been added to your cart.`,
    })
  }

  const handleRemoveFromWishlist = (item: any) => {
    removeItem(item.id)
    toast({
      title: "Removed from wishlist",
      description: `${item.name} has been removed from your wishlist.`,
    })
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
        <p className="text-gray-600 mb-6">You need to be logged in to view your wishlist.</p>
        <Link href="/auth/login">
          <Button className="gradient-primary rounded-xl">Login Now</Button>
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-soft p-12 border border-gray-100">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8">
              Save items you love to your wishlist and never lose track of them again.
            </p>
            <Link href="/products">
              <Button className="gradient-primary rounded-xl shadow-lg hover:shadow-xl transition-all" size="lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-lg text-gray-600">{items.length} items saved for later</p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={clearWishlist}
              variant="outline"
              className="rounded-xl border-2 hover:border-red-500 hover:text-red-500 bg-transparent"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl shadow-soft overflow-hidden transition-all duration-300 hover:shadow-medium hover:-translate-y-1 border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <Link href={`/products/${item.id}`}>
                  <img
                    src={item.image || "/placeholder.svg?height=250&width=250"}
                    alt={item.name}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>

                {/* Remove from Wishlist Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(item)}
                  className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition-all hover:bg-white hover:scale-110"
                >
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                </button>

                {/* Quick Add to Cart Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="gradient-primary text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-xl font-semibold"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              <div className="p-5">
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</span>
                  <Button
                    onClick={() => handleAddToCart(item)}
                    size="sm"
                    className="gradient-primary rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Wishlist Actions */}
        <div className="mt-12 bg-white rounded-2xl shadow-soft p-8 text-center border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Love Your Wishlist?</h2>
          <p className="text-gray-600 mb-6">Share it with friends or add everything to your cart at once!</p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => {
                items.forEach((item) => handleAddToCart(item))
                toast({
                  title: "All items added! 🛒",
                  description: "Your entire wishlist has been added to your cart.",
                })
              }}
              className="gradient-primary rounded-xl shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add All to Cart
            </Button>
            <Button variant="outline" className="rounded-xl border-2 bg-transparent" size="lg">
              Share Wishlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
