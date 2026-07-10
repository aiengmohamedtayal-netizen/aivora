import { Loader2 } from "lucide-react"

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-24 w-full">
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
      <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
    </div>
  )
}
