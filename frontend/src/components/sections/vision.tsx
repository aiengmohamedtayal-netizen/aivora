"use client"

import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { SectionLabel, Card, CardHeader, CardTitle, CardContent } from "@/components/ui"
import { fadeUp, staggerContainer, viewport } from "@/lib/motion"
import { Brain, Rocket, Cpu, TrendingUp, HeartPulse, GraduationCap, ShoppingBag, Factory, Building, Compass, ArrowRight } from "lucide-react"

export function SectionServices() {
  const t = useTranslations("services")
  const locale = useLocale()

  const serviceKeys = ["aiProducts", "customPlatform", "dataIntegration", "cloudScaling"] as const
  
  const getIcon = (key: typeof serviceKeys[number]) => {
    switch (key) {
      case "aiProducts": return <Brain className="w-8 h-8 text-primary" />
      case "customPlatform": return <Rocket className="w-8 h-8 text-primary" />
      case "dataIntegration": return <Cpu className="w-8 h-8 text-primary" />
      case "cloudScaling": return <TrendingUp className="w-8 h-8 text-primary" />
    }
  }

  return (
    <section aria-label="Studio Capabilities" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background ultra-subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-16 mx-auto text-center">
          <SectionLabel className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-muted/40 border border-border/50 text-foreground text-xs font-medium rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {t("headline")}
          </SectionLabel>
          <h2 className="text-h1 text-foreground mb-6 text-balance">
            {t("subheadline")}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-balance">
            {t("supportingText")}
          </p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport.default}
          className="grid lg:grid-cols-2 gap-8"
        >
          {serviceKeys.map((key) => (
            <motion.div key={key} variants={fadeUp} className="h-full">
              <Card className="group relative overflow-hidden bg-card/30 backdrop-blur-xl border border-border/60 hover:border-border/90 transition-all duration-500 h-full flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1">
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <CardHeader className="p-8 pb-4 relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3.5 bg-primary/10 text-primary rounded-xl ring-1 ring-primary/20 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                      {getIcon(key)}
                    </div>
                  </div>
                  
                  <CardTitle className="text-h3 text-foreground mb-3">
                    {t(`items.${key}.title`)}
                  </CardTitle>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">
                    {t(`items.${key}.description`)}
                  </p>
                </CardHeader>

                <CardContent className="p-8 pt-4 flex-1 flex flex-col relative z-10">
                  <div className="space-y-5 flex-1 border-t border-border/50 pt-6 mt-2">
                    <div>
                      <h4 className="text-[11px] font-medium text-destructive/80 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive/60" /> 
                        {locale === "ar" ? "المشكلة" : "Problem"}
                      </h4>
                      <p className="text-sm text-muted-foreground/90 leading-relaxed font-medium">{t(`items.${key}.problem`)}</p>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-medium text-green-500/80 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" /> 
                        {locale === "ar" ? "الحل" : "Solution"}
                      </h4>
                      <p className="text-sm text-foreground/90 leading-relaxed font-medium">{t(`items.${key}.solution`)}</p>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-medium text-gold/80 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold/60" /> 
                        {locale === "ar" ? "النتائج" : "Business Outcome"}
                      </h4>
                      <p className="text-sm text-muted-foreground/90 leading-relaxed font-medium">{t(`items.${key}.result`)}</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
                    <a href="#intake" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors group/cta">
                      {locale === "ar" ? "استكشف الخدمة" : "Explore Service"}
                      <ArrowRight className="w-4 h-4 ms-1.5 transition-transform group-hover/cta:translate-x-1 rtl:rotate-180 rtl:group-hover/cta:-translate-x-1" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export function SectionIndustries() {
  const t = useTranslations("industries")
  const locale = useLocale()

  const industries = [
    { name: t("items.healthcare"), icon: <HeartPulse className="w-5 h-5" /> },
    { name: t("items.education"), icon: <GraduationCap className="w-5 h-5" /> },
    { name: t("items.retail"), icon: <ShoppingBag className="w-5 h-5" /> },
    { name: t("items.manufacturing"), icon: <Factory className="w-5 h-5" /> },
    { name: t("items.startups"), icon: <Rocket className="w-5 h-5" /> },
    { name: t("items.realestate"), icon: <Building className="w-5 h-5" /> }
  ]

  return (
    <section aria-label="Industries We Serve" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute right-0 top-1/2 w-[350px] h-[350px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionLabel className="mb-4">
            {t("headline")}
          </SectionLabel>
          <h2 className="text-h2 text-foreground mb-6">
            {t("subheadline")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("supportingText")}
          </p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport.default}
          className="grid grid-cols-2 md:grid-cols-3 gap-6"
        >
          {industries.map((ind, i) => (
            <motion.div key={i} variants={fadeUp}>
              <div className="border border-border/80 bg-card/30 backdrop-blur-sm p-6 rounded-xl flex items-center gap-4 hover:border-primary/30 transition-all duration-300 group">
                <div className="p-2.5 bg-primary/5 rounded-lg text-primary group-hover:scale-105 transition-transform">
                  {ind.icon}
                </div>
                <span className="font-mono text-xs font-medium text-foreground">
                  {ind.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
