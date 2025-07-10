"use client"

import { useState } from "react"

interface UserAvatarProps {
  name: string
  email?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export default function UserAvatar({ name, email, size = "md", className = "" }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-20 h-20 text-xl",
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarUrl = (name: string, email?: string) => {
    const seed = email || name
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=10b981,059669,047857&radius=50`
  }

  if (imageError) {
    return (
      <div
        className={`${sizeClasses[size]} ${className} bg-primary rounded-full flex items-center justify-center text-white font-semibold shadow-lg`}
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <img
      src={getAvatarUrl(name, email) || "/placeholder.svg"}
      alt={`${name}'s avatar`}
      className={`${sizeClasses[size]} ${className} rounded-full shadow-lg object-cover`}
      onError={() => setImageError(true)}
    />
  )
}
