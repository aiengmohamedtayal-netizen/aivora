import { notFound, redirect } from "next/navigation"
import Script from "next/script"
import { 
  Sparkles, 
  Brain, 
  Layers, 
  Cpu 
} from "lucide-react"

import { ServiceHero } from "@/components/sections/services/ServiceHero"
import { 
  ServiceOverview,
  ServiceFeatures, 
  ServiceProcess, 
  ServiceTechStack, 
  ServiceBenefits, 
  ServiceFAQ, 
  ServiceCTA,
  type ServiceTranslations
} from "@/components/sections/services/ServiceSections"
import { getServiceBySlug } from "@/content/services"

// Redirection mapping for legacy/old slugs to avoid 404 or 500 errors
const LEGACY_REDIRECTS: Record<string, string> = {
  "ai-solutions": "ai-integration",
  "custom-software": "cloud-infrastructure",
  "automation": "workflow-automation",
  "saas-development": "web-development",
  "startup-mvp": "web-development"
}

const SUPPORTED_SLUGS = [
  "web-development",
  "ai-integration",
  "cloud-infrastructure",
  "workflow-automation"
]

export async function generateStaticParams() {
  return SUPPORTED_SLUGS.map((slug) => ({ slug }))
}

// Deep localization helper to extract correct translation properties
function localize<T>(obj: T, locale: "ar" | "en"): any {
  if (obj === null || obj === undefined) return obj
  if (typeof obj !== "object") return obj
  
  if ("ar" in obj && "en" in obj) {
    return (obj as any)[locale]
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => localize(item, locale))
  }
  
  const result: any = {}
  for (const key in obj) {
    result[key] = localize((obj as any)[key], locale)
  }
  return result
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const targetSlug = LEGACY_REDIRECTS[slug] || slug
  const cleanLocale = locale === "ar" ? "ar" : "en"

  const rawContent = getServiceBySlug(targetSlug)
  if (!rawContent) return {}

  const data = localize(rawContent, cleanLocale)

  return {
    title: data.seo?.title || data.hero?.title || "Aivora",
    description: data.seo?.description || data.hero?.description || "",
    keywords: data.seo?.keywords || "",
    alternates: {
      canonical: `https://aivora-lac.vercel.app/${locale}/services/${targetSlug}`
    }
  }
}

const icons: Record<string, any> = {
  "web-development": Sparkles,
  "ai-integration": Brain,
  "cloud-infrastructure": Layers,
  "workflow-automation": Cpu
}

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const cleanLocale = locale === "ar" ? "ar" : "en"

  // 1. Process Redirects for legacy routes
  if (slug in LEGACY_REDIRECTS) {
    redirect(`/${locale}/services/${LEGACY_REDIRECTS[slug]}`)
  }

  if (!SUPPORTED_SLUGS.includes(slug)) {
    notFound()
  }

  // 2. Fetch pre-localized CMS service content directly
  const rawContent = getServiceBySlug(slug)
  if (!rawContent) {
    notFound()
  }

  const localizedData = localize(rawContent, cleanLocale)
  
  // Guarantee full compatibility with expected ServiceTranslations layout structure
  const data: ServiceTranslations = {
    ...localizedData,
    seoTitle: localizedData.seo?.title || localizedData.hero?.title || "",
    seoDescription: localizedData.seo?.description || localizedData.hero?.description || ""
  }

  const Icon = icons[slug] || Sparkles

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": data.hero.title,
    "description": data.hero.description,
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
        "name": data.hero.title,
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
        <ServiceHero slug={slug} icon={Icon} data={data.hero} />

        <ServiceOverview data={data.overview} />

        <ServiceFeatures data={data.features} />
        
        <ServiceProcess data={data.process} />
        
        <ServiceTechStack data={data.techStack} />
        
        <ServiceBenefits data={data.benefits} />
        
        <ServiceFAQ data={data.faq} />
        
        <ServiceCTA data={data.cta} />
      </div>
    </main>
  )
}
