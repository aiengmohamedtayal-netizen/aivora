"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Inbox, Users, FileText, Settings, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations("admin.CommandPalette")

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  if (!isOpen) return null

  const items = [
    { name: t("navigation") + " - Dashboard", href: "/admin", icon: Settings, category: t("navigation") },
    { name: t("addLead") + " - Leads", href: "/admin/leads", icon: Inbox, category: t("actions") },
    { name: "Inbox & Messages", href: "/admin/inbox", icon: Inbox, category: t("navigation") },
    { name: t("newsletter"), href: "/admin/newsletter", icon: Users, category: t("navigation") },
    { name: t("writePost") + " - Blog CMS", href: "/admin/blog", icon: FileText, category: t("navigation") },
    { name: "Services CMS", href: "/admin/services", icon: FileText, category: t("navigation") },
    { name: t("viewSettings"), href: "/admin/settings", icon: Settings, category: t("navigation") },
  ]

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (href: string) => {
    router.push(href)
    setIsOpen(false)
    setQuery("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-lg bg-card/80 backdrop-blur-2xl border border-border/80 rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[350px]">
        <div className="flex items-center border-b border-border/60 px-4 py-3 bg-secondary/10">
          <Search className="w-5 h-5 text-muted-foreground mr-3 rtl:ml-3 rtl:mr-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder={t("placeholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-foreground border-none outline-none placeholder:text-muted-foreground text-sm"
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredItems.length > 0 ? (
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground font-bold px-3 uppercase tracking-wider block mb-1">{t("actions")}</span>
              {filteredItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 text-left rtl:text-right transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4.5 h-4.5" />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-[10px] bg-secondary/50 px-2 py-0.5 rounded text-muted-foreground font-medium uppercase tracking-wider">{item.category}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {t("noResults")}
            </div>
          )}
        </div>

        <div className="border-t border-border/40 px-4 py-2 bg-secondary/20 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>Use</span>
            <kbd className="px-1.5 py-0.5 bg-card border border-border rounded text-[9px] font-bold shadow-sm">ESC</kbd>
            <span>to close</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Select with click</span>
          </div>
        </div>
      </div>
    </div>
  )
}
