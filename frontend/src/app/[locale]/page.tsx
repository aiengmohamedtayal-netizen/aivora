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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Aivora",
    "url": "https://aivora.com",
    "logo": "https://aivora.com/logo.png",
    "sameAs": [
      "https://twitter.com/aivora",
      "https://linkedin.com/company/aivora"
    ]
  }

  return (
    <div className="flex flex-col w-full">
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
