export default function AboutLoading() {
  return (
    <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8 max-w-5xl space-y-16">
      {/* About header skeleton */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="h-4 w-28 bg-white/5 rounded animate-pulse" />
          <div className="h-12 w-96 bg-white/10 rounded animate-pulse" />
          <div className="h-24 w-full bg-white/5 rounded animate-pulse" />
        </div>
        <div className="h-64 w-full bg-white/5 rounded-2xl animate-pulse" />
      </div>

      {/* Grid skeleton */}
      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] space-y-4">
            <div className="h-10 w-10 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
            <div className="h-12 w-full bg-white/5 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
