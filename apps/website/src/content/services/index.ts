import { webDevelopmentContent } from "./web-development"
import { aiIntegrationContent } from "./ai-integration"
import { cloudInfrastructureContent } from "./cloud-infrastructure"
import { workflowAutomationContent } from "./workflow-automation"

export const servicesContent = {
  "web-development": webDevelopmentContent,
  "ai-integration": aiIntegrationContent,
  "cloud-infrastructure": cloudInfrastructureContent,
  "workflow-automation": workflowAutomationContent
} as const

export type ServiceSlug = keyof typeof servicesContent
export type ServiceContent = typeof servicesContent[ServiceSlug]

export function getServiceBySlug(slug: string): ServiceContent | null {
  if (slug in servicesContent) {
    return servicesContent[slug as ServiceSlug]
  }
  return null
}

export function getAllServices() {
  return Object.values(servicesContent)
}
