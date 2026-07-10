export function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex justify-center gap-2 mt-16">
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${currentPage === i + 1 ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:border-primary/50'}`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
}