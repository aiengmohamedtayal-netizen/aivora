export default function BlogLoading() {
  return (
    <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8 max-w-5xl space-y-12">
      {/* Blog header skeleton */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="h-4 w-24 bg-white/5 rounded mx-auto animate-pulse" />
        <div className="h-10 w-80 bg-white/10 rounded mx-auto animate-pulse" />
        <div className="h-4 w-96 bg-white/5 rounded mx-auto animate-pulse" />
      </div>

      {/* Blog list grid skeleton */}
      <div className="grid md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] space-y-4">
            <div className="h-48 w-full bg-white/5 rounded-xl animate-pulse" />
            <div className="h-4 w-28 bg-white/5 rounded animate-pulse" />
            <div className="h-6 w-3/4 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
