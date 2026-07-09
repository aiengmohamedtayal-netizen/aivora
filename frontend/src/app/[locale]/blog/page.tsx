import { getTranslations } from "next-intl/server"
import Script from "next/script"
import { GlassCard } from "@/components/ui/GlassCard"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { BookOpen, Calendar, Clock } from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "blog" })
  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "blog" })

  const posts = t.raw("posts") as Array<{
    title: string
    tag: string
    date: string
    description: string
    readTime: string
  }>

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": locale === "ar" ? "الرئيسية" : "Home",
        "item": `https://aivora-lac.vercel.app/${locale}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": locale === "ar" ? "المدونة" : "Blog",
        "item": `https://aivora-lac.vercel.app/${locale}/blog`
      }
    ]
  }

  const speakableJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".speakable-headline", ".speakable-description"]
    }
  }

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": t("seoTitle"),
    "description": t("seoDescription"),
    "publisher": {
      "@type": "Organization",
      "name": "Aivora",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aivora-lac.vercel.app/logo.png"
      }
    },
    "blogPost": posts.map((p, idx) => ({
      "@type": "BlogPosting",
      "headline": p.title,
      "description": p.description,
      "datePublished": p.date === "July 8, 2026" || p.date === "٨ يوليو ٢٠٢٦" ? "2026-07-08" : (p.date === "July 1, 2026" || p.date === "١ يوليو ٢٠٢٦" ? "2026-07-01" : "2026-06-25"),
      "author": {
        "@type": "Organization",
        "name": "Aivora"
      }
    }))
  }

  return (
    <main className="flex min-h-screen flex-col bg-background pt-24 lg:pt-32 relative overflow-hidden">
      <Script
        id="blog-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="blog-speakable-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
      />
      <Script
        id="blog-posts-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 flex flex-col gap-12 lg:gap-16 pb-24">
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-4">
          <SectionLabel>{t("headline")}</SectionLabel>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl speakable-headline">
            {t("subheadline")}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed speakable-description">
            {t("supportingText")}
          </p>
        </div>

        {/* Blog Post List */}
        <div className="grid gap-8">
          {posts.map((post) => (
            <GlassCard 
              key={post.title}
              className="flex flex-col gap-5 border border-white/5 bg-card/10 hover:border-primary/20 transition-all duration-300 shadow-md p-8 rounded-2xl relative overflow-hidden group"
            >
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-primary/10 text-primary">
                  {post.tag}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-medium text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
                  {post.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {post.description}
                </p>
              </div>

              <div className="mt-2">
                <span className="inline-flex items-center gap-2 text-sm font-mono text-primary group-hover:underline cursor-pointer">
                  <BookOpen className="w-4 h-4" />
                  {t("readMore")}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </main>
  )
}
