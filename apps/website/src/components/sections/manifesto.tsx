"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { motion } from "framer-motion"
import { fadeUp, staggerContainer } from "@aivora/lib/motion"
import { HeroComposition } from "@aivora/ui/common/hero-composition"
import { ArrowRight } from "lucide-react"
import { CanvasWaveBackground } from "@aivora/ui/canvas-wave-background"

export function SectionManifesto() {
  const t = useTranslations("hero")

  return (
    <section 
      aria-label="Manifesto" 
      className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden bg-background py-24 lg:py-28"
    >
      {/* Premium Tech Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Canvas Wave Background */}
      <CanvasWaveBackground 
        className="absolute inset-0 z-0" 
        opacity={0.45} 
        speed={0.0015} 
        amplitude={72} 
        frequency={0.0006} 
        blur={3}
        strokeWidth={1.8}
        colors={[
          'rgba(255, 255, 255, 0.16)',
          'rgba(255, 255, 255, 0.10)',
          'rgba(255, 255, 255, 0.06)',
          'rgba(255, 255, 255, 0.16)',
          'rgba(255, 255, 255, 0.10)',
          'rgba(255, 255, 255, 0.06)'
        ]}
      />

      {/* Layered ambient top spotlights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          
          {/* Left Column: Copy & CTAs */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="z-20 flex flex-col items-start text-start lg:col-span-6"
          >
            <motion.h1 
              variants={fadeUp}
              className="mb-6 max-w-[14ch] text-balance text-[clamp(2.65rem,5.1vw,5.5rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-foreground"
            >
              {t("headline")}
            </motion.h1>
            
            <motion.h2 
              variants={fadeUp}
              className="text-xl sm:text-2xl font-semibold text-foreground/90 mb-4 leading-relaxed text-balance"
            >
              {t("subheadline")}
            </motion.h2>

            <motion.p 
              variants={fadeUp}
              className="text-lg text-muted-foreground/90 max-w-xl mb-10 leading-relaxed text-balance"
            >
              {t("supportingText")}
            </motion.p>
            
            <motion.div 
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              <Link 
                href="/intake" 
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3.5 font-sans text-[15px] font-medium text-background shadow-md transition-all duration-300 hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {t("cta")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
              <Link 
                href="/work" 
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/30 px-6 py-3.5 font-sans text-[15px] font-medium text-foreground backdrop-blur-md transition-all duration-300 hover:border-foreground/40 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {t("secondaryCta")}
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Right Column: Premium Hero Composition */}
          <div className="flex w-full justify-center lg:col-span-6 lg:justify-end">
            <HeroComposition />
          </div>

        </div>
      </div>
    </section>
  )
}


