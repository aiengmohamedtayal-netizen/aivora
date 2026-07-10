import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'src/components/blog');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const components = {
  "FeaturedArticle.tsx": `import { Link } from "@/i18n/routing"
import Image from "next/image"
import { Calendar, Clock, ArrowRight } from "lucide-react"

export function FeaturedArticle({ post }: { post: any }) {
  if (!post) return null
  return (
    <Link href={\`/blog/\${post.slug}\`} className="group block mb-16 relative overflow-hidden rounded-3xl bg-card border border-border hover:border-primary/50 transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[16/9] lg:aspect-auto">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="p-8 lg:p-12 flex flex-col justify-center gap-6">
          <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider px-3 py-1 rounded-md bg-primary/10 text-primary">{post.category}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(post.publishDate).toLocaleDateString()}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readingTime}</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">{post.title}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-3">
              <Image src={post.authorImage} alt={post.author} width={40} height={40} className="rounded-full" />
              <span className="text-sm font-medium text-foreground">{post.author}</span>
            </div>
            <span className="flex-1"></span>
            <span className="flex items-center gap-2 text-primary font-medium group-hover:underline">Read Article <ArrowRight className="w-4 h-4" /></span>
          </div>
        </div>
      </div>
    </Link>
  )
}`,

  "ArticleCard.tsx": `import { Link } from "@/i18n/routing"
import Image from "next/image"
import { Calendar, Clock } from "lucide-react"

export function ArticleCard({ post }: { post: any }) {
  return (
    <Link href={\`/blog/\${post.slug}\`} className="group flex flex-col gap-5 border border-border bg-card hover:border-primary/30 transition-all shadow-sm hover:shadow-md p-6 rounded-2xl relative overflow-hidden h-full">
      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-2">
        <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
        <span className="font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">{post.category}</span>
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readingTime}</span>
      </div>
      <h3 className="text-xl font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm line-clamp-3 flex-1">{post.excerpt}</p>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
        <span className="text-sm font-medium text-foreground">{post.author}</span>
        <span className="text-xs text-muted-foreground">{new Date(post.publishDate).toLocaleDateString()}</span>
      </div>
    </Link>
  )
}`,

  "ArticleGrid.tsx": `import { ArticleCard } from "./ArticleCard"

export function ArticleGrid({ posts }: { posts: any[] }) {
  if (!posts || posts.length === 0) return null
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map(post => <ArticleCard key={post.slug} post={post} />)}
    </div>
  )
}`,

  "BlogSearch.tsx": `"use client"
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
        type="text" 
        placeholder="Search articles..." 
        className="w-full pl-10 h-12 rounded-full bg-background"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}`,

  "CategoryList.tsx": `"use client"
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
}`,

  "TagList.tsx": `export function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span key={tag} className="px-3 py-1 bg-muted text-muted-foreground text-xs font-mono rounded-md">
          #{tag}
        </span>
      ))}
    </div>
  )
}`,

  "AuthorCard.tsx": `import Image from "next/image"

export function AuthorCard({ author, role, image }: { author: string, role: string, image: string }) {
  return (
    <div className="flex items-center gap-4 p-6 rounded-2xl bg-card border border-border">
      <Image src={image} alt={author} width={64} height={64} className="rounded-full" />
      <div>
        <h4 className="font-semibold text-foreground text-lg">{author}</h4>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  )
}`,

  "ReadingProgress.tsx": `"use client"
import { useEffect, useState } from "react"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const updateProgress = () => {
      const currentProgress = window.scrollY
      const scrollHeight = document.body.scrollHeight - window.innerHeight
      if (scrollHeight) {
        setProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100)
      }
    }
    window.addEventListener("scroll", updateProgress)
    return () => window.removeEventListener("scroll", updateProgress)
  }, [])
  return <div className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-150" style={{ width: \`\${progress}%\` }} />
}`,

  "ShareButtons.tsx": `"use client"
import { Twitter, Linkedin, Link2 } from "lucide-react"

export function ShareButtons({ url, title }: { url: string, title: string }) {
  const copyLink = () => navigator.clipboard.writeText(url)
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      <a href={\`https://twitter.com/intent/tweet?url=\${encodeURIComponent(url)}&text=\${encodeURIComponent(title)}\`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-card border border-border hover:bg-primary hover:text-primary-foreground transition-colors">
        <Twitter className="w-4 h-4" />
      </a>
      <a href={\`https://www.linkedin.com/shareArticle?mini=true&url=\${encodeURIComponent(url)}&title=\${encodeURIComponent(title)}\`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-card border border-border hover:bg-primary hover:text-primary-foreground transition-colors">
        <Linkedin className="w-4 h-4" />
      </a>
      <button onClick={copyLink} className="p-2 rounded-full bg-card border border-border hover:bg-primary hover:text-primary-foreground transition-colors">
        <Link2 className="w-4 h-4" />
      </button>
    </div>
  )
}`,

  "TableOfContents.tsx": `"use client"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

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
              href={\`#\${item.id}\`} 
              className={cn("text-sm transition-colors", activeId === item.id ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground")}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}`,

  "RelatedArticles.tsx": `import { ArticleGrid } from "./ArticleGrid"

export function RelatedArticles({ posts }: { posts: any[] }) {
  if (!posts || posts.length === 0) return null
  return (
    <div className="py-16 mt-16 border-t border-border">
      <h3 className="text-3xl font-bold mb-8 text-foreground tracking-tight">Related Articles</h3>
      <ArticleGrid posts={posts} />
    </div>
  )
}`,

  "NewsletterCTA.tsx": `import { NewsletterForm } from "@/components/sections/NewsletterForm"

export function NewsletterCTA() {
  return (
    <div className="my-16 p-8 md:p-12 rounded-3xl bg-primary/5 border border-primary/20 flex flex-col items-center text-center">
      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Enjoyed this article?</h3>
      <p className="text-muted-foreground mb-8 max-w-lg">Subscribe to our newsletter to receive future engineering insights, product design strategies, and automation guides straight to your inbox.</p>
      <div className="w-full max-w-md mx-auto">
        <NewsletterForm />
      </div>
    </div>
  )
}`,

  "EmptyState.tsx": `export function EmptyState() {
  return (
    <div className="py-24 text-center">
      <h3 className="text-2xl font-semibold text-foreground mb-2">No articles found</h3>
      <p className="text-muted-foreground">Try adjusting your search query or category filters.</p>
    </div>
  )
}`,

  "ArticleHero.tsx": `import Image from "next/image"
import { Calendar, Clock } from "lucide-react"

export function ArticleHero({ post }: { post: any }) {
  return (
    <header className="flex flex-col items-center text-center max-w-4xl mx-auto gap-6 mb-16 pt-12">
      <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground">
        <span className="font-semibold uppercase tracking-wider px-3 py-1 rounded-md bg-primary/10 text-primary">{post.category}</span>
        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(post.publishDate).toLocaleDateString()}</span>
        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readingTime}</span>
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">{post.title}</h1>
      <p className="text-xl text-muted-foreground leading-relaxed">{post.subtitle}</p>
      <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden mt-8">
        <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
      </div>
    </header>
  )
}`,

  "Pagination.tsx": `export function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex justify-center gap-2 mt-16">
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={\`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors \${currentPage === i + 1 ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:border-primary/50'}\`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
}`
};

Object.entries(components).forEach(([name, content]) => {
  fs.writeFileSync(path.join(dir, name), content);
});

console.log("Blog components scaffolded.");
