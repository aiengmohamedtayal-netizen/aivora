import { Link } from "@/i18n/routing"
import { AlertCircle } from "lucide-react"
import { Button } from "@aivora/ui/Button"

export default function ServiceNotFound() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-6 p-4 text-center bg-background">
      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Service Not Found
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          The requested service page does not exist or has been moved.
        </p>
      </div>

      <Button asChild variant="primary" className="rounded-xl cursor-pointer">
        <Link href="/services">View All Services</Link>
      </Button>
    </div>
  )
}
