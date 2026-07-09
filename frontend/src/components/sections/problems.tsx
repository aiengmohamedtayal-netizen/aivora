"use client"

import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { SectionLabel, Card, CardHeader, CardTitle, CardContent } from "@/components/ui"
import { fadeUp, staggerContainer } from "@/lib/motion"
import { ShieldCheck, Zap, Heart, Sparkles, Layout, Database, Check } from "lucide-react"

export function SectionWhyAivora() {
  const locale = useLocale()

  const benefits = [
    {
      title: locale === "ar" ? "حلول مخصصة بالكامل" : "100% Custom Solutions",
      desc: locale === "ar" 
        ? "لا نستخدم القوالب الجاهزة. كل سطر كود يتم تصميمه وكتابته خصيصاً ليناسب منطق عملك ويضمن الأداء الأمثل."
        : "We don't use templates. Every line of code is tailored to match your specific business goals and optimize performance.",
      icon: <Layout className="w-5 h-5" />
    },
    {
      title: locale === "ar" ? "سرعة ودقة الإطلاق" : "Rapid Delivery Cycles",
      desc: locale === "ar" 
        ? "نعتمد على منهجية عمل مرنة واختبارات جودة تلقائية تضمن تسليم المنتج الرقمي الخاص بك في أسرع وقت."
        : "Agile sprints coupled with automated quality gates ensure your digital product is deployed cleanly and ahead of schedule.",
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: locale === "ar" ? "تصميم وتجربة مستخدم عصرية" : "Premium UX & Design",
      desc: locale === "ar" 
        ? "نوفر واجهات مستخدم مذهلة بصرياً ومبنية على دراسة عميقة لسلوك المستخدم لتسهيل التفاعل وزيادة نسبة التحويل."
        : "Fluid motion design combined with modern visual layouts ensures your clients experience a premium, memorable journey.",
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      title: locale === "ar" ? "شراكة ودعم طويل الأجل" : "Long-Term Technical Support",
      desc: locale === "ar" 
        ? "لسنا مجرد مزود كود. نحن شريكك التقني المستمر لتحديث النظام وتوسيع خياراته وصيانته دورياً."
        : "We align with your product roadmap, offering continuous maintenance, security updates, and scalability optimizations.",
      icon: <Heart className="w-5 h-5" />
    },
    {
      title: locale === "ar" ? "بنية تحتية مرنة وقابلة للتوسع" : "Scalable Architecture",
      desc: locale === "ar" 
        ? "نبني بنية سحابية مرنة تدعم زيادة أعداد المستخدمين والطلبات المتزامنة دون توقف أو بطء في الأداء."
        : "Engineered with modern containerized microservices and highly optimized database backends designed to support high load.",
      icon: <Database className="w-5 h-5" />
    },
    {
      title: locale === "ar" ? "تفكير يركز على الذكاء الاصطناعي" : "AI-First Development",
      desc: locale === "ar" 
        ? "ندمج قدرات الذكاء الاصطناعي والأتمتة في قلب أنظمتك لتسهيل اتخاذ القرار وتحسين الإنتاجية التشغيلية."
        : "We embed autonomous agents and intelligent workflows directly into your platform to optimize productivity.",
      icon: <ShieldCheck className="w-5 h-5" />
    }
  ]

  return (
    <section aria-label="Why Choose Aivora" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <SectionLabel className="mb-4">
            {locale === "ar" ? "لماذا أيفورا؟" : "Why Choose Aivora"}
          </SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6">
            {locale === "ar" ? "الالتزام بالجودة والابتكار المستمر" : "Engineered for high performance and reliability"}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {locale === "ar"
              ? "نجمع بين جمالية التصميم وقوة البرمجة لنبني أنظمة رقمية تدعم نمو أعمالك وتحقق عوائد حقيقية للاستثمار."
              : "We integrate elite visual design with solid software engineering principles to deliver software that scales."}
          </p>
        </div>

        {/* Benefits Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((ben, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Card className="bg-card/30 backdrop-blur-md border-border/80 hover:border-primary/30 transition-all duration-300 h-full relative overflow-hidden group">
                <CardContent className="p-8">
                  <div className="p-2.5 bg-primary/5 text-primary rounded-lg w-fit mb-6 group-hover:scale-105 transition-transform">
                    {ben.icon}
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-3">{ben.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{ben.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

export function SectionCaseStudies() {
  const locale = useLocale()

  const projects = [
    {
      title: locale === "ar" ? "منصة التحليلات المالية ذكاء" : "Zakaa Financial Analytics",
      sub: locale === "ar" ? "لوحة تحكم ذكية مدعومة بالذكاء الاصطناعي" : "AI-powered real-time tracking dashboard",
      problem: locale === "ar" ? "البيانات المالية غير منظمة وتأخذ وقتاً طويلاً للتحليل اليدوي." : "Complex financial datasets required manual classification and resulted in slow decision loops.",
      solution: locale === "ar" ? "بناء نظام لوحات تحكم متقدم مع وكيل ذكاء اصطناعي يقوم بتصنيف المعاملات فورياً." : "Engineered an interactive analytics panel with autonomous routing and sub-second metrics processing.",
      result: locale === "ar" ? "✓ تسريع وقت اتخاذ القرار بنسبة 60% مع دقة تصنيف تتجاوز 98%." : "✓ Accelerated strategic decision cycles by 60% with verified 98%+ classification accuracy.",
      link: "#"
    },
    {
      title: locale === "ar" ? "نظام أتمتة سلاسل الإمداد" : "Apex Logistics Suite",
      sub: locale === "ar" ? "منصة إدارة لوجستية مؤتمتة بالكامل" : "Autonomous supply chain operations suite",
      problem: locale === "ar" ? "تأخير مستمر في تتبع الشحنات وتنسيق الطلبات وتحديث المخازن." : "Stateless inventory systems and manual scheduling caused shipment delays and high resource overhead.",
      solution: locale === "ar" ? "أتمتة كافة مراحل استلام ومعالجة الطلبات وربطها بأنظمة التتبع السحابية." : "Constructed event-driven pipelines automating scheduling, order allocation, and cloud monitoring.",
      result: locale === "ar" ? "✓ تقليل الأخطاء البشرية بنسبة 95% ومضاعفة الكفاءة التشغيلية للشحنات." : "✓ Eliminated 95% of human allocation errors and doubled operational throughput.",
      link: "#"
    }
  ]

  return (
    <section aria-label="Featured Projects" className="py-24 lg:py-32 bg-secondary/10 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <SectionLabel className="mb-4">
            {locale === "ar" ? "المشاريع المتميزة" : "Featured Projects"}
          </SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6">
            {locale === "ar" ? "أعمال تتحدث عن جودتها" : "Real-world business outcomes"}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {locale === "ar"
              ? "نصمم منتجات برمجية متكاملة تساعد الشركات على حل مشاكلها التقنية وتحقيق أهدافها التجارية."
              : "A curated showcase of custom software solutions demonstrating measurable business impact."}
          </p>
        </div>

        {/* Projects list */}
        <div className="flex flex-col gap-12">
          {projects.map((proj, i) => (
            <Card key={i} className="bg-card/40 border-border/80 overflow-hidden relative group hover:border-primary/20 transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Left side: Graphic mock placeholder */}
                <div className="lg:col-span-5 bg-gradient-to-br from-primary/10 to-transparent p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-e border-border/60 relative overflow-hidden min-h-[220px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05),transparent_70%)]" />
                  <div className="relative border border-border/80 bg-background/80 rounded-xl p-6 shadow-xl w-full max-w-xs font-mono text-[10px] space-y-4">
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="font-medium text-foreground uppercase tracking-wider">{proj.title}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    </div>
                    <div className="h-2 bg-muted rounded w-3/4" />
                    <div className="h-2 bg-muted rounded w-1/2" />
                    <div className="h-10 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between px-3 text-primary">
                      <span>METRIC_STATUS</span>
                      <span className="font-medium">ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Case details */}
                <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs text-primary uppercase tracking-widest block mb-2">{proj.sub}</span>
                    <h3 className="text-2xl font-medium tracking-tight text-foreground mb-6">{proj.title}</h3>
                    
                    <div className="space-y-6 text-sm mb-8">
                      <div>
                        <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                          {locale === "ar" ? "التحدي / المشكلة" : "Problem"}
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">{proj.problem}</p>
                      </div>
                      <div>
                        <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                          {locale === "ar" ? "الحل المبتكر" : "Solution"}
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">{proj.solution}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-primary font-mono text-xs font-medium bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-lg">
                      {proj.result}
                    </div>
                  </div>
                </div>

              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}
