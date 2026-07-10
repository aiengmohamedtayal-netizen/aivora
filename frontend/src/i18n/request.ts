import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: {
      common: (await import(`../../messages/${locale}/common.json`)).default,
      navigation: (await import(`../../messages/${locale}/navigation.json`)).default,
      metadata: (await import(`../../messages/${locale}/metadata.json`)).default,
      validation: (await import(`../../messages/${locale}/validation.json`)).default,
      hero: (await import(`../../messages/${locale}/hero.json`)).default,
      services: (await import(`../../messages/${locale}/services.json`)).default,
      "services.ai-solutions": (await import(`../../messages/${locale}/services/ai-solutions.json`)).default,
      "services.custom-software": (await import(`../../messages/${locale}/services/custom-software.json`)).default,
      "services.saas-development": (await import(`../../messages/${locale}/services/saas-development.json`)).default,
      "services.web-development": (await import(`../../messages/${locale}/services/web-development.json`)).default,
      "services.automation": (await import(`../../messages/${locale}/services/automation.json`)).default,
      "services.startup-mvp": (await import(`../../messages/${locale}/services/startup-mvp.json`)).default,
      process: (await import(`../../messages/${locale}/process.json`)).default,
      industries: (await import(`../../messages/${locale}/industries.json`)).default,
      about: (await import(`../../messages/${locale}/about.json`)).default,
      contact: (await import(`../../messages/${locale}/contact.json`)).default,
      faq: (await import(`../../messages/${locale}/faq.json`)).default,
      footer: (await import(`../../messages/${locale}/footer.json`)).default,
      capabilities: (await import(`../../messages/${locale}/capabilities.json`)).default,
      "case-studies": (await import(`../../messages/${locale}/case-studies.json`)).default,
      "engineering-culture": (await import(`../../messages/${locale}/engineering-culture.json`)).default,
      "intake-portal": (await import(`../../messages/${locale}/intake-portal.json`)).default,
      intelligence: (await import(`../../messages/${locale}/intelligence.json`)).default,
      showcase: (await import(`../../messages/${locale}/showcase.json`)).default,
      team: (await import(`../../messages/${locale}/team.json`)).default,
    },
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
