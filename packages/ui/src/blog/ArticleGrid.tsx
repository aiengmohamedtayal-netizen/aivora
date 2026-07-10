import { ArticleCard } from "./ArticleCard"

export function ArticleGrid({ posts }: { posts: any[] }) {
  if (!posts || posts.length === 0) return null
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map(post => <ArticleCard key={post.slug} post={post} />)}
    </div>
  )
}