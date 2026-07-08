"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { sectionReveal, fadeUp, staggerContainer } from "@/lib/motion"
import { SectionLabel } from "@/components/ui"

export function SectionManifesto() {
  const t = useTranslations("HomePage")

  return (
    <section 
      aria-label="Manifesto" 
      className="relative min-h-[90vh] flex flex-col justify-center py-24 lg:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel className="mb-6">SYSTEMS ONLINE</SectionLabel>
          </motion.div>
          <motion.h1 
            variants={fadeUp}
            className="text-h1 font-display tracking-tight text-foreground mb-8"
          >
            We build software that runs without compromise.
          </motion.h1>
          <motion.p 
            variants={fadeUp}
            className="text-lead text-muted-foreground max-w-2xl"
          >
            Deterministic AI systems and enterprise software engineered for high-throughput environments.
          </motion.p>
        </motion.div>
        
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="absolute bottom-12 start-4 sm:start-6 lg:start-8 font-mono text-xs text-muted-foreground"
        >
          48.8566° N, 2.3522° E — Aivora HQ
        </motion.div>
      </div>
    </section>
  )
}

export function SectionGlobalOps() {
  return (
    <section aria-label="Global Operations" className="py-24 lg:py-32 border-t border-border/50 bg-background/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <SectionLabel className="mb-4">GLOBAL INFRASTRUCTURE</SectionLabel>
            <h2 className="text-h2 font-display">Enterprise scale, deployed worldwide.</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border/50 rounded-2xl overflow-hidden">
          {[
            { region: "Frankfurt", latency: "12ms", status: "Active" },
            { region: "Singapore", latency: "45ms", status: "Active" },
            { region: "Virginia", latency: "8ms", status: "Active" },
            { region: "Dubai", latency: "22ms", status: "Active" },
          ].map((node) => (
            <div key={node.region} className="bg-background p-6 flex flex-col gap-4 group hover:bg-muted/50 transition-colors">
              <span className="font-mono text-sm text-foreground">{node.region}</span>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-mono text-xs text-muted-foreground">{node.latency}</span>
                <span className="flex items-center gap-2 font-mono text-xs text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {node.status}
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
  return (
    <section aria-label="Core Thesis" className="py-32 lg:py-48 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl ms-auto border-s-2 border-primary ps-8 lg:ps-12 py-4">
          <blockquote className="text-h2 font-display text-foreground leading-tight tracking-tight mb-8">
            "Most software projects fail because of shortcuts. We don't take them."
          </blockquote>
          <cite className="font-mono text-sm text-muted-foreground not-italic">
            — Aivora Engineering Manifesto
          </cite>
        </div>
      </div>
    </section>
  )
}
