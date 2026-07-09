import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import localFont from "next/font/local"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { AivoraAssistant } from "@/components/common/AivoraAssistant"
import { SkipToContent } from "@/components/common/SkipToContent"
import { ZodErrorProvider } from "@/i18n/zodErrorMap"
import { MotionProvider } from "@/components/providers/MotionProvider"
import { GlobalWaveBackground } from "@/components/common/GlobalWaveBackground"
import "@/styles/globals.css"

const newsreader = {
  variable: "font-newsreader-class",
}

const thmanyahSans = localFont({
  src: [
    { path: "../../assets/fonts/thmanyah/thmanyahsans-Light.woff2", weight: "300", style: "normal" },
    { path: "../../assets/fonts/thmanyah/thmanyahsans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../assets/fonts/thmanyah/thmanyahsans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../assets/fonts/thmanyah/thmanyahsans-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../assets/fonts/thmanyah/thmanyahsans-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-thmanyah-sans",
  display: "swap",
})

const thmanyahDisplay = localFont({
  src: [
    { path: "../../assets/fonts/thmanyah/thmanyahserifdisplay-Light.woff2", weight: "300", style: "normal" },
    { path: "../../assets/fonts/thmanyah/thmanyahserifdisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../assets/fonts/thmanyah/thmanyahserifdisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../assets/fonts/thmanyah/thmanyahserifdisplay-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../assets/fonts/thmanyah/thmanyahserifdisplay-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-thmanyah-display",
  display: "swap",
})

import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata" })

  return {
    title: {
      default: t("title"),
      template: `%s | ${t("title")}`,
    },
    description: t("description"),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://aivora.com"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://aivora.com/${locale}`,
      siteName: "Aivora",
      locale: locale,
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Aivora - AI Engineering Platform",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.jpg"],
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  const messages = await getMessages()
  const dir = locale === "ar" ? "rtl" : "ltr"

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${newsreader.variable} ${thmanyahSans.variable} ${thmanyahDisplay.variable} bg-background text-foreground antialiased min-h-screen flex flex-col`}
        style={{
          "--font-body": locale === "ar" ? "var(--font-thmanyah-sans)" : "var(--font-geist-sans)",
          "--font-ui": locale === "ar" ? "var(--font-thmanyah-sans)" : "var(--font-geist-sans)",
          "--font-heading": locale === "ar" ? "var(--font-thmanyah-display)" : "var(--font-newsreader)",
          "--font-display": locale === "ar" ? "var(--font-thmanyah-display)" : "var(--font-newsreader)",
        } as React.CSSProperties}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider messages={messages}>
            <MotionProvider>
              <ZodErrorProvider>
                  {/*
                    ─── Global Z-Index Design System ─────────────────────────────
                    z-0  → GlobalWaveBackground (fixed, pointer-events-none)
                    z-10 → Page content (main)
                    z-20 → Navbar
                    z-30 → Drawers / Sheet panels
                    z-40 → Toasts / Dialogs
                    ──────────────────────────────────────────────────────────────
                  */}
                  {/* z-0: Animated atmospheric wave — global, page-aware intensity */}
                  <GlobalWaveBackground />

                  <SkipToContent />
                  <Navbar />
                  <main id="main-content" className="flex-1 w-full pt-16 relative z-10">
                    {children}
                  </main>
                  <Footer />
                  <AivoraAssistant />
                </ZodErrorProvider>
            </MotionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
