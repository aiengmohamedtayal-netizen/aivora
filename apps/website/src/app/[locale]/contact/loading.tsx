export default function ContactLoading() {
  return (
    <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8 max-w-4xl space-y-12">
      {/* Contact header skeleton */}
      <div className="space-y-3 text-center max-w-xl mx-auto">
        <div className="h-10 w-64 bg-white/10 rounded mx-auto animate-pulse" />
        <div className="h-4 w-80 bg-white/5 rounded mx-auto animate-pulse" />
      </div>

      {/* Contact card / form skeleton */}
      <div className="grid md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-7 p-8 rounded-3xl border border-white/5 bg-white/[0.01] space-y-6">
          <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
          <div className="space-y-4">
            <div className="h-12 w-full bg-white/5 rounded-xl animate-pulse" />
            <div className="h-12 w-full bg-white/5 rounded-xl animate-pulse" />
            <div className="h-28 w-full bg-white/5 rounded-xl animate-pulse" />
          </div>
          <div className="h-12 w-36 bg-white/10 rounded-xl animate-pulse" />
        </div>
        <div className="md:col-span-5 p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-4">
          <div className="h-6 w-40 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
