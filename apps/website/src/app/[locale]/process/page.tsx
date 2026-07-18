import React from "react"
import { getTranslations } from "next-intl/server"
import { GlassCard } from "@aivora/ui/GlassCard"
import { SectionLabel } from "@aivora/ui/SectionLabel"
import { 
  Eye, 
  Map, 
  Palette, 
  Terminal, 
  Rocket, 
  ShieldCheck 
} from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "process" })
  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
  }
}

const icons = [Eye, Map, Palette, Terminal, Rocket, ShieldCheck]
const stepKeys = ["discover", "plan", "design", "develop", "launch", "support"]

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "process" })

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

        {/* Process Timeline */}
        <div className="relative border-s border-white/10 ms-4 md:ms-8 flex flex-col gap-10">
          {stepKeys.map((key, i) => {
            const Icon = icons[i % icons.length] as React.ComponentType<{ className?: string }>
            const stepNum = String(i + 1).padStart(2, "0")
            return (
              <div key={key} className="relative ps-8 md:ps-12 group">
                {/* Timeline Dot & Icon */}
                <div className="absolute -left-6 top-1.5 w-12 h-12 rounded-full border border-white/10 bg-background flex items-center justify-center text-primary group-hover:border-primary/45 transition-colors duration-300 shadow-md">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content Card */}
                <GlassCard className="flex flex-col gap-3 border border-white/5 bg-card/10 hover:border-primary/25 transition-all duration-300 shadow-md p-6 rounded-2xl">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-medium text-foreground">
                      {t(`steps.${key}.title`)}
                    </h2>
                    <span className="font-mono text-xs font-semibold text-primary/75">
                      {locale === "ar" ? `الخطوة ${stepNum}` : `STEP ${stepNum}`}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {t(`steps.${key}.description`)}
                  </p>
                </GlassCard>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
