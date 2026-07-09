import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { Link } from "@/i18n/routing"
import Script from "next/script"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/Button"
import { 
  ArrowLeft, 
  Brain, 
  Code, 
  Layers, 
  Sparkles, 
  Cpu, 
  Rocket, 
  CheckCircle2, 
  HelpCircle, 
  CpuIcon 
} from "lucide-react"

const SLUGS = [
  "ai-solutions",
  "custom-software",
  "saas-development",
  "web-development",
  "automation",
  "startup-mvp"
]

export async function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!SLUGS.includes(slug)) return {}

  const t = await getTranslations({ locale, namespace: "services" })
  return {
    title: t(`${slug}.seoTitle`),
    description: t(`${slug}.seoDescription`),
  }
}

const icons: Record<string, any> = {
  "ai-solutions": Brain,
  "custom-software": Code,
  "saas-development": Layers,
  "web-development": Sparkles,
  "automation": Cpu,
  "startup-mvp": Rocket
}

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!SLUGS.includes(slug)) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: "services" })
  const Icon = icons[slug] || Brain

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": t(`${slug}.title`),
    "description": t(`${slug}.description`),
    "provider": {
      "@type": "Organization",
      "name": "Aivora",
      "url": "https://aivora-lac.vercel.app"
    },
    "areaServed": "Worldwide"
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": locale === "ar" ? "الرئيسية" : "Home",
        "item": `https://aivora-lac.vercel.app/${locale}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": locale === "ar" ? "الخدمات" : "Services",
        "item": `https://aivora-lac.vercel.app/${locale}/services`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": t(`${slug}.title`),
        "item": `https://aivora-lac.vercel.app/${locale}/services/${slug}`
      }
    ]
  }

  return (
    <main className="flex min-h-screen flex-col bg-background pt-24 lg:pt-32 relative overflow-hidden">
      <Script
        id="service-detail-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Script
        id="service-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 flex flex-col gap-10 lg:gap-12 pb-24">
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
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {t(`${slug}.title`)}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t(`${slug}.description`)}
            </p>
          </div>
        </div>

        {/* Detail Description */}
        <p className="text-xl leading-relaxed text-foreground/90 max-w-3xl">
          {t(`${slug}.details`)}
        </p>

        {/* Three Columns: Challenge, Solution, Outcome */}
        <div className="grid md:grid-cols-3 gap-6 mt-4">
          {/* Challenge */}
          <GlassCard className="flex flex-col gap-4 border border-red-500/10 bg-red-500/[0.02] p-6 rounded-2xl hover:border-red-500/20 transition-all duration-300">
            <div className="flex items-center gap-2.5 text-red-400">
              <HelpCircle className="w-5 h-5" />
              <h2 className="font-semibold tracking-tight">
                {locale === "ar" ? "التحدي" : "The Challenge"}
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t(`${slug}.challenge`)}
            </p>
          </GlassCard>

          {/* Solution */}
          <GlassCard className="flex flex-col gap-4 border border-blue-500/10 bg-blue-500/[0.02] p-6 rounded-2xl hover:border-blue-500/20 transition-all duration-300">
            <div className="flex items-center gap-2.5 text-blue-400">
              <CpuIcon className="w-5 h-5" />
              <h2 className="font-semibold tracking-tight">
                {locale === "ar" ? "الحل" : "Our Solution"}
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t(`${slug}.solution`)}
            </p>
          </GlassCard>

          {/* Outcome */}
          <GlassCard className="flex flex-col gap-4 border border-emerald-500/10 bg-emerald-500/[0.02] p-6 rounded-2xl hover:border-emerald-500/20 transition-all duration-300">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <h2 className="font-semibold tracking-tight">
                {locale === "ar" ? "النتيجة" : "Business Outcome"}
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-foreground font-medium">
              {t(`${slug}.outcome`)}
            </p>
          </GlassCard>
        </div>

        {/* Call to Action */}
        <hr className="border-t border-white/5 my-4" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium text-foreground">
              {locale === "ar" ? "جاهز لبدء مشروعك؟" : "Ready to start your project?"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {locale === "ar" ? "احجز استشارتك المجانية ودعنا نصمم الحل المثالي لعملك." : "Book your free consultation and let's design the ideal solution for your business."}
            </p>
          </div>
          <Button asChild variant="primary" className="shadow-md shadow-primary/20 shrink-0">
            <Link href="/intake">
              {locale === "ar" ? "ابدأ مشروعك" : "Start a Project"}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
