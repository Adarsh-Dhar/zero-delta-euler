"use client"

import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { StatsSection } from "@/components/stats-section"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Ready to get started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start monitoring your DeFi protocol today with our comprehensive dashboard.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/dashboard">
                Launch Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
