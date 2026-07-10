import { cn } from "@aivora/lib/utils"

/* ─────────────────────────────────────────────────────────────────────────
   Skeleton — loading placeholder per ivora.md §15
   ───────────────────────────────────────────────────────────────────────── */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circular" | "text"
}

function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-skeleton-wave bg-muted",
        variant === "circular" && "rounded-full",
        variant === "text" && "h-4 w-full rounded-md",
        variant === "default" && "rounded-2xl",
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  )
}

export { Skeleton }
export type { SkeletonProps }
