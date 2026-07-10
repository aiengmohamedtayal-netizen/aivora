import { getTranslations } from "next-intl/server"
import Script from "next/script"
import { 
  SectionManifesto, 
  SectionServices,
  SectionIndustries,
  SectionWhyAivora,
  SectionProcess,
  SectionTeam,
  SectionTechnologies,
  SectionFAQ,
  SectionConversion 
} from "@/components/sections"
import { ProductShowcase } from "@/components/sections/product-showcase/ProductShowcase"

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
      
      {/* 1. Hero / Title */}
      <SectionManifesto />
      
      {/* 3. Interactive Product Showcase */}
      <ProductShowcase />
      
      {/* 4. Result-Oriented Services */}
      <SectionServices />
      
      {/* 5. Industries served */}
      <SectionIndustries />
      
      {/* 6. Why Aivora (Comparison / Benefits) */}
      <SectionWhyAivora />
      
      {/* 8. Process Flow */}
      <SectionProcess />
      
      {/* 9. Meet The Team */}
      <SectionTeam />
      
      {/* 10. Modern Technologies badges */}
      <SectionTechnologies />
      
      {/* 12. FAQ Accordion */}
      <SectionFAQ />
      
      {/* 13. Contact Form & Lead Intake (Supabase integration) */}
      <SectionConversion />
    </div>
  )
}
