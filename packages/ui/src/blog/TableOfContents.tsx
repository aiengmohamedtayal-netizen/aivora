"use client"
import { useEffect, useState } from "react"
import { cn } from "@aivora/lib/utils"

export function TableOfContents({ toc }: { toc: { id: string, title: string }[] }) {
  const [activeId, setActiveId] = useState<string>("")
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }, { rootMargin: "0% 0% -80% 0%" })
    
    toc.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })
    
    return () => observer.disconnect()
  }, [toc])

  if (!toc || toc.length === 0) return null

  return (
    <nav className="sticky top-24 p-6 rounded-2xl bg-card border border-border">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Table of Contents</h3>
      <ul className="space-y-3">
        {toc.map(item => (
          <li key={item.id}>
            <a 
              href={`#${item.id}`} 
              className={cn("text-sm transition-colors", activeId === item.id ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground")}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}