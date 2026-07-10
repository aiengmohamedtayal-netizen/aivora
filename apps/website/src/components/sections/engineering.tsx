import { SectionLabel, Card, CardContent } from "@aivora/ui"
import { ShieldCheck, Code2, Gauge, Accessibility, FileCode2, GitCommitHorizontal } from "lucide-react"

export function SectionConstitution() {
  const principles = [
    { icon: Code2, title: "Strict TypeScript", desc: "Zero 'any' types. Complete end-to-end type safety." },
    { icon: FileCode2, title: "SOLID Architecture", desc: "Dependency inversion and single responsibility at the core." },
    { icon: Gauge, title: "Lighthouse ≥ 95", desc: "Non-negotiable performance baselines in CI pipelines." },
    { icon: Accessibility, title: "WCAG AA", desc: "Accessible by default. Keyboard navigation and screen reader support." },
    { icon: ShieldCheck, title: "Zero Dead Code", desc: "Aggressive tree-shaking and continuous refactoring cycles." },
    { icon: GitCommitHorizontal, title: "Conventional Commits", desc: "Semantic versioning and automated changelog generation." }
  ]

  return (
    <section aria-label="Engineering Discipline" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <SectionLabel className="mb-4">ENGINEERING DISCIPLINE</SectionLabel>
          <h2 className="text-h2 mb-6">A team governed by code quality laws.</h2>
          <p className="text-body text-muted-foreground">
            We operate under a strict internal Engineering Constitution. It is not a suggestion; it is the absolute standard for every line of code we push to production.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((p, i) => (
            <Card key={i} className="bg-background shadow-none hover:border-primary/30 transition-colors">
              <CardContent className="p-6 flex flex-col gap-4">
                <p.icon className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-medium text-foreground mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SectionTypeSafety() {
  return (
    <section aria-label="Type Safety" className="py-24 lg:py-32 bg-secondary/30 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel className="mb-4">TYPE SAFETY</SectionLabel>
            <h2 className="text-h2 mb-6">Zod validation at the perimeter. Strict compile-time safety inside.</h2>
            <p className="text-body text-muted-foreground">
              Our APIs do not trust client input. We enforce strict schema validation at every network boundary, ensuring that invalid data never reaches our internal logic or databases.
            </p>
          </div>
          
          <div 
            className="bg-card border border-border rounded-2xl p-6 shadow-sm overflow-x-auto relative"
            tabIndex={0}
            role="region"
            aria-label="Code example"
          >
            <div className="absolute top-0 end-0 p-4 font-mono text-xs text-muted-foreground/50 select-none">schema.ts</div>
            <pre className="font-mono text-sm leading-relaxed text-muted-foreground">
              <code className="language-typescript">
<span className="text-primary">const</span> LeadSchema = z.object({"{"}
  name: z.string().min(<span className="text-gold">2</span>),
  email: z.string().email(),
  company: z.string().optional(),
  budget: z.enum([<span className="text-green-500">&apos;startup&apos;</span>, <span className="text-green-500">&apos;growth&apos;</span>, <span className="text-green-500">&apos;enterprise&apos;</span>]),
{"}"})

<span className="text-primary">type</span> Lead = z.infer&lt;<span className="text-primary">typeof</span> LeadSchema&gt;
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
