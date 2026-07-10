import Image from "next/image"

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
}