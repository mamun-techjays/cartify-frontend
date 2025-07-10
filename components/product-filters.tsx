"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X, Star } from "lucide-react"

interface FilterOptions {
  priceRange: [number, number]
  categories: string[]
  rating: number
  sortBy: string
  inStock: boolean
  onSale: boolean
}

interface ProductFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onClearFilters: () => void
  isOpen: boolean
  onToggle: () => void
}

const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Books",
  "Beauty",
  "Accessories",
  "Automotive",
]

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
]

export default function ProductFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle,
}: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...localFilters.categories, category]
      : localFilters.categories.filter((c) => c !== category)
    handleFilterChange("categories", newCategories)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
        onClick={() => handleFilterChange("rating", i + 1)}
      />
    ))
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Filters</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-gray-500 hover:text-gray-700">
            Clear All
          </Button>
          <Button variant="ghost" size="sm" onClick={onToggle} className="md:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`${isOpen ? "block" : "hidden md:block"} p-6 space-y-8`}>
        {/* Sort By */}
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-3 block">Sort By</Label>
          <Select value={localFilters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Select sorting" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-3 block">
            Price Range: ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
          </Label>
          <Slider
            value={localFilters.priceRange}
            onValueChange={(value) => handleFilterChange("priceRange", value as [number, number])}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>$0</span>
            <span>$1000+</span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-3 block">Categories</Label>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={localFilters.categories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label htmlFor={category} className="text-sm text-gray-700 cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-3 block">Minimum Rating</Label>
          <div className="flex items-center space-x-1 cursor-pointer">{renderStars(localFilters.rating)}</div>
          <p className="text-xs text-gray-500 mt-2">{localFilters.rating} stars & above</p>
        </div>

        {/* Additional Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-900 block">Additional Filters</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={localFilters.inStock}
              onCheckedChange={(checked) => handleFilterChange("inStock", checked as boolean)}
            />
            <Label htmlFor="inStock" className="text-sm text-gray-700 cursor-pointer">
              In Stock Only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="onSale"
              checked={localFilters.onSale}
              onCheckedChange={(checked) => handleFilterChange("onSale", checked as boolean)}
            />
            <Label htmlFor="onSale" className="text-sm text-gray-700 cursor-pointer">
              On Sale
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
