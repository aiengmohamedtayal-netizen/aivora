import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/routing"
import { GlassCard } from "@/components/ui/GlassCard"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Button } from "@/components/ui/Button"
import { CheckCircle2, ArrowRight } from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "thank-you" })
  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
  }
}

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "thank-you" })

  return (
    <main className="flex min-h-screen flex-col bg-background pt-24 lg:pt-32 relative overflow-hidden items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl relative z-10 flex flex-col items-center pb-24 text-center">
        <GlassCard className="border border-white/5 bg-card/10 p-8 rounded-2xl flex flex-col items-center gap-6 max-w-lg w-full">
          <SectionLabel>{t("headline")}</SectionLabel>
          
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl mt-2">
            {t("subheadline")}
          </h1>
          
          <p className="text-base text-muted-foreground leading-relaxed">
            {t("message")}
          </p>

          <Button asChild variant="primary" className="mt-4 shadow-md shadow-primary/20">
            <Link href="/" className="inline-flex items-center gap-2">
              {t("cta")}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </Button>
        </GlassCard>
      </div>
    </main>
  )
}
