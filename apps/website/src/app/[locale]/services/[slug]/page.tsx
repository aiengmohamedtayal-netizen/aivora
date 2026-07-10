import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import Script from "next/script"
import { 
  Brain, 
  Code, 
  Layers, 
  Sparkles, 
  Cpu, 
  Rocket 
} from "lucide-react"

import { ServiceHero } from "@/components/sections/services/ServiceHero"
import { 
  ServiceProblems, 
  ServiceSolution, 
  ServiceFeatures, 
  ServiceProcess, 
  ServiceTechStack, 
  ServiceBenefits, 
  ServiceFAQ, 
  ServiceCTA 
} from "@/components/sections/services/ServiceSections"

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

  const t = await getTranslations({ locale, namespace: `service-details.${slug}` })
  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
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

  const t = await getTranslations({ locale, namespace: `service-details.${slug}` })
  const Icon = icons[slug] || Brain

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": t("hero.title"),
    "description": t("hero.description"),
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
        "name": t("hero.title"),
        "item": `https://aivora-lac.vercel.app/${locale}/services/${slug}`
      }
    ]
  }

  return (
    <main className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      <Script
        id={`service-detail-jsonld-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Script
        id={`service-breadcrumb-jsonld-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10 flex flex-col gap-10">
        <ServiceHero slug={slug} icon={Icon} />

        <div className="grid md:grid-cols-2 gap-6">
          <ServiceProblems slug={slug} />
          <ServiceSolution slug={slug} />
        </div>

        <ServiceFeatures slug={slug} />
        
        <ServiceProcess slug={slug} />
        
        <ServiceTechStack slug={slug} />
        
        <ServiceBenefits slug={slug} />
        
        <ServiceFAQ slug={slug} />
        
        <ServiceCTA slug={slug} />
      </div>
    </main>
  )
}
