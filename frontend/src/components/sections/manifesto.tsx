"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { fadeUp, staggerContainer } from "@/lib/motion"
import { SectionLabel } from "@/components/ui"
import { HeroDashboard } from "./hero-dashboard"
import { ArrowRight, Globe, Layers, ArrowDown } from "lucide-react"

export function SectionManifesto() {
  const t = useTranslations("HomePage.hero")

  return (
    <section 
      aria-label="Manifesto" 
      className="relative min-h-[95vh] flex flex-col justify-center py-20 lg:py-28 overflow-hidden bg-background"
    >
      {/* Background radial spotlights & aurora meshes */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start text-start"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel className="mb-6 flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full">
                <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                {t("label")}
              </SectionLabel>
            </motion.div>
            
            <motion.h1 
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground leading-[1.1] mb-6"
            >
              {t("title")}
            </motion.h1>
            
            <motion.p 
              variants={fadeUp}
              className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              {t("description")}
            </motion.p>
            
            <motion.div 
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              <a 
                href="#intake" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-mono text-sm font-bold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/95 hover:shadow-primary/35 transition-all duration-300 group"
              >
                {t("ctaPrimary")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </a>
              <Link 
                href="/intelligence" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border/80 bg-card/40 backdrop-blur-md text-foreground font-mono text-sm font-bold rounded-xl hover:bg-muted/50 hover:border-foreground/20 transition-all duration-300"
              >
                {t("ctaSecondary")}
              </Link>
            </motion.div>

            {/* Micro Client Badges */}
            <motion.div 
              variants={fadeUp}
              className="mt-16 flex flex-col gap-3"
            >
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                Trusted by engineering teams at
              </span>
              <div className="flex flex-wrap gap-x-6 gap-y-2 opacity-50 font-display font-bold text-sm tracking-tight text-muted-foreground">
                <span>VERCEL_INC</span>
                <span>SUPABASE_CO</span>
                <span>OPENAI_CORP</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Column: Interactive Product Preview Dashboard */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <HeroDashboard />
          </motion.div>

        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 pointer-events-none opacity-40 animate-bounce">
        <span className="font-mono text-[10px] tracking-widest uppercase">Scroll</span>
        <ArrowDown className="w-4 h-4" />
      </div>
    </section>
  )
}

export function SectionGlobalOps() {
  const t = useTranslations("HomePage.globalOps")

  return (
    <section aria-label="Global Operations" className="py-24 lg:py-32 border-t border-border/50 bg-background/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.02),transparent_70%)] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <SectionLabel className="mb-4">{t("label")}</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
              {t("title")}
            </h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border/50 rounded-2xl overflow-hidden border border-border/50 shadow-xl">
          {[
            { key: "frankfurt", latency: "12ms" },
            { key: "singapore", latency: "45ms" },
            { key: "virginia", latency: "8ms" },
            { key: "dubai", latency: "22ms" },
          ].map((node) => (
            <div key={node.key} className="bg-card/40 backdrop-blur-md p-6 flex flex-col gap-6 group hover:bg-muted/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-foreground">
                  {t(`nodes.${node.key}`)}
                </span>
                <Layers className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-mono text-xs text-muted-foreground">{node.latency}</span>
                <span className="flex items-center gap-2 font-mono text-xs text-primary font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {t("active")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SectionThesis() {
  const t = useTranslations("HomePage.thesis")

  return (
    <section aria-label="Core Thesis" className="py-24 lg:py-36 bg-background relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto border-s-2 border-primary/50 ps-8 lg:ps-12 py-4 relative">
          <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-primary" />
          <blockquote className="text-2xl sm:text-3xl font-display font-medium text-foreground leading-snug tracking-tight mb-6">
            {t("quote")}
          </blockquote>
          <cite className="font-mono text-sm text-muted-foreground not-italic block font-bold">
            {t("attribution")}
          </cite>
        </div>
      </div>
    </section>
  )
}
