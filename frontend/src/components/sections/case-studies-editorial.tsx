"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { staggerContainer, fadeUp } from "@/lib/motion"
import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/Badge"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Database, Network, Cpu, type LucideIcon } from "lucide-react"

const ICONS: Record<string, LucideIcon> = {
  "blueprint-ledger": Database,
  "blueprint-ai": Cpu,
  "blueprint-headless": Network,
}

export function CaseStudiesEditorial() {
  const t = useTranslations("CaseStudiesPage")
  const studies = t.raw("studies") as Array<{
    id: string
    title: string
    problem: string
    context: string
    strategy: string
    decisions: string
    technologies: string[]
    outcomes: string[]
    tradeoffs: string
    lessons: string
  }>

  return (
    <section className="py-24 lg:py-32 bg-background relative" aria-label={t("title")}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-16 lg:gap-24"
        >
          <motion.div variants={fadeUp} className="mb-4 text-center">
            <SectionLabel>{t("title")}</SectionLabel>
            <h2 className="text-h2 mt-4 font-bold text-foreground">
              {t("subtitle")}
            </h2>
          </motion.div>

          <div className="flex flex-col gap-16">
            {studies.map((study, index) => {
              const Icon = ICONS[study.id] || Database
              return (
                <motion.article key={study.id} variants={fadeUp} className="relative">
                  <div className="absolute -start-4 top-0 bottom-0 w-px bg-border/50 hidden lg:block" />
                  
                  <GlassCard className="p-8 lg:p-12 border-s-4 border-primary">
                    <div className="flex flex-col gap-12">
                      
                      {/* Header */}
                      <header className="flex flex-col gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                          <Icon size={32} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-h3 font-bold text-foreground leading-tight">
                          {study.title}
                        </h3>
                      </header>

                      {/* Content Stack */}
                      <div className="flex flex-col gap-10">
                        {/* Problem & Context */}
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-mono uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2">
                              {t("labels.problem")}
                            </h4>
                            <p className="text-body text-foreground leading-relaxed">
                              {study.problem}
                            </p>
                          </div>
                          <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-mono uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2">
                              {t("labels.context")}
                            </h4>
                            <p className="text-body text-foreground leading-relaxed">
                              {study.context}
                            </p>
                          </div>
                        </div>

                        {/* Strategy & Decisions */}
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-mono uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2">
                              {t("labels.strategy")}
                            </h4>
                            <p className="text-body text-foreground leading-relaxed">
                              {study.strategy}
                            </p>
                          </div>
                          <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-mono uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2">
                              {t("labels.decisions")}
                            </h4>
                            <p className="text-body text-foreground leading-relaxed">
                              {study.decisions}
                            </p>
                          </div>
                        </div>

                        {/* Outcomes (Highlighted) */}
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 lg:p-8">
                          <h4 className="text-sm font-mono uppercase tracking-wider text-primary mb-4">
                            {t("labels.outcomes")}
                          </h4>
                          <ul className="grid sm:grid-cols-2 gap-4">
                            {study.outcomes.map((outcome, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <span className="text-primary font-mono mt-1">{"->"}</span>
                                <span className="text-foreground text-sm font-medium leading-relaxed">{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Trade-offs & Lessons */}
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-mono uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2">
                              {t("labels.tradeoffs")}
                            </h4>
                            <p className="text-body text-foreground leading-relaxed">
                              {study.tradeoffs}
                            </p>
                          </div>
                          <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-mono uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2">
                              {t("labels.lessons")}
                            </h4>
                            <p className="text-body text-foreground leading-relaxed">
                              {study.lessons}
                            </p>
                          </div>
                        </div>

                        {/* Technology Stack Footer */}
                        <div className="flex flex-col gap-4 pt-8 border-t border-border/50">
                          <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                            {t("labels.technologies")}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {study.technologies.map((tech) => (
                              <Badge key={tech} variant="outline" className="font-mono text-xs bg-background/50">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  </GlassCard>
                </motion.article>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
