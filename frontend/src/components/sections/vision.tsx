import { SectionLabel, Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui"

export function SectionTechShift() {
  return (
    <section aria-label="Technological Shift" className="py-24 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <SectionLabel className="mb-4">THE FUTURE OF SOFTWARE</SectionLabel>
          <h2 className="text-h2 font-display mb-6">AI is not a feature. It is the new architectural layer.</h2>
          <p className="text-body text-muted-foreground">
            Traditional monolithic applications are rigid state machines. The future belongs to deterministic systems where intelligent agent nodes orchestrate complex workflows securely and autonomously.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-background/50 border-border/50 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Traditional Architecture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive" /> Sequential Execution
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive" /> Fragile State Management
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive" /> Manual Scaling
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
            <CardHeader>
              <CardTitle className="text-lg text-primary">Agentic Architecture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Autonomous Workflows
              </div>
              <div className="flex items-center gap-3 text-sm font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Self-healing Systems
              </div>
              <div className="flex items-center gap-3 text-sm font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Adaptive Intelligence
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export function SectionVision() {
  const phases = [
    { id: "Phase 1", title: "MVP Launch", desc: "Core architecture and primary user flows." },
    { id: "Phase 2", title: "Platform Growth", desc: "Horizontal scaling and deep integrations." },
    { id: "Phase 3", title: "AI Orchestration", desc: "Deployment of autonomous worker nodes." },
    { id: "Phase 4", title: "Enterprise Scale", desc: "Global edge delivery and compliance." },
  ]

  return (
    <section aria-label="Platform Vision" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <SectionLabel className="mb-4">PLATFORM VISION</SectionLabel>
          <h2 className="text-h2 font-display">Scalability from Day One. Built for decades.</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {phases.map((phase, i) => (
            <div key={phase.id} className="relative">
              {i !== phases.length - 1 && (
                <div className="hidden lg:block absolute top-4 start-0 w-full h-[1px] bg-border z-0" />
              )}
              <div className="relative z-10 flex flex-col gap-4 bg-background pt-4 lg:pt-0 lg:pe-8">
                <Badge variant={i === 0 ? "default" : "outline"} className="w-fit">
                  {phase.id}
                </Badge>
                <h3 className="font-bold text-foreground">{phase.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{phase.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
