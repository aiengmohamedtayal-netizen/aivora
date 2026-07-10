import Image from "next/image"
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
}