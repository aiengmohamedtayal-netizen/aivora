"use client"

import { useState } from "react"
import { ArticleGrid } from "./ArticleGrid"
import { BlogSearch } from "./BlogSearch"
import { CategoryList } from "./CategoryList"

export function BlogContainer({ posts }: { posts: any[] }) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  // Extract unique categories
  const categories = Array.from(new Set(posts.map(p => p.category).filter(Boolean)))

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory
    const searchString = `${post.title} ${post.excerpt} ${post.tags?.join(" ")}`.toLowerCase()
    const matchesSearch = searchString.includes(query.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <CategoryList 
          categories={categories as string[]} 
          active={activeCategory} 
          onSelect={setActiveCategory} 
        />
        <BlogSearch onSearch={setQuery} />
      </div>
      
      {filteredPosts.length > 0 ? (
        <ArticleGrid posts={filteredPosts} />
      ) : (
        <div className="text-center py-24 text-muted-foreground">
          No articles found matching your criteria.
        </div>
      )}
    </div>
  )
}
