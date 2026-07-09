"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { staggerContainer, fadeUp } from "@/lib/motion"
import { GlassCard } from "@/components/ui/GlassCard"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Button } from "@/components/ui/Button"
import { Link } from "@/i18n/routing"
import { Clock } from "lucide-react"

export function CaseStudiesEditorial() {
  const t = useTranslations("case-studies")

  return (
    <section className="py-24 lg:py-32 bg-background relative flex items-center justify-center min-h-[70vh]" aria-label={t("headline")}>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-8"
        >
          <motion.div variants={fadeUp} className="flex flex-col items-center">
            <SectionLabel>{t("headline")}</SectionLabel>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-6 mb-4 animate-pulse">
              <Clock size={32} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              {t("subheadline")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("supportingText")}
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Button asChild variant="primary" className="shadow-md shadow-primary/20">
              <Link href="/">{t("primaryCTA")}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
