"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center p-8 text-center space-y-6 antialiased">
        <div className="space-y-2">
          <h2 className="text-2xl font-medium">Critical Application Error</h2>
          <p className="text-muted-foreground text-sm max-w-[500px]">
            {error.message || "A fatal error occurred that crashed the application."}
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="inline-flex h-10 items-center justify-center rounded-md bg-white text-black px-8 text-sm font-medium shadow transition-colors hover:bg-neutral-200 focus-visible:outline-none"
        >
          Reload application
        </button>
      </body>
    </html>
  )
}
