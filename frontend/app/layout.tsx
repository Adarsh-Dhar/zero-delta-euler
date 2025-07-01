import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/app/providers"
import "@rainbow-me/rainbowkit/styles.css"
import { UmamiAnalytics } from "@/components/umami-analytics"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DeFi Dashboard | Real-time Protocol Metrics",
  description: "Monitor your DeFi protocol metrics in real-time with comprehensive analytics and insights.",
  keywords: ["DeFi", "Dashboard", "Ethereum", "Smart Contracts", "Analytics"],
  authors: [{ name: "DeFi Dashboard Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "DeFi Dashboard | Real-time Protocol Metrics",
    description: "Monitor your DeFi protocol metrics in real-time with comprehensive analytics and insights.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DeFi Dashboard | Real-time Protocol Metrics",
    description: "Monitor your DeFi protocol metrics in real-time with comprehensive analytics and insights.",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={cn(
        "min-h-screen bg-gradient-to-br from-background via-background to-muted/20",
        inter.className
      )}>
        <Providers>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          
            <Navigation />
            <main className="flex-1">{children}</main>
            <Toaster />
        </ThemeProvider>
          </Providers>
        <UmamiAnalytics />
      </body>
    </html>
  )
}
