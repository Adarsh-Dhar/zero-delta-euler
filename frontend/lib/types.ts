import type React from "react"

export interface MetricsData {
  totalSupply: number
  totalAssets: number
  ethBorrowed: number
  collateral: number
  debt: number
  lastRebalancePrice: number
  rebalanceCount: number
  timestamp: number
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
  partial?: boolean
}

export interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  isLoading?: boolean
  className?: string
}

export interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  delay?: number
}
