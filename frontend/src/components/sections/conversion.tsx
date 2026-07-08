import { SectionLabel, Button } from "@/components/ui"
import { Link } from "@/i18n/routing"

export function SectionConversion() {
  return (
    <section aria-label="Consultation" className="py-32 lg:py-48 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 end-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl lg:text-6xl font-display font-bold tracking-tight mb-8">
          Engineering the future,<br />deterministically.
        </h2>
        <p className="text-lg lg:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-12">
          Consult with a Systems Architect to evaluate your technical requirements and scope your next platform.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto h-14 px-8 text-base">
            <Link href="/contact">Schedule Technical Review</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <Link href="/about">Read our Constitution</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
