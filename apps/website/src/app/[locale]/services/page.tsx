import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/routing"
import Script from "next/script"
import { GlassCard } from "@aivora/ui/GlassCard"
import { SectionLabel } from "@aivora/ui/SectionLabel"
import { 
  Brain, 
  Code, 
  Layers, 
  Sparkles, 
  Cpu, 
  Rocket, 
  ArrowRight 
} from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "services" })
  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
  }
}

export default async function ServicesPageIndex({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "services" })

  const serviceSlugs = [
    { slug: "ai-solutions", icon: Brain },
    { slug: "custom-software", icon: Code },
    { slug: "saas-development", icon: Layers },
    { slug: "web-development", icon: Sparkles },
    { slug: "automation", icon: Cpu },
    { slug: "startup-mvp", icon: Rocket }
  ]

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Aivora",
    "url": `https://aivora-lac.vercel.app/${locale}/services`,
    "logo": "https://aivora-lac.vercel.app/logo.png",
    "image": "https://aivora-lac.vercel.app/og-image.jpg",
    "description": "Custom AI integrations, SaaS platforms, enterprise software, and cloud solutions for businesses.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cairo",
      "addressCountry": "Egypt"
    },
    "priceRange": "$$$"
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
      }
    ]
  }

  return (
    <main className="flex min-h-screen flex-col bg-background pt-24 lg:pt-32 relative overflow-hidden">
      <Script
        id="local-business-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Script
        id="services-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Background Gradients */}
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

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {serviceSlugs.map((s) => {
            const Icon = s.icon
            return (
              <GlassCard 
                key={s.slug} 
                className="flex flex-col justify-between gap-6 border border-white/5 bg-card/10 hover:border-primary/20 transition-all duration-300 shadow-md relative overflow-hidden group p-8"
              >
                <div className="flex flex-col gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  {/* Title & Desc */}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-medium text-foreground tracking-tight">
                      {t(`${s.slug}.title`)}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t(`${s.slug}.description`)}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/services/${s.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-mono text-primary group-hover:underline mt-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                >
                  {t("viewDetails")}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>
              </GlassCard>
            )
          })}
        </div>
      </div>
    </main>
  )
}
