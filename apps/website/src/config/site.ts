export const siteConfig = {
  name: "Aivora",
  shortName: "Aivora",
  description: "Premium AI & Software Engineering Studio. We build world-class digital products, SaaS platforms, enterprise systems, and custom automation.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://aivora-lac.vercel.app",
  ogImage: "https://aivora-lac.vercel.app/og.png",
  links: {
    twitter: "https://x.com/aivora",
    github: "https://github.com/aiengmohamedtayal-netizen",
  },
  creator: "Mohamed Tayal",
}

export type SiteConfig = typeof siteConfig
