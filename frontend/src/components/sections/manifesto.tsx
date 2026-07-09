"use client"

import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { fadeUp, staggerContainer } from "@/lib/motion"
import { SectionLabel, Card, Button } from "@/components/ui"
import { HeroComposition } from "@/components/common/hero-composition"
import { ClaudeChatInput } from "@/components/common/ClaudeChatInput"
import { AnalyticsWorkspace } from "@/components/common/AnalyticsWorkspace"
import { ArrowRight, Globe, Layers, ArrowDown, Send, MessageSquare, BarChart3, Users, KanbanSquare, Monitor } from "lucide-react"
import { useState, useEffect } from "react"

export function SectionManifesto() {
  const t = useTranslations("HomePage.hero")
  const locale = useLocale()

  return (
    <section 
      aria-label="Manifesto" 
      className="relative min-h-[90vh] flex flex-col justify-center py-20 lg:py-28 overflow-hidden bg-background"
    >
      {/* Premium Tech Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Layered ambient top spotlights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 flex flex-col items-start text-start z-20"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel className="mb-6 flex items-center gap-2 px-3.5 py-1.5 bg-muted/30 border border-border/80 text-foreground text-xs font-mono font-bold uppercase tracking-wider rounded-full shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {t("welcome")}
              </SectionLabel>
            </motion.div>
            
            <motion.h1 
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-[62px] font-display font-black tracking-tight text-foreground leading-[1.05] mb-6 text-balance"
            >
              {t("title")}
            </motion.h1>
            
            <motion.p 
              variants={fadeUp}
              className="text-lg sm:text-xl text-muted-foreground/90 max-w-xl mb-10 leading-relaxed text-balance font-medium"
            >
              {t("description")}
            </motion.p>
            
            <motion.div 
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              <a 
                href="#intake" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-foreground text-background font-sans text-[15px] font-bold rounded-xl shadow-md hover:bg-foreground/90 transition-all duration-300 group"
              >
                {t("ctaPrimary")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </a>
              <Link 
                href="/case-studies" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border/80 bg-card/30 backdrop-blur-md text-foreground font-sans text-[15px] font-bold rounded-xl hover:bg-muted/50 hover:border-foreground/40 transition-all duration-300"
              >
                {t("ctaSecondary")}
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Right Column: Premium Hero Composition */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-7 flex justify-center lg:justify-end w-full"
          >
            <HeroComposition />
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export function SectionTrustedBy() {
  const locale = useLocale()
  const text = locale === "ar" ? "شراكة ممتدة مع مؤسسي الشركات الطموحة" : "Partnering with ambitious founders and businesses"

  return (
    <section aria-label="Social Proof" className="py-12 border-y border-border/50 bg-muted/10 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest text-center lg:text-start">
            {text}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-40 font-display font-bold text-sm tracking-tight text-muted-foreground">
            <span>VERCEL_STUDIO</span>
            <span>SUPABASE_RLS</span>
            <span>OPENAI_PARTNERS</span>
            <span>NEXTJS_ENTERPRISE</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function SectionShowcase() {
  const locale = useLocale()
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (locale === "ar") {
      setMessages([
        { role: "assistant", text: "أهلاً بك! كيف يمكنني مساعدتك اليوم في تحسين عملياتك الرقمية؟" }
      ])
    } else {
      setMessages([
        { role: "assistant", text: "Welcome! How can I assist you in optimizing your digital operations today?" }
      ])
    }
  }, [locale])

  const handleClaudeSend = async (data: any) => {
    if ((!data.message.trim() && data.files.length === 0 && data.pastedContent.length === 0) || isLoading) return
    const userMsg = data.message || "Attached files/content"
    setMessages((prev) => [...prev, { role: "user", text: userMsg }])
    setIsLoading(true)

    try {
      const res = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMsg, session_id: "showcase-preview-session" })
      })

      if (!res.ok) throw new Error("Network response was not ok")
      
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      
      setMessages((prev) => [...prev, { role: "assistant", text: "" }])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          setMessages((prev) => {
            const newMessages = [...prev]
            const lastMsg = newMessages[newMessages.length - 1]
            if (lastMsg) lastMsg.text += chunk
            return newMessages
          })
        }
      }
    } catch (error) {
      console.error(error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: locale === "ar" ? "حدث خطأ في الاتصال بالذكاء الاصطناعي." : "Error connecting to AI." }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section aria-label="Product Showcase" className="py-24 lg:py-32 bg-muted/20 relative overflow-hidden border-t border-border/40">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground mb-6 text-balance">
            {locale === "ar" ? "منتجات مصممة للأداء المطلق" : "Products engineered for absolute performance."}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-balance">
            {locale === "ar" 
              ? "نصمم واجهات عصرية وأنظمة ذكية تفاعلية تمنح عملاءك تجربة استخدام متميزة." 
              : "We construct high-fidelity interactive platforms demonstrating AI chat engines, CRM pipelines, and enterprise analytics panels."}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[600px] items-stretch">
          
          {/* Main Card: AI Agent Chat */}
          <div className="lg:col-span-8 border border-border/80 bg-card/60 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/5 relative flex flex-col overflow-hidden h-[500px] lg:h-full transition-transform duration-500 hover:shadow-2xl hover:-translate-y-1">
            {/* macOS title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-background/50">
              <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-gold/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="mx-auto text-xs font-semibold text-muted-foreground flex items-center gap-1.5 opacity-80">
                <MessageSquare className="w-3.5 h-3.5" />
                {locale === "ar" ? "مساعد أيفورا الذكي" : "Aivora AI Agent"}
              </span>
            </div>
            
            <div className="flex flex-col flex-1 p-6 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-4 font-sans text-sm pe-4 mb-4 scrollbar-thin">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-3.5 rounded-2xl max-w-[85%] leading-relaxed shadow-sm",
                      msg.role === "user"
                        ? "bg-foreground text-background ms-auto rounded-se-sm"
                        : "bg-muted/50 border border-border/50 text-foreground rounded-ss-sm"
                    )}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
              <div className="mt-auto">
                <ClaudeChatInput 
                  onSendMessage={handleClaudeSend} 
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Right Column Stack */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full">
            
            {/* Top Right: Analytics */}
            <div className="flex-1 border border-border/80 bg-card/60 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/5 relative overflow-hidden flex flex-col min-h-[280px] transition-transform duration-500 hover:shadow-2xl hover:-translate-y-1">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-background/50 z-10 relative">
                <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                <span className="mx-auto text-xs font-semibold text-muted-foreground flex items-center gap-1.5 opacity-80">
                  <BarChart3 className="w-3.5 h-3.5" />
                  {locale === "ar" ? "لوحة تحكم التحليلات" : "Analytics Dashboard"}
                </span>
              </div>
              <div className="flex-1 overflow-hidden relative bg-background/20">
                <div className="absolute inset-[-15px] sm:inset-[-5px] lg:inset-[-25px] scale-[0.80] sm:scale-95 lg:scale-[0.70] origin-top pointer-events-none">
                  <AnalyticsWorkspace />
                </div>
              </div>
            </div>

            {/* Bottom Right: CRM */}
            <div className="flex-1 border border-border/80 bg-card/60 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/5 relative overflow-hidden flex flex-col min-h-[280px] transition-transform duration-500 hover:shadow-2xl hover:-translate-y-1">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-background/50">
                <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                <span className="mx-auto text-xs font-semibold text-muted-foreground flex items-center gap-1.5 opacity-80">
                  <KanbanSquare className="w-3.5 h-3.5" />
                  {locale === "ar" ? "إدارة الصفقات" : "Pipeline CRM"}
                </span>
              </div>
              <div className="flex-1 p-5 bg-background/20 overflow-hidden pointer-events-none">
                <div className="grid grid-cols-2 gap-4 h-full">
                  {[
                    {
                      title: locale === "ar" ? "قيد الدراسة" : "In Progress",
                      leads: ["OpenAI Setup", "Vercel Migration"]
                    },
                    {
                      title: locale === "ar" ? "مكتملة" : "Completed",
                      leads: ["Supabase Auth"]
                    }
                  ].map((col, idx) => (
                    <div key={idx} className="border border-border/60 bg-card/50 rounded-xl p-3 flex flex-col gap-2 font-sans text-xs shadow-sm">
                      <div className="flex items-center justify-between border-b border-border/30 pb-2">
                        <span className="font-bold text-foreground/90">{col.title}</span>
                        <span className="px-1.5 py-0.5 rounded bg-muted/80 text-[10px] text-muted-foreground">
                          {col.leads.length}
                        </span>
                      </div>
                      <div className="space-y-2 flex-1 overflow-y-auto scrollbar-none mt-1">
                        {col.leads.map((lead, lIdx) => (
                          <div key={lIdx} className="p-2.5 rounded-lg border border-border/40 bg-background/80 shadow-sm">
                            <span className="block font-semibold text-[11px] truncate">{lead}</span>
                            <span className="text-[9px] text-muted-foreground block mt-1">USD $12,500</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
