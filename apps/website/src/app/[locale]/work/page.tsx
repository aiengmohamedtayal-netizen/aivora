import React from "react"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/routing"
import { GlassCard } from "@aivora/ui/GlassCard"
import { SectionLabel } from "@aivora/ui/SectionLabel"
import { Button } from "@aivora/ui/Button"
import { BarChart3, Bot, Ship, ArrowRight, CheckCircle } from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "work" })
  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
  }
}

const icons = [BarChart3, Bot, Ship]

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "work" })

  const projects = t.raw("projects") as Array<{
    title: string
    tag: string
    description: string
    outcome: string
  }>

  return (
    <main className="flex min-h-screen flex-col bg-background pt-24 lg:pt-32 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10 flex flex-col gap-12 lg:gap-16 pb-24">
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

        {/* Projects list */}
        <div className="flex flex-col gap-8">
          {projects.map((p, i) => {
            const Icon = icons[i % icons.length] as React.ComponentType<{ className?: string }>
            return (
              <GlassCard 
                key={p.title}
                className="grid md:grid-cols-12 gap-6 lg:gap-8 border border-white/5 bg-card/10 hover:border-primary/20 transition-all duration-300 shadow-lg p-8 rounded-2xl items-center relative overflow-hidden group"
              >
                {/* Visual Icon Box */}
                <div className="md:col-span-3 flex justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-10 h-10" />
                  </div>
                </div>

                {/* Details */}
                <div className="md:col-span-9 flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-primary/10 text-primary">
                      {p.tag}
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
                    {p.title}
                  </h2>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>

                  <hr className="border-t border-white/5 my-2" />

                  <div className="flex items-center gap-2 text-sm text-foreground/95">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>{locale === "ar" ? "النتيجة:" : "Outcome:"}</strong> {p.outcome}</span>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>

        {/* View Case Studies Link */}
        <div className="flex justify-center mt-4">
          <Button asChild variant="secondary">
            <Link href="/case-studies" className="inline-flex items-center gap-2">
              {t("viewCaseStudies")}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
