import Script from "next/script"
import dynamic from "next/dynamic"
import { SectionManifesto, SectionServices, SectionIndustries } from "@/components/sections"
import { ProductShowcase } from "@/components/sections/product-showcase/ProductShowcase"

// Lazy load below-the-fold sections with ssr enabled for SEO indexing
const SectionWhyAivora = dynamic(
  () => import("@/components/sections/problems").then(m => m.SectionWhyAivora),
  { 
    ssr: true,
    loading: () => <div className="min-h-[300px] w-full bg-background animate-pulse" />
  }
)

const SectionProcess = dynamic(
  () => import("@/components/sections/process").then(m => m.SectionProcess),
  { 
    ssr: true,
    loading: () => <div className="min-h-[400px] w-full bg-background animate-pulse" />
  }
)

const SectionTeam = dynamic(
  () => import("@/components/sections/process").then(m => m.SectionTeam),
  { 
    ssr: true,
    loading: () => <div className="min-h-[300px] w-full bg-background animate-pulse" />
  }
)

const SectionTechnologies = dynamic(
  () => import("@/components/sections/technology").then(m => m.SectionTechnologies),
  { 
    ssr: true,
    loading: () => <div className="min-h-[250px] w-full bg-background animate-pulse" />
  }
)

const SectionFAQ = dynamic(
  () => import("@/components/sections/technology").then(m => m.SectionFAQ),
  { 
    ssr: true,
    loading: () => <div className="min-h-[350px] w-full bg-background animate-pulse" />
  }
)

const SectionConversion = dynamic(
  () => import("@/components/sections/conversion").then(m => m.SectionConversion),
  { 
    ssr: true,
    loading: () => <div className="min-h-[450px] w-full bg-background animate-pulse" />
  }
)

export default async function HomePage() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Aivora",
    "url": "https://aivora-lac.vercel.app",
    "logo": "https://aivora-lac.vercel.app/logo.png",
    "sameAs": [
      "https://www.instagram.com/aiivoraa",
      "https://www.linkedin.com/company/aivora",
      "https://github.com/aiengmohamedtayal-netizen/aivora"
    ],
    "description": "Aivora is an AI software engineering company that designs, builds, and scales modern digital products for startups and businesses.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cairo",
      "addressCountry": "Egypt"
    }
  }

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Aivora",
    "url": "https://aivora-lac.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://aivora-lac.vercel.app/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <div className="flex flex-col w-full">
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      
      {/* Above the fold (eager loaded) */}
      <SectionManifesto />
      <ProductShowcase />
      <SectionServices />
      <SectionIndustries />
      
      {/* Below the fold (lazy loaded) */}
      <SectionWhyAivora />
      <SectionProcess />
      <SectionTeam />
      <SectionTechnologies />
      <SectionFAQ />
      <SectionConversion />
    </div>
  )
}
