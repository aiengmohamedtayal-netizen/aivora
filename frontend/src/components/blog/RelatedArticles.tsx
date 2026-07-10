import { ArticleGrid } from "./ArticleGrid"

export function RelatedArticles({ posts }: { posts: any[] }) {
  if (!posts || posts.length === 0) return null
  return (
    <div className="py-16 mt-16 border-t border-border">
      <h3 className="text-3xl font-bold mb-8 text-foreground tracking-tight">Related Articles</h3>
      <ArticleGrid posts={posts} />
    </div>
  )
}