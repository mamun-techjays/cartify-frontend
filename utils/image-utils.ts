import { apiService } from "@/services/api"

export function getProductImageUrl(product: any): string {
  if (!product || !product.image) {
    return ""
  }

  // If the image is already a full URL, return it as is
  if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
    return product.image
  }

  // If the image is a relative path starting with /assets, construct the full URL
  if (product.image.startsWith('/assets/')) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://34.102.83.157"
    return `${baseURL}${product.image}`
  }

  // If the image is just a filename or path, construct the full URL
  if (product.image.includes('Products/') || product.image.includes('products/')) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://34.102.83.157"
    return `${baseURL}/assets/images/${product.image}`
  }

  // If it's just a number or simple filename, construct the full URL
  if (/^\d+\.(jpg|jpeg|png|gif|webp)$/i.test(product.image)) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://34.102.83.157"
    return `${baseURL}/assets/images/Products/${product.image}`
  }

  // Return the original image if we can't process it
  return product.image
}

export function getBannerImageUrl(banner: any): string {
  if (!banner || !banner.image) {
    return ""
  }

  // If the image is already a full URL, return it as is
  if (banner.image.startsWith('http://') || banner.image.startsWith('https://')) {
    return banner.image
  }

  // If the image is a relative path starting with /assets, construct the full URL
  if (banner.image.startsWith('/assets/')) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://34.102.83.157"
    return `${baseURL}${banner.image}`
  }

  // If it's just a filename, construct the full URL
  if (/^[^\/]+\.(jpg|jpeg|png|gif|webp)$/i.test(banner.image)) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://34.102.83.157"
    return `${baseURL}/assets/images/Banners/${banner.image}`
  }

  // Return the original image if we can't process it
  return banner.image
}

export function getCategoryImageUrl(category: any): string {
  if (!category || !category.image) {
    return ""
  }

  // If the image is already a full URL, return it as is
  if (category.image.startsWith('http://') || category.image.startsWith('https://')) {
    return category.image
  }

  // If the image is a relative path starting with /assets, construct the full URL
  if (category.image.startsWith('/assets/')) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://34.102.83.157"
    return `${baseURL}${category.image}`
  }

  // If it's just a filename, construct the full URL
  if (/^[^\/]+\.(jpg|jpeg|png|gif|webp)$/i.test(category.image)) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://34.102.83.157"
    return `${baseURL}/assets/images/Categories/${category.image}`
  }

  // Return the original image if we can't process it
  return category.image
} 