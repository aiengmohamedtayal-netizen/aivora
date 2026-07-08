import { getTranslations } from "next-intl/server"
import Script from "next/script"
import { 
  SectionManifesto, 
  SectionGlobalOps, 
  SectionThesis, 
  SectionTechShift, 
  SectionVision, 
  SectionFragility, 
  SectionIntegration, 
  SectionConstitution, 
  SectionTypeSafety, 
  SectionCapabilities, 
  SectionStack, 
  SectionProcess, 
  SectionQualityGates, 
  SectionConversion 
} from "@/components/sections"

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
      
      {/* 1. Attention */}
      <SectionManifesto />
      <SectionGlobalOps />
      <SectionThesis />

      {/* 2. Future */}
      <SectionTechShift />
      <SectionVision />

      {/* 3. Problem */}
      <SectionFragility />
      <SectionIntegration />

      {/* 4. Engineering Mindset */}
      <SectionConstitution />
      <SectionTypeSafety />

      {/* 5. Capabilities */}
      <SectionCapabilities />

      {/* 6. Technology */}
      <SectionStack />

      {/* 7. Process */}
      <SectionProcess />
      <SectionQualityGates />

      {/* 8. Conversion */}
      <SectionConversion />
    </div>
  )
}
