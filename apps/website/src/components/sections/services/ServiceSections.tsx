"use client"

import { useTranslations } from "next-intl"
import { HelpCircle, CpuIcon, CheckCircle2, List, Code2, Server, ArrowRight, Minus, Plus } from "lucide-react"
import { GlassCard } from "@aivora/ui/GlassCard"
import { SectionLabel } from "@aivora/ui/SectionLabel"
import { Button } from "@aivora/ui/Button"
import { Link } from "@/i18n/routing"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { collapseProps } from "@aivora/lib/motion"

export function ServiceProblems({ slug }: { slug: string }) {
  const t = useTranslations(`service-details.${slug}.problems`)
  return (
    <GlassCard className="flex flex-col gap-4 border border-red-500/10 bg-red-500/[0.02] p-8 rounded-2xl">
      <div className="flex items-center gap-3 text-red-400">
        <HelpCircle className="w-6 h-6" />
        <h2 className="text-xl font-semibold tracking-tight">{t("title")}</h2>
      </div>
      <p className="text-base leading-relaxed text-muted-foreground">{t("description")}</p>
    </GlassCard>
  )
}

export function ServiceSolution({ slug }: { slug: string }) {
  const t = useTranslations(`service-details.${slug}.solution`)
  return (
    <GlassCard className="flex flex-col gap-4 border border-blue-500/10 bg-blue-500/[0.02] p-8 rounded-2xl">
      <div className="flex items-center gap-3 text-blue-400">
        <CpuIcon className="w-6 h-6" />
        <h2 className="text-xl font-semibold tracking-tight">{t("title")}</h2>
      </div>
      <p className="text-base leading-relaxed text-muted-foreground">{t("description")}</p>
    </GlassCard>
  )
}

export function ServiceFeatures({ slug }: { slug: string }) {
  const t = useTranslations(`service-details.${slug}.features`)
  const keys = [0, 1, 2, 3] as const
  return (
    <div className="flex flex-col gap-8 py-12 border-t border-border mt-12">
      <h2 className="text-3xl font-semibold text-foreground tracking-tight">{t("title")}</h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {keys.map((key) => (
          <GlassCard key={key} className="p-6">
            <h3 className="text-lg font-medium text-foreground mb-2">{t(`items.${key}.title`)}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t(`items.${key}.description`)}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

export function ServiceProcess({ slug }: { slug: string }) {
  const t = useTranslations(`service-details.${slug}.process`)
  const keys = [0, 1, 2, 3] as const
  return (
    <div className="flex flex-col gap-8 py-12 border-t border-border">
      <h2 className="text-3xl font-semibold text-foreground tracking-tight">{t("title")}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {keys.map((key) => (
          <div key={key} className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-mono font-medium">
              0{key + 1}
            </div>
            <h3 className="text-lg font-medium text-foreground">{t(`steps.${key}.title`)}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t(`steps.${key}.description`)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ServiceTechStack({ slug }: { slug: string }) {
  const t = useTranslations(`service-details.${slug}.techStack`)
  const keys = [0, 1, 2, 3] as const
  return (
    <div className="flex flex-col gap-8 py-12 border-t border-border">
      <h2 className="text-3xl font-semibold text-foreground tracking-tight">{t("title")}</h2>
      <div className="flex flex-wrap gap-3">
        {keys.map((key) => {
          // Because technologies array can be dynamic in length, we map keys 0-3 just for scaffolding
          // In a real scenario we could use t.raw() or map up to known limits
          const tech = t(`technologies.${key}`)
          if (!tech || tech.includes("Error")) return null
          return (
            <div key={key} className="px-4 py-2 rounded-full border border-border bg-card/20 text-sm text-foreground flex items-center gap-2">
              <Code2 className="w-4 h-4 text-muted-foreground" />
              {tech}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ServiceBenefits({ slug }: { slug: string }) {
  const t = useTranslations(`service-details.${slug}.benefits`)
  const keys = [0, 1, 2] as const
  return (
    <div className="flex flex-col gap-8 py-12 border-t border-border">
      <h2 className="text-3xl font-semibold text-foreground tracking-tight">{t("title")}</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {keys.map((key) => (
          <GlassCard key={key} className="flex flex-col gap-4 border border-emerald-500/10 bg-emerald-500/[0.02] p-8 rounded-2xl">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-xl font-semibold tracking-tight">{t(`items.${key}.title`)}</h3>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">{t(`items.${key}.description`)}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

export function ServiceFAQ({ slug }: { slug: string }) {
  const t = useTranslations(`service-details.${slug}.faq`)
  const keys = [0, 1, 2] as const
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <div className="flex flex-col gap-8 py-12 border-t border-border">
      <h2 className="text-3xl font-semibold text-foreground tracking-tight">{t("title")}</h2>
      <div className="space-y-4">
        {keys.map((key) => {
          const isOpen = openIdx === key
          const question = t(`items.${key}.question`)
          if (!question || question.includes("Error")) return null

          return (
            <div key={key} className="border border-border bg-card/20 rounded-xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggle(key)}
                className="w-full px-6 py-5 text-start font-medium text-sm sm:text-base flex items-center justify-between gap-4 text-foreground hover:bg-card/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span>{question}</span>
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
                      {t(`items.${key}.answer`)}
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

export function ServiceCTA({ slug }: { slug: string }) {
  const t = useTranslations(`service-details.${slug}.cta`)
  return (
    <div className="py-16">
      <GlassCard className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 lg:p-12 rounded-3xl border-primary/20 bg-primary/5">
        <div className="flex flex-col gap-4 text-center md:text-start">
          <h2 className="text-3xl font-semibold text-foreground tracking-tight">{t("title")}</h2>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">{t("description")}</p>
        </div>
        <Button asChild variant="primary" size="lg" className="shrink-0 rounded-full px-8">
          <Link href="/intake">{t("button")}</Link>
        </Button>
      </GlassCard>
    </div>
  )
}
