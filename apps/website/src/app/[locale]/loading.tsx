export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 space-y-4">
      <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse delay-150" />
        <div className="w-2 h-2 rounded-full bg-primary/80 animate-pulse delay-300" />
      </div>
      <p className="text-sm font-mono text-muted-foreground animate-pulse">Initializing Interface...</p>
    </div>
  )
}
