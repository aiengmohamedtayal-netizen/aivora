import { getTranslations } from "next-intl/server"
import { GlassCard } from "@aivora/ui/GlassCard"
import { SectionLabel } from "@aivora/ui/SectionLabel"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "privacy" })
  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
  }
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "privacy" })

  const sections = t.raw("sections") as Array<{
    title: string
    content: string
  }>

  return (
    <main className="flex min-h-screen flex-col bg-background pt-24 lg:pt-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl relative z-10 flex flex-col gap-10 pb-24">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <SectionLabel>{t("headline")}</SectionLabel>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {t("subheadline")}
          </h1>
          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
            <span>{t("lastUpdated")}</span>
          </div>
        </div>

        <GlassCard className="border border-white/5 bg-card/10 p-8 rounded-2xl flex flex-col gap-8">
          <p className="text-base leading-relaxed text-muted-foreground">
            {t("intro")}
          </p>

          <hr className="border-t border-white/5" />

          {sections.map((s) => (
            <div key={s.title} className="flex flex-col gap-3">
              <h2 className="text-xl font-medium text-foreground tracking-tight">
                {s.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {s.content}
              </p>
            </div>
          ))}
        </GlassCard>
      </div>
    </main>
  )
}
