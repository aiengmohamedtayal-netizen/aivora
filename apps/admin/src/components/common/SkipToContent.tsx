"use client"

import { useTranslations } from "next-intl"
import { cn } from "@aivora/lib/utils"

export function SkipToContent() {
  const t = useTranslations("navigation")

  return (
    <a
      href="#main-content"
      className={cn(
        "fixed start-4 top-4 z-50 -translate-y-24 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground shadow-lg transition-transform",
        "focus-visible:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      {t("skipToContent")}
    </a>
  )
}
