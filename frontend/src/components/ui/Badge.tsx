import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────────────────────
   Badge — status indicator per ivora.md §26
   ───────────────────────────────────────────────────────────────────────── */

const badgeVariants = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border border-border bg-transparent text-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  gold: "bg-gold/10 text-gold border border-gold/20",
} as const

type BadgeVariant = keyof typeof badgeVariants

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
export type { BadgeProps, BadgeVariant }
