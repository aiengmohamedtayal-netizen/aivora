"use client"

import { useTranslations } from "next-intl"
import { cn } from "@aivora/lib/utils"

export function SkipToContent() {
  const t = useTranslations("navigation")

  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
      )}
    >
      {t("skipToContent")}
    </a>
  )
}
