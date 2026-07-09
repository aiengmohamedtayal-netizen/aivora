"use client"

import { forwardRef } from "react"
import { Slot } from "@radix-ui/react-slot"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonHover } from "@/lib/motion"

/* ─────────────────────────────────────────────────────────────────────────
   Variant & Size Maps — per ui_contract.md §1 + desi.md §7
   ───────────────────────────────────────────────────────────────────────── */

const variantStyles = {
  primary:
    "bg-primary text-primary-foreground shadow-lg hover:shadow-xl",
  secondary:
    "bg-secondary text-secondary-foreground border border-border/50 shadow-sm hover:border-primary/40 hover:bg-secondary/80",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
  ghost:
    "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
} as const

const sizeStyles = {
  sm: "min-h-9 px-4 text-sm gap-1.5 rounded-lg",
  md: "min-h-11 px-8 text-sm gap-2 rounded-xl",
  lg: "min-h-[52px] px-10 text-base gap-2.5 rounded-xl",
  icon: "min-h-10 min-w-10 rounded-lg",
} as const

/* ─────────────────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────────────────── */

type ButtonVariant = keyof typeof variantStyles
type ButtonSize = keyof typeof sizeStyles

import { type HTMLMotionProps } from "framer-motion"

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  asChild?: boolean
  children?: React.ReactNode
}

/* ─────────────────────────────────────────────────────────────────────────
   Component
   ───────────────────────────────────────────────────────────────────────── */

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      iconLeft,
      iconRight,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading

    if (asChild) {
      return (
        // @ts-expect-error type incompatibility between Framer Motion and strict React 19 types
        <Slot
          ref={ref}
          className={cn(
            "inline-flex items-center justify-center font-medium leading-[1.15] tracking-normal whitespace-nowrap transition-all text-ui",
            variantStyles[variant],
            sizeStyles[size],
            isDisabled && "pointer-events-none opacity-50",
            className,
          )}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium leading-[1.15] tracking-normal whitespace-nowrap transition-all text-ui",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          variantStyles[variant],
          sizeStyles[size],
          isDisabled && "pointer-events-none opacity-50",
          className,
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...(isDisabled ? {} : buttonHover)}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          iconLeft
        )}
        {children}
        {iconRight}
      </motion.button>
    )
  },
)

Button.displayName = "Button"

export { Button }
export type { ButtonProps, ButtonVariant, ButtonSize }
