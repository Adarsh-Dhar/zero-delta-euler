"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { RefreshCw, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  onRefresh: () => void
  isRefreshing: boolean
  lastUpdated?: Date
}

export function DashboardHeader({ onRefresh, isRefreshing, lastUpdated }: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
    >
      <div className="flex items-center space-x-3">
        <motion.div
          animate={{ rotate: isRefreshing ? 360 : 0 }}
          transition={{ duration: 1, repeat: isRefreshing ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
        >
          <Activity className="h-8 w-8 text-primary" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">DeFi Dashboard</h1>
          <p className="text-muted-foreground">Real-time protocol metrics and analytics</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {lastUpdated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground"
          >
            Last updated: {lastUpdated.toLocaleTimeString()}
          </motion.div>
        )}

        <Button
          onClick={onRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>
    </motion.div>
  )
}
