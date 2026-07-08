import { getTranslations } from "next-intl/server"
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
  return (
    <div className="flex flex-col w-full">
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
