"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { apiService } from "@/services/api"

interface SearchSuggestion {
  id: string
  text: string
  type: "product" | "category" | "recent" | "trending"
  image?: string
}

export default function SearchAutocomplete() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Mock suggestions for demo
  const mockSuggestions: SearchSuggestion[] = [
    {
      id: "1",
      text: "Wireless Headphones",
      type: "product",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=50&h=50&fit=crop",
    },
    {
      id: "2",
      text: "Smart Watch",
      type: "product",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50&h=50&fit=crop",
    },
    {
      id: "3",
      text: "Running Shoes",
      type: "product",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50&h=50&fit=crop",
    },
    {
      id: "4",
      text: "Coffee Maker",
      type: "product",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=50&h=50&fit=crop",
    },
    { id: "5", text: "Electronics", type: "category" },
    { id: "6", text: "Fashion", type: "category" },
    { id: "7", text: "Home & Garden", type: "category" },
    { id: "8", text: "bluetooth speaker", type: "recent" },
    { id: "9", text: "laptop backpack", type: "recent" },
    { id: "10", text: "wireless charging", type: "trending" },
    { id: "11", text: "fitness tracker", type: "trending" },
  ]

  const recentSearches = [
    { id: "r1", text: "bluetooth speaker", type: "recent" as const },
    { id: "r2", text: "laptop backpack", type: "recent" as const },
    { id: "r3", text: "wireless mouse", type: "recent" as const },
  ]

  const trendingSearches = [
    { id: "t1", text: "wireless charging", type: "trending" as const },
    { id: "t2", text: "fitness tracker", type: "trending" as const },
    { id: "t3", text: "smart home", type: "trending" as const },
  ]

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }

      setLoading(true)
      try {
        // Try to fetch from API
        const response = await apiService.get(`/search/suggestions?q=${encodeURIComponent(query)}`)
        setSuggestions(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        // Fallback to mock suggestions
        const filtered = mockSuggestions.filter((suggestion) =>
          suggestion.text.toLowerCase().includes(query.toLowerCase()),
        )
        setSuggestions(filtered.slice(0, 8))
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsOpen(false)
      setQuery("")
      setSelectedIndex(-1)

      // Save to recent searches (in real app, this would be saved to localStorage or API)
      console.log("Saving to recent searches:", searchQuery)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSearch(suggestions[selectedIndex].text)
    } else {
      handleSearch(query)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSearch(suggestions[selectedIndex].text)
        } else {
          handleSearch(query)
        }
        break
      case "Escape":
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "recent":
        return <Clock className="h-4 w-4 text-gray-400" />
      case "trending":
        return <TrendingUp className="h-4 w-4 text-primary" />
      case "category":
        return <div className="h-4 w-4 bg-gray-300 rounded" />
      default:
        return null
    }
  }

  const getEmptySuggestions = () => {
    if (query.length === 0) {
      return (
        <div className="p-4">
          {recentSearches.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Recent Searches
              </h4>
              <div className="space-y-1">
                {recentSearches.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSearch(item.text)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending Searches
            </h4>
            <div className="space-y-1">
              {trendingSearches.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSearch(item.text)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {item.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="p-4 text-center text-gray-500">
        <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">No suggestions found</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for products, brands, and more..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            setSelectedIndex(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pr-14 h-12 rounded-2xl border-gray-200 focus:border-primary focus:ring-primary/20 bg-gray-50/50 hover:bg-white transition-colors text-base"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 rounded-xl gradient-primary shadow-md hover:shadow-lg transition-all"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4">
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-2">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSearch(suggestion.text)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                    index === selectedIndex ? "bg-primary/5 border-r-2 border-primary" : ""
                  }`}
                >
                  {suggestion.image ? (
                    <img
                      src={suggestion.image || "/placeholder.svg"}
                      alt=""
                      className="h-8 w-8 rounded-lg object-cover"
                    />
                  ) : (
                    getSuggestionIcon(suggestion.type)
                  )}
                  <div className="flex-1">
                    <span className="text-sm text-gray-900">{suggestion.text}</span>
                    {suggestion.type === "category" && (
                      <span className="text-xs text-gray-500 ml-2">in {suggestion.text}</span>
                    )}
                  </div>
                  {suggestion.type === "trending" && <span className="text-xs text-primary font-medium">Trending</span>}
                </button>
              ))}
            </div>
          ) : (
            getEmptySuggestions()
          )}
        </div>
      )}
    </div>
  )
}
