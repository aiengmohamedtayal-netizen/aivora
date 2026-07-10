"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Inbox, Users, FileText, Settings, X } from "lucide-react"
import { useRouter } from "next/navigation"

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

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
    { name: "View Leads Pipeline", href: "/admin/leads", icon: Inbox, category: "CRM" },
    { name: "View Newsletter Subscribers", href: "/admin/newsletter", icon: Users, category: "Marketing" },
    { name: "Create Blog Post", href: "/admin/blog", icon: FileText, category: "CMS" },
    { name: "Configure OS Settings", href: "/admin/settings", icon: Settings, category: "Settings" },
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-lg bg-card border border-border/80 rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[350px]">
        <div className="flex items-center border-b border-border/60 px-4 py-3">
          <Search className="w-5 h-5 text-muted-foreground mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-foreground border-none outline-none placeholder:text-muted-foreground text-sm"
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredItems.length > 0 ? (
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground font-bold px-3 uppercase tracking-wider block mb-1">Commands</span>
              {filteredItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4.5 h-4.5" />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground font-medium uppercase tracking-wider">{item.category}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>

        <div className="border-t border-border/40 px-4 py-2 bg-secondary/30 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>Use</span>
            <kbd className="px-1.5 py-0.5 bg-card border border-border rounded text-[9px] font-bold">ESC</kbd>
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
