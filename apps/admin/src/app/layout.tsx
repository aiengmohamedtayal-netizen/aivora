import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import localFont from "next/font/local"
import { ThemeProvider } from "@aivora/ui/providers/ThemeProvider"
import { AnalyticsProvider } from "@aivora/ui/providers/AnalyticsProvider"
import { MotionProvider } from "@aivora/ui/providers/MotionProvider"
import { GlobalWaveBackground } from "@aivora/ui/common/GlobalWaveBackground"
import "@/styles/globals.css"

const newsreader = {
  variable: "font-newsreader-class",
}

export const metadata: Metadata = {
  title: "Aivora OS - Admin",
  description: "Aivora Operating System Dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${newsreader.variable} bg-background text-foreground antialiased min-h-screen flex flex-col`}
        style={{
          "--font-body": "var(--font-geist-sans)",
          "--font-ui": "var(--font-geist-sans)",
          "--font-heading": "var(--font-newsreader)",
          "--font-display": "var(--font-newsreader)",
        } as React.CSSProperties}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MotionProvider>
              {/* z-0: Animated atmospheric wave — global, page-aware intensity */}
              <GlobalWaveBackground />
              {children}
              <AnalyticsProvider />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
