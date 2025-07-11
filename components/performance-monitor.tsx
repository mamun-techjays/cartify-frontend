"use client"

import { useEffect } from "react"

interface PerformanceEntryWithProcessing extends PerformanceEntry {
  processingStart?: number
  value?: number
}

export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window !== "undefined" && "performance" in window) {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            console.log("LCP:", entry.startTime)
            // Send to analytics service
            if (entry.startTime > 2500) {
              console.warn("LCP is too slow:", entry.startTime)
            }
          }
          
          if (entry.entryType === "first-input") {
            const firstInputEntry = entry as PerformanceEntryWithProcessing
            const fid = firstInputEntry.processingStart ? firstInputEntry.processingStart - entry.startTime : 0
            console.log("FID:", fid)
            // Send to analytics service
            if (fid > 100) {
              console.warn("FID is too slow:", fid)
            }
          }
          
          if (entry.entryType === "layout-shift") {
            const layoutShiftEntry = entry as PerformanceEntryWithProcessing
            const cls = layoutShiftEntry.value || 0
            console.log("CLS:", cls)
            // Send to analytics service
            if (cls > 0.1) {
              console.warn("CLS is too high:", cls)
            }
          }
        }
      })

      observer.observe({ entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"] })

      // Monitor page load performance
      window.addEventListener("load", () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
          if (navigation) {
            const metrics = {
              dns: navigation.domainLookupEnd - navigation.domainLookupStart,
              tcp: navigation.connectEnd - navigation.connectStart,
              ttfb: navigation.responseStart - navigation.requestStart,
              domLoad: navigation.domContentLoadedEventEnd - navigation.fetchStart,
              windowLoad: navigation.loadEventEnd - navigation.fetchStart,
            }
            
            console.log("Performance Metrics:", metrics)
            
            // Send to analytics service
            if (metrics.ttfb > 600) {
              console.warn("TTFB is too slow:", metrics.ttfb)
            }
          }
        }, 0)
      })

      return () => observer.disconnect()
    }
  }, [])

  return null
} 