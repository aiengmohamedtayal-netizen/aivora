"use client"

import { useLocale } from "next-intl"
import { Globe } from "lucide-react"
import { usePathname, useRouter } from "@/i18n/routing"
import { Button } from "@aivora/ui/Button"
import { useTransition } from "react"

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const nextLocale = locale === "en" ? "ar" : "en"
  const label = locale === "en" ? "العربية" : "English"

  function handleLocaleChange() {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 px-3"
      onClick={handleLocaleChange}
      disabled={isPending}
    >
      <Globe className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium">{label}</span>
      <span className="sr-only">Switch language to {label}</span>
    </Button>
  )
}
