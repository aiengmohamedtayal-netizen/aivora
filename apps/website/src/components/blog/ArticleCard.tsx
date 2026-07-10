import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock } from "lucide-react"

export function ArticleCard({ post }: { post: any }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-5 border border-border bg-card hover:border-primary/30 transition-all shadow-sm hover:shadow-md p-6 rounded-2xl relative overflow-hidden h-full">
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
}