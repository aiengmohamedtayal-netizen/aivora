"use client"

import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@aivora/lib/utils"
import { fadeUp, staggerContainer, heroEntrance } from "@aivora/lib/motion"
import { SectionLabel, Card, Button } from "@aivora/ui"
import { HeroComposition } from "@aivora/ui/common/hero-composition"
import { ClaudeChatInput } from "@aivora/ui/common/ClaudeChatInput"
import { AnalyticsWorkspace } from "@aivora/ui/common/AnalyticsWorkspace"
import { ArrowRight, Globe, Layers, ArrowDown, Send, MessageSquare, BarChart3, Users, KanbanSquare, Monitor } from "lucide-react"
import { useState, useEffect } from "react"
import { CanvasWaveBackground } from "@aivora/ui/canvas-wave-background"

export function SectionManifesto() {
  const t = useTranslations("hero")
  const locale = useLocale()

  return (
    <section 
      aria-label="Manifesto" 
      className="relative min-h-[90vh] flex flex-col justify-center py-20 lg:py-28 overflow-hidden bg-background"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 flex flex-col items-start text-start z-20"
          >
            <motion.h1 
              variants={fadeUp}
              className="text-display text-foreground mb-6 text-balance"
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
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-foreground text-background font-sans text-[15px] font-medium rounded-xl shadow-md hover:bg-foreground/90 transition-all duration-300 group"
              >
                {t("cta")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
              <Link 
                href="/work" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border bg-card/30 backdrop-blur-md text-foreground font-sans text-[15px] font-medium rounded-xl hover:bg-muted/50 hover:border-foreground/40 transition-all duration-300"
              >
                {t("secondaryCta")}
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Right Column: Premium Hero Composition */}
          <motion.div 
            variants={heroEntrance}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex justify-center lg:justify-end w-full"
          >
            <HeroComposition />
          </motion.div>

        </div>
      </div>
    </section>
  )
}


