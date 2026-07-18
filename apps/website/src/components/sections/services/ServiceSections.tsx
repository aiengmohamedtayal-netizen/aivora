"use client"

import { HelpCircle, CpuIcon, CheckCircle2, Code2, Minus, Plus } from "lucide-react"
import { GlassCard } from "@aivora/ui/GlassCard"
import { Button } from "@aivora/ui/Button"
import { Link } from "@/i18n/routing"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { collapseProps } from "@aivora/lib/motion"

// ─── Types ───────────────────────────────────────────────────────────────────

export type ServiceTranslations = {
  problems: { title: string; description: string }
  solution: { title: string; description: string }
  features: {
    title: string
    items: Array<{ title: string; description: string }>
  }
  process: {
    title: string
    steps: Array<{ title: string; description: string }>
  }
  techStack: {
    title: string
    technologies: string[]
  }
  benefits: {
    title: string
    items: Array<{ title: string; description: string }>
  }
  faq: {
    title: string
    items: Array<{ question: string; answer: string }>
  }
  cta: { title: string; description: string; button: string }
  hero: { title: string; description: string; primaryCta: string; secondaryCta: string }
  seoTitle: string
  seoDescription: string
}

// ─── Individual Section Components (pure, accept data as props) ──────────────

export function ServiceProblems({ data }: { data: ServiceTranslations["problems"] }) {
  return (
    <GlassCard className="flex flex-col gap-4 border border-red-500/10 bg-red-500/[0.02] p-8 rounded-2xl">
      <div className="flex items-center gap-3 text-red-400">
        <HelpCircle className="w-6 h-6" />
        <h2 className="text-xl font-semibold tracking-tight">{data.title}</h2>
      </div>
      <p className="text-base leading-relaxed text-muted-foreground">{data.description}</p>
    </GlassCard>
  )
}

export function ServiceSolution({ data }: { data: ServiceTranslations["solution"] }) {
  return (
    <GlassCard className="flex flex-col gap-4 border border-blue-500/10 bg-blue-500/[0.02] p-8 rounded-2xl">
      <div className="flex items-center gap-3 text-blue-400">
        <CpuIcon className="w-6 h-6" />
        <h2 className="text-xl font-semibold tracking-tight">{data.title}</h2>
      </div>
      <p className="text-base leading-relaxed text-muted-foreground">{data.description}</p>
    </GlassCard>
  )
}

export function ServiceFeatures({ data }: { data: ServiceTranslations["features"] }) {
  const items = Array.isArray(data?.items) ? data.items : []
  return (
    <div className="flex flex-col gap-8 py-12 border-t border-border mt-12">
      <h2 className="text-3xl font-semibold text-foreground tracking-tight">{data.title}</h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <GlassCard key={idx} className="p-6">
            <h3 className="text-lg font-medium text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

export function ServiceProcess({ data }: { data: ServiceTranslations["process"] }) {
  const steps = Array.isArray(data?.steps) ? data.steps : []
  return (
    <div className="flex flex-col gap-8 py-12 border-t border-border">
      <h2 className="text-3xl font-semibold text-foreground tracking-tight">{data.title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-mono font-medium">
              0{idx + 1}
            </div>
            <h3 className="text-lg font-medium text-foreground">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ServiceTechStack({ data }: { data: ServiceTranslations["techStack"] }) {
  const technologies = Array.isArray(data?.technologies) ? data.technologies : []
  return (
    <div className="flex flex-col gap-8 py-12 border-t border-border">
      <h2 className="text-3xl font-semibold text-foreground tracking-tight">{data.title}</h2>
      <div className="flex flex-wrap gap-3">
        {technologies.map((tech, idx) => (
          <div key={idx} className="px-4 py-2 rounded-full border border-border bg-card/20 text-sm text-foreground flex items-center gap-2">
            <Code2 className="w-4 h-4 text-muted-foreground" />
            {tech}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ServiceBenefits({ data }: { data: ServiceTranslations["benefits"] }) {
  const items = Array.isArray(data?.items) ? data.items : []
  return (
    <div className="flex flex-col gap-8 py-12 border-t border-border">
      <h2 className="text-3xl font-semibold text-foreground tracking-tight">{data.title}</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <GlassCard key={idx} className="flex flex-col gap-4 border border-emerald-500/10 bg-emerald-500/[0.02] p-8 rounded-2xl">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">{item.description}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

export function ServiceFAQ({ data }: { data: ServiceTranslations["faq"] }) {
  const items = Array.isArray(data?.items) ? data.items : []
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <div className="flex flex-col gap-8 py-12 border-t border-border">
      <h2 className="text-3xl font-semibold text-foreground tracking-tight">{data.title}</h2>
      <div className="space-y-4">
        {items.map((item, idx) => {
          const isOpen = openIdx === idx
          return (
            <div key={idx} className="border border-border bg-card/20 rounded-xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggle(idx)}
                className="w-full px-6 py-5 text-start font-medium text-sm sm:text-base flex items-center justify-between gap-4 text-foreground hover:bg-card/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span>{item.question}</span>
                {isOpen ? (
                  <Minus className="w-4 h-4 text-primary flex-shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 text-primary flex-shrink-0" />
                )}
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div {...collapseProps} className="overflow-hidden">
                    <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4 bg-card/10">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ServiceCTA({ data }: { data: ServiceTranslations["cta"] }) {
  return (
    <div className="py-16">
      <GlassCard className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 lg:p-12 rounded-3xl border-primary/20 bg-primary/5">
        <div className="flex flex-col gap-4 text-center md:text-start">
          <h2 className="text-3xl font-semibold text-foreground tracking-tight">{data.title}</h2>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">{data.description}</p>
        </div>
        <Button asChild variant="primary" size="lg" className="shrink-0 rounded-full px-8">
          <Link href="/intake">{data.button}</Link>
        </Button>
      </GlassCard>
    </div>
  )
}
