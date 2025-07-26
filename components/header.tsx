"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, Heart, Menu, X, Bell, ChevronDown, Grid, Tag, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Logo from "./logo"
import SearchAutocomplete from "./search-autocomplete"
import NetworkStatus from "./network-status"
import UserAvatar from "./user-avatar"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  product_count?: number
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const { items } = useCart()
  const { user, logout, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])

  // Fetch categories for the dropdown menu
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setShowSearch(false)
    }
  }, [searchQuery, router])

  const handleLogout = useCallback(async () => {
    try {
      await logout()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      })
    }
  }, [logout, toast, router])

  const handleDownloadReport = useCallback(async () => {
    try {
      toast({
        title: "Downloading report...",
        description: "Please wait while we generate your report.",
      })

      const response = await fetch('http://34.102.83.157/api/statistics/download', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Get the blob from the response
      const blob = await response.blob()
      
      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'cartify-statistics-report.csv'
      document.body.appendChild(a)
      a.click()
      
      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Report downloaded successfully!",
        description: "Your statistics report has been downloaded.",
      })
    } catch (error) {
      console.error('Error downloading report:', error)
      toast({
        title: "Download failed",
        description: "There was an error downloading the report. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), [])
  const toggleSearch = useCallback(() => setShowSearch(prev => !prev), [])
  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Memoize category display items
  const displayCategories = useMemo(() => categories.slice(0, 8), [categories])
  const mobileCategories = useMemo(() => categories.slice(0, 5), [categories])

  return (
    <>
      <NetworkStatus />
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Logo />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {/* Products Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors font-medium">
                    <Grid className="h-4 w-4" />
                    <span>Products</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/products" className="flex items-center space-x-2">
                      <Grid className="h-4 w-4" />
                      <span>All Products</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/products?sort=newest" className="flex items-center space-x-2">
                      <span>New Arrivals</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/products?sort=popular" className="flex items-center space-x-2">
                      <span>Popular Items</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/products?sort=price-low" className="flex items-center space-x-2">
                      <span>Price: Low to High</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/products?sort=price-high" className="flex items-center space-x-2">
                      <span>Price: High to Low</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Categories Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors font-medium">
                    <Tag className="h-4 w-4" />
                    <span>Categories</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 max-h-96 overflow-y-auto">
                  <DropdownMenuItem asChild>
                    <Link href="/categories" className="flex items-center space-x-2 font-medium">
                      <span>All Categories</span>
                    </Link>
                  </DropdownMenuItem>
                  {displayCategories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link href={`/categories/${category.id}`} className="flex items-center justify-between">
                        <span>{category.name}</span>
                        {category.product_count && (
                          <span className="text-xs text-gray-500">{category.product_count}</span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  {categories.length > 8 && (
                    <DropdownMenuItem asChild>
                      <Link href="/categories" className="flex items-center space-x-2 text-primary">
                        <span>View All Categories</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <SearchAutocomplete />
            </div>

            {/* Desktop Actions - Always visible for all users */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
                <Heart className="h-6 w-6" />
              </Link>

              <Link href="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button className="relative p-2 text-gray-600 hover:text-primary transition-colors">
                <Bell className="h-6 w-6" />
              </button>

              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={handleDownloadReport}
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                  <div className="relative group">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <UserAvatar name={user?.name || "User"} email={user?.email} size="md" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={handleDownloadReport}
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="rounded-xl">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm" className="gradient-primary rounded-xl shadow-lg hover:shadow-xl transition-all">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Actions - Always visible for all users */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={toggleSearch}
                className="p-2 text-gray-600 hover:text-primary transition-colors"
              >
                <Search className="h-6 w-6" />
              </button>

              <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
                <Heart className="h-6 w-6" />
              </Link>

              <Link href="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button className="relative p-2 text-gray-600 hover:text-primary transition-colors">
                <Bell className="h-6 w-6" />
              </button>

              <button
                onClick={toggleMenu}
                className="p-2 text-gray-600 hover:text-primary transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {showSearch && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <form onSubmit={handleSearch} className="flex space-x-2">
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 rounded-xl"
                />
                <Button type="submit" size="sm" className="gradient-primary rounded-xl">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Products</h3>
                  <div className="pl-4 space-y-2">
                    <Link
                      href="/products"
                      className="block text-gray-700 hover:text-primary transition-colors"
                      onClick={closeMenu}
                    >
                      All Products
                    </Link>
                    <Link
                      href="/products?sort=newest"
                      className="block text-gray-700 hover:text-primary transition-colors"
                      onClick={closeMenu}
                    >
                      New Arrivals
                    </Link>
                    <Link
                      href="/products?sort=popular"
                      className="block text-gray-700 hover:text-primary transition-colors"
                      onClick={closeMenu}
                    >
                      Popular Items
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Categories</h3>
                  <div className="pl-4 space-y-2">
                    <Link
                      href="/categories"
                      className="block text-gray-700 hover:text-primary transition-colors"
                      onClick={closeMenu}
                    >
                      All Categories
                    </Link>
                    {mobileCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.id}`}
                        className="block text-gray-700 hover:text-primary transition-colors"
                        onClick={closeMenu}
                      >
                        {category.name}
                      </Link>
                    ))}
                    {categories.length > 5 && (
                      <Link
                        href="/categories"
                        className="block text-primary hover:text-primary/80 transition-colors"
                        onClick={closeMenu}
                      >
                        View All Categories
                      </Link>
                    )}
                  </div>
                </div>

                {isAuthenticated ? (
                  <div className="pt-4 border-t border-gray-200 space-y-4">
                    <div className="flex items-center space-x-3">
                      <UserAvatar name={user?.name || "User"} email={user?.email} size="md" />
                      <div>
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleDownloadReport()
                        closeMenu()
                      }}
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Report</span>
                    </button>
                    <Link
                      href="/profile"
                      className="block text-gray-700 hover:text-primary transition-colors"
                      onClick={closeMenu}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block text-gray-700 hover:text-primary transition-colors"
                      onClick={closeMenu}
                    >
                      Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      className="block text-gray-700 hover:text-primary transition-colors"
                      onClick={closeMenu}
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        closeMenu()
                      }}
                      className="block w-full text-left text-red-600 hover:text-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <button
                      onClick={() => {
                        handleDownloadReport()
                        closeMenu()
                      }}
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Report</span>
                    </button>
                    <Link href="/auth/login" onClick={closeMenu}>
                      <Button variant="ghost" className="w-full justify-start rounded-xl">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={closeMenu}>
                      <Button className="w-full gradient-primary rounded-xl shadow-lg">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
