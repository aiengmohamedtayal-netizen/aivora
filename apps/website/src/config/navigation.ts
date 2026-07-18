export interface NavItem {
  titleKey: string // Translation key
  href: string
  external?: boolean
}

export interface NavSection {
  titleKey: string
  items: NavItem[]
}

export const navigationConfig = {
  header: [
    { titleKey: "services", href: "/services" },
    { titleKey: "process", href: "/process" },
    { titleKey: "about", href: "/about" },
    { titleKey: "contact", href: "/intake" }
  ] as NavItem[],

  footer: {
    services: [
      { titleKey: "links.webDev", href: "/services/web-development" },
      { titleKey: "links.aiIntegration", href: "/services/ai-integration" },
      { titleKey: "links.cloud", href: "/services/cloud-infrastructure" },
      { titleKey: "links.automation", href: "/services/workflow-automation" }
    ] as NavItem[],
    company: [
      { titleKey: "links.about", href: "/about" },
      { titleKey: "services", href: "/services" },
      { titleKey: "links.contact", href: "/intake" }
    ] as NavItem[],
    legal: [
      { titleKey: "links.privacy", href: "/privacy-policy" },
      { titleKey: "links.terms", href: "/terms-of-service" }
    ] as NavItem[]
  }
}
