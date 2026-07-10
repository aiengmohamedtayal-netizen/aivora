import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, ArrowRight } from "lucide-react"

export function FeaturedArticle({ post }: { post: any }) {
  if (!post) return null
  return (
    <Link href={`/blog/${post.slug}`} className="group block mb-16 relative overflow-hidden rounded-3xl bg-card border border-border hover:border-primary/50 transition-colors">
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
}