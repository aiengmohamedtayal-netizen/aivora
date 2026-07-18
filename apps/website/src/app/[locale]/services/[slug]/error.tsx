"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@aivora/ui/Button"

export default function ServiceError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Service dynamic route failed:", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-6 p-4 text-center bg-background">
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
        <AlertTriangle className="w-6 h-6" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          We encountered an error loading the requested service page. Please try again.
        </p>
      </div>

      <Button onClick={() => reset()} variant="primary" className="rounded-xl cursor-pointer">
        Try Again
      </Button>
    </div>
  )
}
