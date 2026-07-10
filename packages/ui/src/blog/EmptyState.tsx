export function EmptyState() {
  return (
    <div className="py-24 text-center">
      <h3 className="text-2xl font-semibold text-foreground mb-2">No articles found</h3>
      <p className="text-muted-foreground">Try adjusting your search query or category filters.</p>
    </div>
  )
}