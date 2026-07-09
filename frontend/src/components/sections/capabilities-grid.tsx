"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { staggerContainer, fadeUp } from "@/lib/motion"
import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/Badge"
import { Brain, Cloud, Building2, Globe, Workflow, LayoutDashboard, type LucideIcon } from "lucide-react"
import { SectionLabel } from "@/components/ui/SectionLabel"

const ICONS: Record<string, LucideIcon> = {
  "ai-systems": Brain,
  "saas-platforms": Cloud,
  "business-platforms": Building2,
  "modern-websites": Globe,
  "automation": Workflow,
  "dashboards": LayoutDashboard,
}

export function CapabilitiesGrid() {
  const t = useTranslations("capabilities")
  const capabilities = t.raw("capabilities") as Array<{
    id: string
    title: string
    description: string
    outcome: string
    tech_stack: string[]
  }>

  return (
    <section className="py-24 lg:py-32 bg-background relative" aria-label={t("headline")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-12 lg:gap-16"
        >
          <motion.div variants={fadeUp} className="mb-8 lg:mb-12">
            <SectionLabel>{t("headline")}</SectionLabel>
            <h2 className="text-h2 mt-4 font-bold text-foreground">
              {t("subheadline")}
            </h2>
          </motion.div>

          <div className="flex flex-col gap-8">
            {capabilities.map((capability, index) => {
              const Icon = ICONS[capability.id] || Brain
              return (
                <motion.div key={capability.id} variants={fadeUp}>
                  <GlassCard className="p-8 lg:p-12 border-s-4 border-primary transition-all duration-300 hover:shadow-lg group">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                      {/* Left Col: Icon & Title */}
                      <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                          <Icon size={32} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-h3 font-bold text-foreground">
                          {capability.title}
                        </h3>
                      </div>
                      
                      {/* Middle Col: Description & Outcome */}
                      <div className="lg:col-span-5 flex flex-col gap-6 border-s border-border ps-6 lg:ps-8">
                        <p className="text-body text-muted-foreground leading-relaxed">
                          {capability.description}
                        </p>
                        <div className="bg-secondary/50 p-4 rounded-lg border border-border/50 transition-colors group-hover:bg-primary/5 group-hover:border-primary/20">
                          <span className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                            {t("labels.outcome")}
                          </span>
                          <p className="font-medium text-foreground text-sm">
                            {capability.outcome}
                          </p>
                        </div>
                      </div>

                      {/* Right Col: Tech Stack */}
                      <div className="lg:col-span-3 flex flex-col gap-4 border-s border-transparent lg:border-border ps-0 lg:ps-8 pt-4 lg:pt-0">
                        <span className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
                          {t("labels.architecture")}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {capability.tech_stack.map((tech) => (
                            <Badge key={tech} variant="outline" className="font-mono text-xs bg-background/50 text-muted-foreground">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
