"use client"

import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { SectionLabel, Card, CardContent } from "@/components/ui"
import { fadeUp, staggerContainer } from "@/lib/motion"
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
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6">
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

export function SectionTestimonials() {
  const locale = useLocale()

  const reviews = [
    {
      quote: locale === "ar" 
        ? "نجحت أيفورا في تحويل فكرتنا المعقدة إلى تطبيق ذكاء اصطناعي تفاعلي خلال فترة زمنية قياسية. دعمهم التقني وتواصلهم مذهل."
        : "Aivora transformed our complex workflow into a fully automated AI portal in record time. Their support and execution are second to none.",
      author: locale === "ar" ? "عبد الله العتيبي" : "Faisal Al-Dosari",
      role: locale === "ar" ? "مؤسس تقني، ريادة" : "Co-Founder, Reyadah Inc",
      company: "REYADAH"
    },
    {
      quote: locale === "ar"
        ? "سرعة تحميل الموقع وجودة تصميمه فاقت توقعاتنا بالكامل. زادت نسبة التحويل لعملائنا بشكل ملموس فور إطلاق المنصة."
        : "The platform's performance and design exceeded all our expectations. Conversion rates jumped immediately after launch.",
      author: locale === "ar" ? "سارة الهاشمي" : "Sarah Al-Hashimi",
      role: locale === "ar" ? "مديرة العمليات، إي كوم" : "Operations Director, E-Com Hub",
      company: "E-COM HUB"
    }
  ]

  return (
    <section aria-label="Testimonials" className="py-24 lg:py-32 bg-secondary/20 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <SectionLabel className="mb-4">
            {locale === "ar" ? "آراء العملاء" : "Client Testimonials"}
          </SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6">
            {locale === "ar" ? "ماذا يقول شركاؤنا عن جودة أعمالنا؟" : "What our clients say about our partnership"}
          </h2>
        </div>

        {/* Reviews Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-8"
        >
          {reviews.map((rev, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Card className="bg-card/40 backdrop-blur-md border-border/80 p-8 rounded-2xl relative h-full flex flex-col justify-between hover:border-primary/20 transition-all duration-300">
                <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
                <div>
                  <p className="text-muted-foreground text-base leading-relaxed mb-8 italic">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-6 border-t border-border/50 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground text-sm">{rev.author}</h3>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">{rev.role}</span>
                  </div>
                  <span className="font-mono text-xs font-medium text-primary bg-primary/5 px-2.5 py-1 rounded">
                    {rev.company}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

export function SectionFAQ() {
  const locale = useLocale()
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const faqs = [
    {
      q: locale === "ar" ? "ما هي المدة الزمنية المعتادة للمشاريع؟" : "What is Aivora's typical project timeline?",
      a: locale === "ar"
        ? "تتراوح المدة الزمنية لبناء وإطلاق النماذج الأولية والتطبيقات من 4 إلى 8 أسابيع، بناءً على حجم المتطلبات ونوع الأتمتة المطلوبة."
        : "Standard digital product development ranges from 4 to 8 weeks, depending on requirements complexity and AI agent depth."
    },
    {
      q: locale === "ar" ? "هل تقدمون دعماً ومتابعة بعد إطلاق المشروع؟" : "Do you offer post-launch support?",
      a: locale === "ar"
        ? "نعم، نقدم عقود دعم فني شهرية تشمل مراقبة الأداء، سد الثغرات، والتحديثات البرمجية الدورية لضمان استمرارية المنصة."
        : "Absolutely. We offer support cycles covering cloud performance, database scaling, API maintenance, and regular optimization updates."
    },
    {
      q: locale === "ar" ? "هل يمكنكم ربط النظام بقواعد البيانات الحالية لدينا؟" : "Can you integrate with our existing databases?",
      a: locale === "ar"
        ? "بكل تأكيد. نصمم حلولنا لتتكامل بسلاسة مع نظم إدارة قواعد البيانات الحالية وواجهات برمجة التطبيقات (APIs) المختلفة لشركتك."
        : "Yes. Our applications are engineered to connect smoothly with your legacy database servers, ERP modules, and external APIs."
    }
  ]

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section aria-label="FAQ" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <SectionLabel className="mb-4">
            {locale === "ar" ? "الأسئلة الشائعة" : "Common Questions"}
          </SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6">
            {locale === "ar" ? "إجابات على استفساراتك" : "Answers to your queries"}
          </h2>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div 
                key={idx}
                className="border border-border/85 bg-card/20 rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 text-start font-medium text-sm sm:text-base flex items-center justify-between gap-4 text-foreground hover:bg-card/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <Minus className="w-4 h-4 text-primary flex-shrink-0" />
                  ) : (
                    <Plus className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4 bg-card/10">
                        {faq.a}
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
