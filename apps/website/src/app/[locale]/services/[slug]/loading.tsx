import { Loader2 } from "lucide-react"

export default function ServiceLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 bg-background">
      <div className="relative flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <div className="absolute inset-0 w-10 h-10 rounded-full border border-primary/20 animate-ping" />
      </div>
      <p className="text-sm font-mono text-muted-foreground animate-pulse">
        Loading Service Details...
      </p>
    </div>
  )
}
