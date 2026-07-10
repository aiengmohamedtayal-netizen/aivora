"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@aivora/lib/utils"
import { cardHover } from "@aivora/lib/motion"

/* ─────────────────────────────────────────────────────────────────────────
   GlassCard — glassmorphism container per desi.md §8
   ───────────────────────────────────────────────────────────────────────── */

import { type HTMLMotionProps } from "framer-motion"

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  hover?: boolean
  children?: React.ReactNode
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = true, children, ...props }, ref) => {
    const Comp = hover ? motion.div : "div"

    return (
      // @ts-expect-error type incompatibility between Framer Motion and strict React 19 types
      <Comp
        ref={ref}
        className={cn(
          "glass-surface rounded-2xl p-6",
          className,
        )}
        {...(hover ? cardHover : {})}
        {...props}
      >
        {children}
      </Comp>
    )
  },
)

GlassCard.displayName = "GlassCard"

export { GlassCard }
export type { GlassCardProps }
