import { SectionLabel } from "@/components/ui"

export function SectionStack() {
  const stack = [
    { name: "Next.js 15", desc: "App Router with strict server-side boundaries" },
    { name: "React 19", desc: "Server Components and concurrent rendering" },
    { name: "TypeScript", desc: "Strict mode, zero any, end-to-end safety" },
    { name: "Supabase", desc: "PostgreSQL with Row Level Security" },
    { name: "FastAPI", desc: "Async Python microservices for AI workloads" },
    { name: "Tailwind v4", desc: "Utility-first CSS with native @theme tokens" }
  ]

  return (
    <section aria-label="Our Stack" className="py-24 lg:py-32 bg-background border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <SectionLabel className="mb-4">OUR STACK</SectionLabel>
          <h2 className="text-h2 font-display">We build on tools we have stress-tested.</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
          {stack.map((tech) => (
            <div key={tech.name} className="flex flex-col gap-2">
              <h3 className="text-xl font-bold font-display text-foreground">{tech.name}</h3>
              <p className="text-sm text-muted-foreground">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
