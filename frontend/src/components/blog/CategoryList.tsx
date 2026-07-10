"use client"
import { cn } from "@/lib/utils"

export function CategoryList({ categories, active, onSelect }: { categories: string[], active: string, onSelect: (c: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button 
        onClick={() => onSelect('All')} 
        className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors border", active === 'All' ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-primary/50")}
      >
        All
      </button>
      {categories.map(c => (
        <button 
          key={c}
          onClick={() => onSelect(c)} 
          className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors border", active === c ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-primary/50")}
        >
          {c}
        </button>
      ))}
    </div>
  )
}