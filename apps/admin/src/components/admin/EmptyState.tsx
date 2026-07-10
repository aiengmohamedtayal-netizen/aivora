"use client"

import { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm shadow-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground mb-6"
      >
        <Icon className="w-8 h-8" />
      </motion.div>
      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        className="text-lg font-semibold text-foreground mb-2"
      >
        {title}
      </motion.h3>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="text-sm text-muted-foreground max-w-sm mb-8"
      >
        {description}
      </motion.p>
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          {action}
        </motion.div>
      )}
    </div>
  )
}
