import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

// Explicitly require all JSON files per locale to guarantee that Vercel Bundler bundles them correctly
// and prevent dynamic import module resolution errors in serverless functions (which cause 500/404).
function loadMessages(locale: string) {
  if (locale === "ar") {
    return {
      common: require("../../messages/ar/common.json"),
      navigation: require("../../messages/ar/navigation.json"),
      metadata: require("../../messages/ar/metadata.json"),
      validation: require("../../messages/ar/validation.json"),
      hero: require("../../messages/ar/hero.json"),
      services: require("../../messages/ar/services.json"),
      "service-details": {
        "ai-solutions": require("../../messages/ar/services/ai-solutions.json"),
        "custom-software": require("../../messages/ar/services/custom-software.json"),
        "saas-development": require("../../messages/ar/services/saas-development.json"),
        "web-development": require("../../messages/ar/services/web-development.json"),
        automation: require("../../messages/ar/services/automation.json"),
        "startup-mvp": require("../../messages/ar/services/startup-mvp.json"),
      },
      blog: {
        ...require("../../messages/ar/blog.json"),
        index: require("../../messages/ar/blog/index.json"),
        "why-startups-should-choose-custom-software": require("../../messages/ar/blog/why-startups-should-choose-custom-software.json"),
        "practical-ai-customer-support-automation": require("../../messages/ar/blog/practical-ai-customer-support-automation.json"),
        "cost-of-technical-debt-enterprise": require("../../messages/ar/blog/cost-of-technical-debt-enterprise.json"),
      },
      process: require("../../messages/ar/process.json"),
      industries: require("../../messages/ar/industries.json"),
      about: require("../../messages/ar/about.json"),
      contact: require("../../messages/ar/contact.json"),
      faq: require("../../messages/ar/faq.json"),
      footer: require("../../messages/ar/footer.json"),
      capabilities: require("../../messages/ar/capabilities.json"),
      "case-studies": require("../../messages/ar/case-studies.json"),
      "engineering-culture": require("../../messages/ar/engineering-culture.json"),
      "intake-portal": require("../../messages/ar/intake-portal.json"),
      intelligence: require("../../messages/ar/intelligence.json"),
      showcase: require("../../messages/ar/showcase.json"),
      team: require("../../messages/ar/team.json"),
      "not-found": require("../../messages/ar/not-found.json"),
      admin: require("../../messages/ar/admin.json"),
      work: require("../../messages/ar/work.json"),
      careers: require("../../messages/ar/careers.json"),
      privacy: require("../../messages/ar/privacy.json"),
      terms: require("../../messages/ar/terms.json"),
      "thank-you": require("../../messages/ar/thank-you.json"),
    }
  }

  // Default to English ("en")
  return {
    common: require("../../messages/en/common.json"),
    navigation: require("../../messages/en/navigation.json"),
    metadata: require("../../messages/en/metadata.json"),
    validation: require("../../messages/en/validation.json"),
    hero: require("../../messages/en/hero.json"),
    services: require("../../messages/en/services.json"),
    "service-details": {
      "ai-solutions": require("../../messages/en/services/ai-solutions.json"),
      "custom-software": require("../../messages/en/services/custom-software.json"),
      "saas-development": require("../../messages/en/services/saas-development.json"),
      "web-development": require("../../messages/en/services/web-development.json"),
      automation: require("../../messages/en/services/automation.json"),
      "startup-mvp": require("../../messages/en/services/startup-mvp.json"),
    },
    blog: {
      ...require("../../messages/en/blog.json"),
      index: require("../../messages/en/blog/index.json"),
      "why-startups-should-choose-custom-software": require("../../messages/en/blog/why-startups-should-choose-custom-software.json"),
      "practical-ai-customer-support-automation": require("../../messages/en/blog/practical-ai-customer-support-automation.json"),
      "cost-of-technical-debt-enterprise": require("../../messages/en/blog/cost-of-technical-debt-enterprise.json"),
    },
    process: require("../../messages/en/process.json"),
    industries: require("../../messages/en/industries.json"),
    about: require("../../messages/en/about.json"),
    contact: require("../../messages/en/contact.json"),
    faq: require("../../messages/en/faq.json"),
    footer: require("../../messages/en/footer.json"),
    capabilities: require("../../messages/en/capabilities.json"),
    "case-studies": require("../../messages/en/case-studies.json"),
    "engineering-culture": require("../../messages/en/engineering-culture.json"),
    "intake-portal": require("../../messages/en/intake-portal.json"),
    intelligence: require("../../messages/en/intelligence.json"),
    showcase: require("../../messages/en/showcase.json"),
    team: require("../../messages/en/team.json"),
    "not-found": require("../../messages/en/not-found.json"),
    admin: require("../../messages/en/admin.json"),
    work: require("../../messages/en/work.json"),
    careers: require("../../messages/en/careers.json"),
    privacy: require("../../messages/en/privacy.json"),
    terms: require("../../messages/en/terms.json"),
    "thank-you": require("../../messages/en/thank-you.json"),
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: loadMessages(locale),
    now: new Date(),
    timeZone: "Asia/Dubai",
    formats: {
      dateTime: {
        short: {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      },
      number: {
        currency: {
          style: "currency",
          currency: "USD",
        },
      },
      list: {
        enumeration: {
          style: "long",
          type: "conjunction",
        },
      },
    },
    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter((part) => part != null).join(".")
      
      if (error.code === "MISSING_MESSAGE") {
        console.warn(`[next-intl] Missing translation for key: ${path}`)
        return path
      }
      
      return "Error: Translation failed"
    },
  }
})
