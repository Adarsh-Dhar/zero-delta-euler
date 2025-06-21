"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export function StatsSection() {
  const stats = [
    { label: "Protocols Monitored", value: "500+" },
    { label: "Data Points Tracked", value: "10M+" },
    { label: "Uptime", value: "99.9%" },
    { label: "Response Time", value: "<100ms" },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center border-0 bg-background/50 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
