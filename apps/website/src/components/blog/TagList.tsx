export function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span key={tag} className="px-3 py-1 bg-muted text-muted-foreground text-xs font-mono rounded-md">
          #{tag}
        </span>
      ))}
    </div>
  )
}