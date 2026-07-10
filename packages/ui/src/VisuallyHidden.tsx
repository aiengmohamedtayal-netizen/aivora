import { cn } from "@aivora/lib/utils"

/* ─────────────────────────────────────────────────────────────────────────
   VisuallyHidden — screen-reader-only content
   ───────────────────────────────────────────────────────────────────────── */

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {}

function VisuallyHidden({ className, ...props }: VisuallyHiddenProps) {
  return (
    <span
      className={cn("sr-only", className)}
      {...props}
    />
  )
}

export { VisuallyHidden }
export type { VisuallyHiddenProps }
