"use client"

import { motion } from "framer-motion"
import { MetricCard } from "@/components/metric-card"
import { DashboardHeader } from "@/components/dashboard-header"
import { useMetrics } from "@/hooks/use-metrics"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { DollarSign, TrendingUp, Coins, Shield, AlertTriangle, BarChart3, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { data, isLoading, error, lastUpdated, refresh } = useMetrics()

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-md border-destructive/50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl text-destructive">Connection Error</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={refresh} variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <DashboardHeader onRefresh={refresh} isRefreshing={isLoading} lastUpdated={lastUpdated || undefined} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Total Supply"
          value={data ? formatCurrency(data.totalSupply) : "Loading..."}
          subtitle="USDC"
          icon={DollarSign}
          trend="up"
          trendValue="+2.5%"
          isLoading={isLoading}
          className="col-span-1"
        />

        <MetricCard
          title="Total Assets"
          value={data ? formatCurrency(data.totalAssets) : "Loading..."}
          subtitle="USDC"
          icon={TrendingUp}
          trend="up"
          trendValue="+1.8%"
          isLoading={isLoading}
          className="col-span-1"
        />

        <MetricCard
          title="ETH Borrowed"
          value={data ? `${formatNumber(data.ethBorrowed, 4)} ETH` : "Loading..."}
          subtitle="Ethereum"
          icon={Coins}
          trend="neutral"
          trendValue="0.0%"
          isLoading={isLoading}
          className="col-span-1"
        />

        <MetricCard
          title="Collateral"
          value={data ? formatCurrency(data.collateral) : "Loading..."}
          subtitle="USDC"
          icon={Shield}
          trend="up"
          trendValue="+0.9%"
          isLoading={isLoading}
          className="col-span-1"
        />

        <MetricCard
          title="Debt"
          value={data ? formatCurrency(data.debt) : "Loading..."}
          subtitle="USDC"
          icon={AlertTriangle}
          trend="down"
          trendValue="-0.3%"
          isLoading={isLoading}
          className="col-span-1 md:col-span-2 lg:col-span-1"
        />

        <MetricCard
          title="Last Rebalance Price"
          value={data ? formatCurrency(data.lastRebalancePrice) : "Loading..."}
          subtitle="USDC"
          icon={BarChart3}
          trend="up"
          trendValue="+0.1%"
          isLoading={isLoading}
          className="col-span-1 md:col-span-2 lg:col-span-1"
        />

        <MetricCard
          title="Rebalance Count"
          value={data ? formatNumber(data.rebalanceCount, 0) : "Loading..."}
          subtitle="Total Operations"
          icon={RefreshCw}
          trend="up"
          trendValue="+1"
          isLoading={isLoading}
          className="col-span-1 md:col-span-2 lg:col-span-2"
        />
      </motion.div>

      {/* Status indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 flex items-center justify-center"
      >
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div
            className={`h-2 w-2 rounded-full ${
              error ? "bg-red-500" : isLoading ? "bg-yellow-500 animate-pulse" : "bg-green-500"
            }`}
          />
          <span>{error ? "Disconnected" : isLoading ? "Updating..." : "Connected"}</span>
          <span className="text-xs">• Auto-refresh every 15s</span>
        </div>
      </motion.div>
    </main>
  )
}
