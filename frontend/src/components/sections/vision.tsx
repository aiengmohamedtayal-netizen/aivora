"use client"

import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { SectionLabel, Card, CardHeader, CardTitle, CardContent } from "@/components/ui"
import { fadeUp, staggerContainer } from "@/lib/motion"
import { Brain, Rocket, Cpu, TrendingUp, HeartPulse, GraduationCap, ShoppingBag, Factory, Building, Compass } from "lucide-react"

export function SectionServices() {
  const t = useTranslations("HomePage.services")
  const locale = useLocale()

  const serviceKeys = ["aiProducts", "launchFaster", "automateOps", "scaleBusiness"] as const
  
  const getIcon = (key: typeof serviceKeys[number]) => {
    switch (key) {
      case "aiProducts": return <Brain className="w-8 h-8 text-primary" />
      case "launchFaster": return <Rocket className="w-8 h-8 text-primary" />
      case "automateOps": return <Cpu className="w-8 h-8 text-primary" />
      case "scaleBusiness": return <TrendingUp className="w-8 h-8 text-primary" />
    }
  }

  return (
    <section aria-label="Services" className="py-24 lg:py-32 bg-secondary/20 relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-16">
          <SectionLabel className="mb-4">{locale === "ar" ? "خدماتنا" : "Our Services"}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground mb-6">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-8"
        >
          {serviceKeys.map((key) => (
            <motion.div key={key} variants={fadeUp}>
              <Card className="bg-card/40 backdrop-blur-md border-border/80 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group h-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="p-8">
                  <div className="mb-6 p-3 bg-primary/5 rounded-xl w-fit group-hover:scale-105 transition-transform duration-300">
                    {getIcon(key)}
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tight mb-4">
                    {t(`list.${key}.title`)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`list.${key}.desc`)}
                  </p>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export function SectionIndustries() {
  const locale = useLocale()

  const industries = [
    { name: locale === "ar" ? "الرعاية الصحية" : "Healthcare", icon: <HeartPulse className="w-5 h-5" /> },
    { name: locale === "ar" ? "التعليم والتدريب" : "Education", icon: <GraduationCap className="w-5 h-5" /> },
    { name: locale === "ar" ? "التجارة والتجزئة" : "Retail", icon: <ShoppingBag className="w-5 h-5" /> },
    { name: locale === "ar" ? "التصنيع والخدمات" : "Manufacturing", icon: <Factory className="w-5 h-5" /> },
    { name: locale === "ar" ? "الشركات الناشئة" : "Startups", icon: <Rocket className="w-5 h-5" /> },
    { name: locale === "ar" ? "العقارات والمقاولات" : "Real Estate", icon: <Building className="w-5 h-5" /> }
  ]

  return (
    <section aria-label="Industries We Serve" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute right-0 top-1/2 w-[350px] h-[350px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionLabel className="mb-4">
            {locale === "ar" ? "المجالات التي نخدمها" : "Industries We Serve"}
          </SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground mb-6">
            {locale === "ar" ? "خبرة قطاعية لحل التحديات التشغيلية" : "Deep expertise across diverse industries"}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {locale === "ar"
              ? "نصمم حلول برمجية ووكلاء ذكاء اصطناعي تلبي المتطلبات الفريدة لكل قطاع من الرعاية الصحية للتجارة الإلكترونية."
              : "We construct custom software tailored to the operational demands and regulatory environments of key industries."}
          </p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 gap-6"
        >
          {industries.map((ind, i) => (
            <motion.div key={i} variants={fadeUp}>
              <div className="border border-border/80 bg-card/30 backdrop-blur-sm p-6 rounded-xl flex items-center gap-4 hover:border-primary/30 transition-all duration-300 group">
                <div className="p-2.5 bg-primary/5 rounded-lg text-primary group-hover:scale-105 transition-transform">
                  {ind.icon}
                </div>
                <span className="font-mono text-xs font-bold text-foreground">
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
