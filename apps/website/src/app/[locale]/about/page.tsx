import { getTranslations } from "next-intl/server"
import { EngineeringCulture } from "@/components/sections/engineering-culture"
import Script from "next/script"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "engineering-culture" })
  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

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
        "name": locale === "ar" ? "من نحن" : "About Us",
        "item": `https://aivora-lac.vercel.app/${locale}/about`
      }
    ]
  }

  // Injecting Person schemas for founders / key roles from the team section
  const teamPersonsJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "name": "Mohamed Tayal",
        "jobTitle": "Product Strategist",
        "worksFor": {
          "@type": "Organization",
          "name": "Aivora"
        }
      },
      {
        "@type": "Person",
        "name": "Aivora Lead Engineer",
        "jobTitle": "Software Engineer",
        "worksFor": {
          "@type": "Organization",
          "name": "Aivora"
        }
      }
    ]
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Script
        id="about-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="about-team-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamPersonsJsonLd) }}
      />
      <EngineeringCulture />
    </main>
  )
}
