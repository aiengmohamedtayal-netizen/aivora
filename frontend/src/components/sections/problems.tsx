import { SectionLabel, Card, CardContent } from "@/components/ui"

export function SectionFragility() {
  return (
    <section aria-label="The Problem" className="py-24 lg:py-32 bg-background border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <SectionLabel className="mb-4">THE PROBLEM</SectionLabel>
          <h2 className="text-h2 font-display mb-6">Static websites mask poor code. We let our execution speak for itself.</h2>
          <p className="text-body text-muted-foreground">
            The standard agency model relies on visual polish to obscure deep architectural flaws.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-border/50 rounded-2xl overflow-hidden">
          <div className="bg-muted/20 p-8 lg:p-12 flex flex-col justify-center">
            <h3 className="font-mono text-sm text-muted-foreground mb-8 uppercase tracking-widest">Industry Average</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-border/50 pb-4">
                <span className="text-muted-foreground">Lighthouse Score</span>
                <span className="font-mono text-destructive">45 / 100</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/50 pb-4">
                <span className="text-muted-foreground">First Contentful Paint</span>
                <span className="font-mono text-destructive">4.2s</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/50 pb-4">
                <span className="text-muted-foreground">Bundle Size</span>
                <span className="font-mono text-destructive">2.8MB</span>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/5 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 start-0 w-1 h-full bg-primary" />
            <h3 className="font-mono text-sm text-primary mb-8 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Aivora Standard
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-primary/10 pb-4">
                <span className="text-foreground font-medium">Lighthouse Score</span>
                <span className="font-mono text-primary font-bold">97 / 100</span>
              </div>
              <div className="flex justify-between items-center border-b border-primary/10 pb-4">
                <span className="text-foreground font-medium">First Contentful Paint</span>
                <span className="font-mono text-primary font-bold">0.8s</span>
              </div>
              <div className="flex justify-between items-center border-b border-primary/10 pb-4">
                <span className="text-foreground font-medium">Bundle Size</span>
                <span className="font-mono text-primary font-bold">180KB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function SectionIntegration() {
  const bottlenecks = [
    {
      title: "Latency Overhead",
      desc: "AI inference adds 200-2000ms per request. Our edge orchestration buffers and streams responses to maintain fluid UI states."
    },
    {
      title: "Type Mismatch",
      desc: "Unstructured LLM outputs collide with typed schemas. We enforce Zod validation perimeters at the edge."
    },
    {
      title: "Context Loss",
      desc: "Stateless APIs drop context. We implement vectorized persistent memory across conversation turns."
    }
  ]

  return (
    <section aria-label="Integration Challenges" className="py-24 lg:py-32 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <SectionLabel className="mb-4 text-gold">INTEGRATION CHALLENGES</SectionLabel>
          <h2 className="text-h2 font-display">Bridging the gap between legacy databases and modern language models.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {bottlenecks.map((item, i) => (
            <Card key={i} className="border-gold/20 shadow-none relative overflow-hidden bg-background">
              <div className="absolute top-0 start-0 w-1 h-full bg-gold" />
              <CardContent className="p-8">
                <h3 className="font-bold text-foreground mb-4 font-mono text-sm uppercase tracking-wider">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
