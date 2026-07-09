"use client"

import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { fadeUp, staggerContainer } from "@/lib/motion"
import { SectionLabel, Card, Button } from "@/components/ui"
import { Waves } from "@/components/ui/wave-background"
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
      {/* Animated wave background — sits at z-0, fully behind content */}
      <Waves
        className="pointer-events-none"
        strokeColor="rgba(99,102,241,0.18)"
        backgroundColor="transparent"
        opacity={0.7}
        pointerSize={0.4}
      />

      {/* Background radial spotlights & aurora meshes */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-4 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 flex flex-col items-start text-start z-20"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel className="mb-6 flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full">
                <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                {t("welcome")}
              </SectionLabel>
            </motion.div>
            
            <motion.h1 
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground leading-[1.1] mb-6"
            >
              {t("title")}
            </motion.h1>
            
            <motion.p 
              variants={fadeUp}
              className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              {t("description")}
            </motion.p>
            
            <motion.div 
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              <a 
                href="#intake" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-mono text-sm font-bold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/95 hover:shadow-primary/35 transition-all duration-300 group"
              >
                {t("ctaPrimary")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </a>
              <Link 
                href="/intelligence" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border/80 bg-card/40 backdrop-blur-md text-foreground font-mono text-sm font-bold rounded-xl hover:bg-muted/50 hover:border-foreground/20 transition-all duration-300"
              >
                {t("ctaSecondary")}
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Right Column: Premium Hero Composition */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
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
  const [activeTab, setActiveTab] = useState<"chat" | "crm" | "analytics" | "web">("chat")
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([])
  const [inputText, setInputText] = useState("")

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

  const [isLoading, setIsLoading] = useState(false)

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
    <section aria-label="Product Showcase" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionLabel className="mb-4">
            {locale === "ar" ? "معرض أعمالنا التفاعلي" : "Interactive Product Showcase"}
          </SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground mb-6">
            {locale === "ar" ? "شاهد جودة ومستوى الأنظمة الرقمية التي نبنيها" : "Experience the quality of the products we engineer"}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {locale === "ar" 
              ? "نصمم واجهات عصرية وأنظمة ذكية تفاعلية تمنح عملاءك تجربة استخدام متميزة." 
              : "We construct high-fidelity interactive previews demonstrating CRM pipelines, AI chats, and responsive panels."}
          </p>
        </div>

        {/* Carousel / Tab selection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Tabs selector */}
          <div className="lg:col-span-3 flex flex-col gap-3 justify-center">
            <button
              onClick={() => setActiveTab("chat")}
              className={cn(
                "p-4 rounded-xl border font-sans text-xs font-bold text-start flex items-center gap-3 transition-all duration-300",
                activeTab === "chat"
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border/60 bg-card/40 text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              )}
            >
              <MessageSquare className="w-4 h-4 text-primary" />
              <div>
                <span className="block">{locale === "ar" ? "وكيل دردشة ذكي" : "AI Agent Chat"}</span>
                <span className="text-[10px] font-normal text-muted-foreground mt-0.5 block">
                  {locale === "ar" ? "مساعد أعمال تفاعلي" : "Interactive business agent"}
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("crm")}
              className={cn(
                "p-4 rounded-xl border font-sans text-xs font-bold text-start flex items-center gap-3 transition-all duration-300",
                activeTab === "crm"
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border/60 bg-card/40 text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              )}
            >
              <KanbanSquare className="w-4 h-4 text-primary" />
              <div>
                <span className="block">{locale === "ar" ? "خط أنابيب مبيعات CRM" : "CRM Sales Pipeline"}</span>
                <span className="text-[10px] font-normal text-muted-foreground mt-0.5 block">
                  {locale === "ar" ? "أتمتة وإدارة صفقات" : "Deals pipeline & automation"}
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={cn(
                "p-4 rounded-xl border font-sans text-xs font-bold text-start flex items-center gap-3 transition-all duration-300",
                activeTab === "analytics"
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border/60 bg-card/40 text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              )}
            >
              <BarChart3 className="w-4 h-4 text-primary" />
              <div>
                <span className="block">{locale === "ar" ? "لوحة تحكم التحليلات" : "Analytics Dashboard"}</span>
                <span className="text-[10px] font-normal text-muted-foreground mt-0.5 block">
                  {locale === "ar" ? "تحليلات أعمال متقدمة" : "Enterprise business analytics"}
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("web")}
              className={cn(
                "p-4 rounded-xl border font-sans text-xs font-bold text-start flex items-center gap-3 transition-all duration-300",
                activeTab === "web"
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border/60 bg-card/40 text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              )}
            >
              <Monitor className="w-4 h-4 text-primary" />
              <div>
                <span className="block">{locale === "ar" ? "تطوير الويب" : "Web Development"}</span>
                <span className="text-[10px] font-normal text-muted-foreground mt-0.5 block">
                  {locale === "ar" ? "منصات حديثة متجاوبة" : "Modern responsive platforms"}
                </span>
              </div>
            </button>
          </div>

          {/* Interactive display area */}
          <div className="lg:col-span-9 border border-border/80 bg-card/30 backdrop-blur-md rounded-2xl p-6 shadow-xl relative min-h-[360px] flex flex-col justify-between">
            <div className="absolute top-3 start-4 flex gap-1.5 pointer-events-none">
              <span className="w-2.5 h-2.5 rounded-full bg-destructive/30" />
              <span className="w-2.5 h-2.5 rounded-full bg-gold/30" />
              <span className="w-2.5 h-2.5 rounded-full bg-primary/30" />
            </div>

            <div className="mt-4 flex-1">
              <AnimatePresence mode="wait">
                
                {/* 1. Chat Interface */}
                {activeTab === "chat" && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="flex flex-col h-[320px] justify-between"
                  >
                    <div className="flex-1 overflow-y-auto space-y-3 font-sans text-xs pe-2">
                      {messages.map((msg, i) => (
                        <div
                          key={i}
                          className={cn(
                            "p-3 rounded-xl max-w-[80%] leading-relaxed",
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground ms-auto"
                              : "bg-muted/40 border border-border/50 text-foreground"
                          )}
                        >
                          {msg.text}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <ClaudeChatInput 
                        onSendMessage={handleClaudeSend} 
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>
                )}

                {/* 2. CRM pipeline */}
                {activeTab === "crm" && (
                  <motion.div
                    key="crm"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="grid grid-cols-3 gap-4 h-[300px]"
                  >
                    {[
                      {
                        title: locale === "ar" ? "قائمة الانتظار" : "Inbox",
                        leads: ["Vercel Deal", "Stripe Integration"]
                      },
                      {
                        title: locale === "ar" ? "قيد الدراسة" : "In Progress",
                        leads: ["OpenAI AI Setup"]
                      },
                      {
                        title: locale === "ar" ? "مكتملة" : "Completed",
                        leads: ["Supabase Launch", "Framer Redesign"]
                      }
                    ].map((col, idx) => (
                      <div key={idx} className="border border-border/50 bg-background/40 rounded-xl p-3 flex flex-col gap-3 font-sans text-xs">
                        <div className="flex items-center justify-between border-b border-border/30 pb-2">
                          <span className="font-bold text-foreground">{col.title}</span>
                          <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">
                            {col.leads.length}
                          </span>
                        </div>
                        <div className="space-y-2 flex-1 overflow-y-auto">
                          {col.leads.map((lead, lIdx) => (
                            <div key={lIdx} className="p-2.5 rounded-lg border border-border/60 bg-card/60 hover:border-primary/45 transition-colors">
                              <span className="block font-bold">{lead}</span>
                              <span className="text-[10px] text-muted-foreground block mt-1">USD $12,500</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* 3. Analytics Dashboard */}
                {activeTab === "analytics" && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="w-full h-full"
                  >
                    <AnalyticsWorkspace />
                  </motion.div>
                )}

                {/* 4. Web Development */}
                {activeTab === "web" && (
                  <motion.div
                    key="web"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="w-full h-full border border-border/50 bg-background/40 rounded-xl overflow-hidden font-mono text-xs flex flex-col"
                  >
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-border/30 bg-muted/20">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                        <span className="w-2.5 h-2.5 rounded-full bg-gold/60" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                      </div>
                      <span className="ml-2 text-muted-foreground">app/page.tsx</span>
                    </div>
                    <div className="p-4 flex-1 text-muted-foreground overflow-y-auto">
                      <div className="text-primary/70">export default function <span className="text-foreground">Home</span>() {"{"}</div>
                      <div className="pl-4">return (</div>
                      <div className="pl-8 text-gold/80">&lt;main className=<span className="text-green-500/80">&quot;flex min-h-screen flex-col items-center p-24&quot;</span>&gt;</div>
                      <div className="pl-12 text-primary/70">&lt;HeroSection /&gt;</div>
                      <div className="pl-12 text-primary/70">&lt;FeatureGrid /&gt;</div>
                      <div className="pl-12 text-primary/70">&lt;InteractiveShowcase /&gt;</div>
                      <div className="pl-8 text-gold/80">&lt;/main&gt;</div>
                      <div className="pl-4">)</div>
                      <div>{"}"}</div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
