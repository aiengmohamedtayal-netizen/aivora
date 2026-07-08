import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────────────────────
   SectionLabel — per desi.md §8, extracts the .section-label utility
   into a proper React component.
   ───────────────────────────────────────────────────────────────────────── */

interface SectionLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: "span" | "p" | "div"
}

function SectionLabel({
  className,
  as: Tag = "span",
  children,
  ...props
}: SectionLabelProps) {
  return (
    <Tag
      className={cn("section-label", className)}
      {...props}
    >
      {children}
    </Tag>
  )
}

export { SectionLabel }
export type { SectionLabelProps }
