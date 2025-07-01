"use client"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

export function MotionSection({ children, className = "", delay = 0 }: { children: ReactNode, className?: string, delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.section>
  )
} 