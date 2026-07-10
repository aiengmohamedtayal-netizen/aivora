"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { staggerContainer, fadeUp } from "@aivora/lib/motion"
import { GlassCard } from "@aivora/ui/GlassCard"
import { SectionLabel } from "@aivora/ui/SectionLabel"
import { Button } from "@aivora/ui/Button"
import { Link } from "@/i18n/routing"
import { Briefcase, ArrowRight } from "lucide-react"

export function CaseStudiesEditorial() {
  const t = useTranslations("case-studies")

  const cases = t.raw("cases") as Array<{
    id: string
    title: string
    client: string
    challenge: string
    solution: string
    outcome: string
  }>

  const labels = {
    client: t("labels.client"),
    challenge: t("labels.challenge"),
    solution: t("labels.solution"),
    outcome: t("labels.outcome")
  }

  return (
    <section className="py-24 lg:py-32 bg-background relative flex flex-col items-center min-h-[70vh]" aria-label={t("headline")}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-12"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="flex flex-col items-center text-center max-w-2xl">
            <SectionLabel>{t("headline")}</SectionLabel>
            <h1 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl mt-6 mb-6">
              {t("subheadline")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("supportingText")}
            </p>
          </motion.div>

          {/* Case Studies Cards Grid */}
          <motion.div 
            variants={fadeUp}
            className="grid md:grid-cols-2 gap-8 w-full mt-8"
          >
            {cases.map((c) => (
              <GlassCard 
                key={c.id}
                className="flex flex-col gap-6 border border-white/5 bg-card/10 hover:border-primary/20 transition-all duration-300 shadow-lg relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Briefcase size={20} />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-foreground">{c.title}</h2>
                    <span className="text-xs text-muted-foreground">{labels.client} {c.client}</span>
                  </div>
                </div>

                <hr className="border-t border-white/5" />

                <div className="flex flex-col gap-4 text-sm leading-relaxed">
                  <div>
                    <h3 className="font-mono text-xs font-semibold text-primary uppercase tracking-wider mb-1">{labels.challenge}</h3>
                    <p className="text-muted-foreground">{c.challenge}</p>
                  </div>
                  <div>
                    <h3 className="font-mono text-xs font-semibold text-primary uppercase tracking-wider mb-1">{labels.solution}</h3>
                    <p className="text-muted-foreground">{c.solution}</p>
                  </div>
                  <div>
                    <h3 className="font-mono text-xs font-semibold text-primary uppercase tracking-wider mb-1">{labels.outcome}</h3>
                    <p className="text-foreground font-medium">{c.outcome}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>

          {/* Action Button */}
          <motion.div variants={fadeUp} className="mt-8">
            <Button asChild variant="secondary">
              <Link href="/" className="inline-flex items-center gap-2">
                {t("primaryCTA")}
                <ArrowRight size={16} className="rtl:rotate-180" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
