import { MetadataRoute } from "next"
import { getBaseUrl } from "@aivora/lib/utils"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl()

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/intake"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
