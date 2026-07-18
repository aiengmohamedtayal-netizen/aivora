import { getTranslations } from "next-intl/server"
import { GlassCard } from "@aivora/ui/GlassCard"
import { SectionLabel } from "@aivora/ui/SectionLabel"
import { Mail, Briefcase, Award, Zap } from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "careers" })
  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
  }
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "careers" })

  const positions = t.raw("positions") as Array<{
    title: string
    type: string
    description: string
  }>

  return (
    <main className="flex min-h-screen flex-col bg-background pt-24 lg:pt-32 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 flex flex-col gap-12 lg:gap-16 pb-24">
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-4">
          <SectionLabel>{t("headline")}</SectionLabel>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {t("subheadline")}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t("supportingText")}
          </p>
        </div>

        {/* Intro */}
        <GlassCard className="border border-white/5 bg-card/10 p-8 rounded-2xl">
          <p className="text-lg leading-relaxed text-foreground/90 text-center">
            {t("intro")}
          </p>
        </GlassCard>

        {/* Positions Grid */}
        <div className="flex flex-col gap-8">
          <h2 className="text-2xl font-semibold text-foreground border-b border-white/5 pb-4">
            {t("positionsHeader")}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {positions.map((pos) => (
              <GlassCard 
                key={pos.title}
                className="flex flex-col justify-between gap-4 border border-white/5 bg-card/10 hover:border-primary/20 transition-all duration-300 shadow-md p-6 rounded-2xl relative overflow-hidden group"
              >
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground tracking-tight">
                    {pos.title}
                  </h3>
                  <span className="font-mono text-xs text-primary/75">
                    {pos.type}
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground mt-2">
                    {pos.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Application CTA */}
        <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-white/5 bg-white/[0.02] max-w-2xl mx-auto w-full gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Mail className="w-6 h-6" />
          </div>
          <p className="text-base text-muted-foreground">
            {t("applyText")}
          </p>
          <a 
            href="mailto:aiengmohamedtayal@gmail.com" 
            className="text-xl font-semibold text-primary hover:underline font-mono"
          >
            aiengmohamedtayal@gmail.com
          </a>
        </div>
      </div>
    </main>
  )
}
