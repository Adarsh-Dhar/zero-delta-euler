"use client"

import { FeatureCard } from "@/components/feature-card"
import { BarChart3, Shield, Zap, RefreshCw, Bell, TrendingUp } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Monitor your DeFi protocol metrics with live data updates every 15 seconds.",
      delay: 0,
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Built with security best practices and robust error handling for maximum uptime.",
      delay: 0.1,
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized with Edge API routes and server components for blazing fast performance.",
      delay: 0.2,
    },
    {
      icon: RefreshCw,
      title: "Auto-refresh",
      description: "Automatic data polling with manual refresh options to keep you always updated.",
      delay: 0.3,
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified about important changes and threshold breaches in your protocol.",
      delay: 0.4,
    },
    {
      icon: TrendingUp,
      title: "Trend Analysis",
      description: "Visualize trends and patterns in your protocol metrics with beautiful charts.",
      delay: 0.5,
    },
  ]

  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Everything you need to monitor your protocol
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and insights to keep your DeFi protocol running smoothly
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
