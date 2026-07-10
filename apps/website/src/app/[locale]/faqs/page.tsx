import { getTranslations } from "next-intl/server"
import { SectionFAQ } from "@/components/sections/technology"
import Script from "next/script"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "faq" })
  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
  }
}

export default async function FAQsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "faq" })

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t("items.timeline.question"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("items.timeline.answer")
        }
      },
      {
        "@type": "Question",
        "name": t("items.support.question"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("items.support.answer")
        }
      },
      {
        "@type": "Question",
        "name": t("items.integration.question"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("items.integration.answer")
        }
      }
    ]
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
        "name": locale === "ar" ? "الأسئلة الشائعة" : "FAQs",
        "item": `https://aivora-lac.vercel.app/${locale}/faqs`
      }
    ]
  }

  return (
    <main className="flex min-h-screen flex-col bg-background pt-16">
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id="faq-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SectionFAQ />
    </main>
  )
}
