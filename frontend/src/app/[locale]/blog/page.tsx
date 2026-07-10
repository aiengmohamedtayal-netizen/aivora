import { getTranslations } from "next-intl/server"
import Script from "next/script"
import { FeaturedArticle } from "@/components/blog/FeaturedArticle"
import { ArticleGrid } from "@/components/blog/ArticleGrid"
import { NewsletterCTA } from "@/components/blog/NewsletterCTA"
import { SectionLabel } from "@/components/ui/SectionLabel"

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
    alternates: {
      canonical: `https://aivora-lac.vercel.app/${locale}/blog`,
      languages: {
        "en": "https://aivora-lac.vercel.app/en/blog",
        "ar": "https://aivora-lac.vercel.app/ar/blog",
      }
    }
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "blog" })
  const indexT = await getTranslations({ locale, namespace: "blog.index" })
  
  const slugs = indexT.raw("slugs") as string[]
  
  const allPosts = await Promise.all(slugs.map(async (slug) => {
    try {
      const postT = await getTranslations({ locale, namespace: `blog.${slug}` })
      return {
        slug,
        title: postT("title"),
        excerpt: postT("excerpt"),
        author: postT("author"),
        authorImage: postT("authorImage"),
        coverImage: postT("coverImage"),
        category: postT("category"),
        publishDate: postT("publishDate"),
        readingTime: postT("readingTime"),
        featured: postT.raw("featured"),
      }
    } catch (err) {
      console.error(`Failed to load blog post: ${slug}`)
      return null
    }
  }))

  const posts = allPosts.filter(Boolean) as any[]
  
  const featuredPost = posts.find(p => p.featured) || posts[0]
  const recentPosts = posts.filter(p => p.slug !== featuredPost?.slug)

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
    "blogPost": posts.map((p) => ({
      "@type": "BlogPosting",
      "headline": p.title,
      "description": p.excerpt,
      "datePublished": p.publishDate,
      "author": {
        "@type": "Person",
        "name": p.author
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
        id="blog-posts-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 flex flex-col pb-24">
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-4 mb-16">
          <SectionLabel>{t("headline")}</SectionLabel>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {t("subheadline")}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t("supportingText")}
          </p>
        </div>

        {featuredPost && <FeaturedArticle post={featuredPost} />}
        
        <div className="my-16">
          <h2 className="text-3xl font-bold mb-8 text-foreground tracking-tight">Latest Articles</h2>
          <ArticleGrid posts={recentPosts} />
        </div>

        <NewsletterCTA />
      </div>
    </main>
  )
}
