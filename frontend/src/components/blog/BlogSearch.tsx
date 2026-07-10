"use client"
import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { useTranslations } from "next-intl"

export function BlogSearch({ onSearch }: { onSearch: (query: string) => void }) {
  const t = useTranslations("common")
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
      <Input 
        label={t("Common.search") || "Search"}
        type="text" 
        placeholder="Search articles..." 
        className="w-full pl-10 h-12 rounded-full bg-background"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}