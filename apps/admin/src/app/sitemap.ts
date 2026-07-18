import { MetadataRoute } from "next"
import { getBaseUrl } from "@aivora/lib/utils"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()

  const locales = ["en", "ar"]
  const routes = [
    "",
    "/about",
    "/services",
    "/services/web-development",
    "/services/ai-integration",
    "/services/cloud-infrastructure",
    "/services/workflow-automation",
    "/work",
    "/portfolio",
    "/case-studies",
    "/process",
    "/blog",
    "/contact",
    "/faqs",
    "/careers",
    "/privacy-policy",
    "/terms-of-service",
    "/thank-you",
    "/404"
  ]

  const sitemap: MetadataRoute.Sitemap = []

  routes.forEach((route) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route}`,
            ar: `${baseUrl}/ar${route}`,
          },
        },
      })
    })
  })

  return sitemap
}
