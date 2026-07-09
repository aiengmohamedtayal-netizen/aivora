"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { staggerContainer, fadeUp } from "@/lib/motion"
import { SectionLabel } from "@/components/ui/SectionLabel"


export function EngineeringCulture() {
  const t = useTranslations("engineering-culture")
  const pillars = t.raw("pillars") as Array<{
    id: string
    title: string
    content: string
  }>

  return (
    <article className="py-24 lg:py-32 bg-background relative" aria-label={t("headline")}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-24 lg:gap-32"
        >
          {/* Header & Manifesto */}
          <motion.header variants={fadeUp} className="flex flex-col gap-12 lg:gap-16">
            <div>
              <SectionLabel>{t("headline")}</SectionLabel>
            </div>
            <h1 className="text-h1 text-foreground">
              {t("manifesto")}
            </h1>
          </motion.header>

          <hr className="border-t border-border/60" />

          {/* Pillars List */}
          <div className="flex flex-col gap-20 lg:gap-32">
            {pillars.map((pillar, index) => (
              <motion.section 
                key={pillar.id} 
                variants={fadeUp} 
                className="grid md:grid-cols-12 gap-8 lg:gap-16 items-start"
              >
                <div className="md:col-span-5 flex flex-col">
                  <span className="text-primary font-mono text-sm tracking-wider mb-4 opacity-80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground leading-snug">
                    {pillar.title}
                  </h2>
                </div>
                
                <div className="md:col-span-7">
                  <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                    {pillar.content}
                  </p>
                </div>
              </motion.section>
            ))}
          </div>

        </motion.div>
      </div>
    </article>
  )
}
