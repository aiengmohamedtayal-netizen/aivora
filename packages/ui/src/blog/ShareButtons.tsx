"use client"
import { Twitter, Linkedin, Link2 } from "lucide-react"

export function ShareButtons({ url, title }: { url: string, title: string }) {
  const copyLink = () => navigator.clipboard.writeText(url)
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-card border border-border hover:bg-primary hover:text-primary-foreground transition-colors">
        <Twitter className="w-4 h-4" />
      </a>
      <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-card border border-border hover:bg-primary hover:text-primary-foreground transition-colors">
        <Linkedin className="w-4 h-4" />
      </a>
      <button onClick={copyLink} className="p-2 rounded-full bg-card border border-border hover:bg-primary hover:text-primary-foreground transition-colors">
        <Link2 className="w-4 h-4" />
      </button>
    </div>
  )
}