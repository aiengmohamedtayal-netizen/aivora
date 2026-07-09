"use client"

import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { SectionLabel, Card, CardContent } from "@/components/ui"
import { fadeUp, staggerContainer, collapseProps } from "@/lib/motion"
import { ChevronDown, Plus, Minus, MessageSquare, Quote } from "lucide-react"

export function SectionTechnologies() {
  const locale = useLocale()
  
  const techs = ["Next.js", "React", "FastAPI", "Supabase", "TypeScript", "OpenAI", "Tailwind CSS"]

  return (
    <section aria-label="Modern Technologies" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <SectionLabel className="mb-4">
            {locale === "ar" ? "بنيتنا البرمجية" : "Built With Modern Technologies"}
          </SectionLabel>
          <h2 className="text-h2 text-foreground mb-6">
            {locale === "ar" ? "تقنيات حديثة لمنتجات قوية" : "We build with stress-tested, modern tools"}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {locale === "ar"
              ? "نعتمد على أدوات هندسية متطورة لضمان سرعة التحميل، وتوفير أمان البيانات، وقابلية التوسع الفائقة."
              : "Leveraging state-of-the-art frameworks to deliver secure, responsive, and ultra-fast applications."}
          </p>
        </div>

        {/* Tech Badges Grid */}
        <div className="flex flex-wrap gap-4 items-center">
          {techs.map((tech, idx) => (
            <span 
              key={idx}
              className="px-6 py-3 border border-border/80 bg-card/40 backdrop-blur-sm text-foreground font-mono text-xs font-medium rounded-xl shadow-sm hover:border-primary/30 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>

      </div>
    </section>
  )
}



export function SectionFAQ() {
  const t = useTranslations("faq")
  const locale = useLocale()
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const faqKeys = ["timeline", "support", "integration"] as const

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section aria-label="FAQ" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <SectionLabel className="mb-4">
            {t("headline")}
          </SectionLabel>
          <h2 className="text-h2 text-foreground mb-6">
            {t("subheadline")}
          </h2>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqKeys.map((key, idx) => {
            const isOpen = openIdx === idx
            return (
              <div 
                key={idx}
                className="border border-border bg-card/20 rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 text-start font-medium text-sm sm:text-base flex items-center justify-between gap-4 text-foreground hover:bg-card/40 transition-colors"
                >
                  <span>{t(`items.${key}.question`)}</span>
                  {isOpen ? (
                    <Minus className="w-4 h-4 text-primary flex-shrink-0" />
                  ) : (
                    <Plus className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      {...collapseProps}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border pt-4 bg-card/10">
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
    </section>
  )
}
