import { SectionLabel, Card, CardHeader, CardTitle, CardContent } from "@/components/ui"

export function SectionProcess() {
  const steps = [
    { num: "01", title: "Specify", desc: "Requirements are captured in executable spec documents." },
    { num: "02", title: "Architect", desc: "System design follows Clean Architecture and SOLID principles." },
    { num: "03", title: "Implement", desc: "Code is written with strict TypeScript, tested at every layer." },
    { num: "04", title: "Deploy", desc: "Automated quality gates verify Lighthouse ≥ 95 before release." },
  ]

  return (
    <section aria-label="How We Deliver" className="py-24 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <SectionLabel className="mb-4">HOW WE DELIVER</SectionLabel>
          <h2 className="text-h2 font-display">From feature specification to verified deployment.</h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-6 start-0 w-full h-[1px] bg-border z-0" />
          <div className="grid lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step) => (
              <div key={step.num} className="bg-secondary/30 lg:bg-transparent pt-4 pe-4">
                <span className="inline-block bg-background border border-border text-foreground font-mono text-sm px-2 py-1 rounded-md mb-6 shadow-sm">
                  {step.num}
                </span>
                <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function SectionQualityGates() {
  const gates = [
    { title: "Type Safety", cmd: "tsc --noEmit" },
    { title: "Linting", cmd: "eslint . --max-warnings 0" },
    { title: "Accessibility", cmd: "axe-core --tags wcag2aa" },
    { title: "Unit Tests", cmd: "vitest run --coverage" },
    { title: "Performance", cmd: "lhci autorun --minScore=0.95" },
  ]

  return (
    <section aria-label="Quality Assurance" className="py-24 lg:py-32 bg-background border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel className="mb-4">QUALITY ASSURANCE</SectionLabel>
            <h2 className="text-h2 font-display mb-6">No code is merged without passing our automated quality gates.</h2>
            <p className="text-body text-muted-foreground">
              Our CI/CD pipelines enforce rigid standards. If a commit drops accessibility below WCAG AA or reduces performance scores, the build fails. Deterministic quality.
            </p>
          </div>

          <Card className="bg-card shadow-sm border-border">
            <CardContent className="p-0">
              <div className="flex flex-col divide-y divide-border">
                {gates.map((gate, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="font-bold text-sm text-foreground w-1/3">{gate.title}</span>
                    <code className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {gate.cmd}
                    </code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
