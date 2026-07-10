import { useTranslations, useLocale } from "next-intl"
import { ArrowLeft } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/Button"

export function ServiceHero({ slug, icon: Icon }: { slug: string, icon: any }) {
  const t = useTranslations(`service-details.${slug}.hero`)
  const locale = useLocale()

  return (
    <div className="flex flex-col gap-10 lg:gap-12 relative z-10 pt-24 lg:pt-32 pb-16">
      {/* Back Link */}
      <div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
          {locale === "ar" ? "العودة للخدمات" : "Back to Services"}
        </Link>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 lg:gap-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Icon className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl max-w-4xl">
            {t("title")}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            {t("description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button asChild variant="primary" size="lg">
              <Link href="/intake">{t("primaryCta")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-white/10 hover:bg-white/5">
              <Link href="/contact">{t("secondaryCta")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
