"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { RefreshCw, Calendar, Clock } from "lucide-react"

interface DashboardHeaderProps {
  onRefresh: () => void
  isRefreshing: boolean
  lastUpdated?: Date
}

export function DashboardHeader({ onRefresh, isRefreshing, lastUpdated }: DashboardHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Strategy Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time metrics for the Zero-Delta Euler strategy.
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {lastUpdated && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{lastUpdated.toLocaleDateString()}</span>
            <Clock className="h-4 w-4" />
            <span>{lastUpdated.toLocaleTimeString()}</span>
          </div>
        )}
        <Button onClick={onRefresh} variant="outline" size="sm" disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
    </motion.header>
  )
}
