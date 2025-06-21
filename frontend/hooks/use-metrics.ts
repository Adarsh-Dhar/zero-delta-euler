"use client"

import { useState, useEffect, useCallback } from "react"
import type { MetricsData, ApiResponse } from "@/lib/types"

export function useMetrics() {
  const [data, setData] = useState<MetricsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchMetrics = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch("/api/metrics", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<MetricsData> = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch metrics")
      }

      if (result.data) {
        setData(result.data)
        setLastUpdated(new Date())
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      console.error("Error fetching metrics:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    await fetchMetrics()
  }, [fetchMetrics])

  useEffect(() => {
    fetchMetrics()

    // Poll every 15 seconds
    const interval = setInterval(fetchMetrics, 15000)

    return () => clearInterval(interval)
  }, [fetchMetrics])

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refresh,
  }
}
