"use client"

import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { SectionLabel, Card, CardHeader, CardTitle, CardContent } from "@/components/ui"
import { fadeUp, staggerContainer, viewport } from "@/lib/motion"
import { ShieldCheck, Zap, Heart, Sparkles, Layout, Database, Check } from "lucide-react"

export function SectionWhyAivora() {
  const t = useTranslations("about")
  const locale = useLocale()

  const benefits = [
    {
      key: "custom",
      icon: <Layout className="w-5 h-5" />
    },
    {
      key: "delivery",
      icon: <Zap className="w-5 h-5" />
    },
    {
      key: "ux",
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      key: "support",
      icon: <Heart className="w-5 h-5" />
    },
    {
      key: "scale",
      icon: <Database className="w-5 h-5" />
    },
    {
      key: "ai",
      icon: <ShieldCheck className="w-5 h-5" />
    }
  ] as const

  return (
    <section aria-label="Why Choose Aivora" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <SectionLabel className="mb-4">
            {t("headline")}
          </SectionLabel>
          <h2 className="text-h2 text-foreground mb-6">
            {t("subheadline")}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("supportingText")}
          </p>
        </div>

        {/* Benefits Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport.default}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((ben, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Card className="bg-card/30 backdrop-blur-md border-border hover:border-primary/30 transition-all duration-300 h-full relative overflow-hidden group">
                <CardContent className="p-8">
                  <div className="p-2.5 bg-primary/5 text-primary rounded-lg w-fit mb-6 group-hover:scale-105 transition-transform">
                    {ben.icon}
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-3">{t(`items.${ben.key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(`items.${ben.key}.description`)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}


