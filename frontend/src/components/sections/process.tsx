"use client"

import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { SectionLabel, Card, CardContent } from "@/components/ui"
import { fadeUp, staggerContainer } from "@/lib/motion"
import { Compass, FileText, Palette, Terminal, Flame, ShieldAlert, Cpu, Code2, Eye, Network } from "lucide-react"

export function SectionProcess() {
  const t = useTranslations("HomePage.process")
  const locale = useLocale()

  const stepKeys = ["discover", "plan", "design", "develop", "launch", "support"] as const

  const getStepIcon = (key: typeof stepKeys[number]) => {
    switch (key) {
      case "discover": return <Compass className="w-5 h-5 text-primary" />
      case "plan": return <FileText className="w-5 h-5 text-primary" />
      case "design": return <Palette className="w-5 h-5 text-primary" />
      case "develop": return <Terminal className="w-5 h-5 text-primary" />
      case "launch": return <Flame className="w-5 h-5 text-primary" />
      case "support": return <ShieldAlert className="w-5 h-5 text-primary" />
    }
  }

  return (
    <section aria-label="Development Process" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <SectionLabel className="mb-4">
            {locale === "ar" ? "خطوات العمل" : "How We Work"}
          </SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Process Flow */}
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 start-0 w-full h-[1px] bg-border/40 z-0" />
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10"
          >
            {stepKeys.map((key, idx) => (
              <motion.div key={key} variants={fadeUp}>
                <Card className="bg-card/40 backdrop-blur-md border-border/80 hover:border-primary/30 transition-all duration-300 h-full relative group">
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span className="font-mono text-xs text-muted-foreground">0{idx + 1}</span>
                        <div className="p-1.5 bg-primary/5 rounded-lg text-primary">
                          {getStepIcon(key)}
                        </div>
                      </div>
                      <h3 className="font-medium text-foreground mb-3">{t(`steps.${key}.title`)}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{t(`steps.${key}.desc`)}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  )
}

export function SectionTeam() {
  const locale = useLocale()

  const members = [
    {
      role: locale === "ar" ? "مهندس ذكاء اصطناعي" : "AI Product Architect",
      skills: locale === "ar" ? "نماذج مخصصة، أتمتة" : "Custom models, automation",
      icon: <Cpu className="w-6 h-6 text-primary" />
    },
    {
      role: locale === "ar" ? "مهندس برمجيات أول" : "Senior Software Engineer",
      skills: locale === "ar" ? "بنى برمجية، أداء فائق" : "System architecture, high load",
      icon: <Code2 className="w-6 h-6 text-primary" />
    },
    {
      role: locale === "ar" ? "مهندس واجهات ومصمم" : "Lead UI/UX Designer",
      skills: locale === "ar" ? "رسوم حركية، تميز بصري" : "Premium layout, motion system",
      icon: <Eye className="w-6 h-6 text-primary" />
    },
    {
      role: locale === "ar" ? "مهندس بنية خلفية" : "Backend & Cloud Engineer",
      skills: locale === "ar" ? "قواعد بيانات سحابية، مزامنة" : "Supabase, serverless, RLS",
      icon: <Network className="w-6 h-6 text-primary" />
    }
  ]

  return (
    <section aria-label="Meet The Team" className="py-24 lg:py-32 bg-secondary/20 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionLabel className="mb-4">
            {locale === "ar" ? "فريق عمل أيفورا" : "Meet The Team"}
          </SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6">
            {locale === "ar" ? "مهندسون ومصممون يركزون على الأعمال" : "Engineers & designers focused on your growth"}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {locale === "ar"
              ? "نعمل معاً كفريق هندسي وتصميم متكامل لتحويل الأفكار المعقدة إلى منتجات قابلة للاستخدام الفوري."
              : "We collaborate as a focused engineering studio to build premium digital products."}
          </p>
        </div>

        {/* Team Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {members.map((member, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Card className="bg-card/40 backdrop-blur-md border-border/80 hover:border-primary/20 transition-all duration-300 text-center relative overflow-hidden group h-full">
                <CardContent className="p-8 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    {member.icon}
                  </div>
                  <h3 className="font-medium text-foreground mb-2">{member.role}</h3>
                  <span className="text-xs text-muted-foreground font-mono">{member.skills}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
