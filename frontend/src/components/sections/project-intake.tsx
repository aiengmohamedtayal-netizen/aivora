"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { fadeUp } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/Button"
import { Check, ArrowRight, ArrowLeft } from "lucide-react"

type FormData = {
  type: string
  audience: string
  stage: string
  timeline: string
  budget: string
  description: string
  name: string
  email: string
  company: string
  phone: string
}

const initialData: FormData = {
  type: "",
  audience: "",
  stage: "",
  timeline: "",
  budget: "",
  description: "",
  name: "",
  email: "",
  company: "",
  phone: "",
}

const TOTAL_QUESTIONS = 7

export function ProjectIntake() {
  const t = useTranslations("intake-portal")
  
  // 0 = Intro, 1-6 = Wizard, 7 = Success
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("aivora-wizard")
    if (saved) {
      try {
        setFormData(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (mounted && step < 8) {
      localStorage.setItem("aivora-wizard", JSON.stringify(formData))
    }
  }, [formData, mounted, step])

  const handleNext = () => setStep((s) => Math.min(s + 1, 8))
  const handlePrev = () => setStep((s) => Math.max(s - 1, 0))

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Auto-advance for cards if we want to, but standard explicitly clicks Next.
  const handleSelectOption = (field: string, value: string) => {
    handleChange(field as keyof FormData, value)
    setTimeout(() => {
      handleNext()
    }, 300)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      
      const message = `
Project Type: ${t(`wizard.questions.type.options.${formData.type}` as any) || formData.type}
Target Audience: ${t(`wizard.questions.audience.options.${formData.audience}` as any) || formData.audience}
Stage: ${t(`wizard.questions.stage.options.${formData.stage}` as any) || formData.stage}
Timeline: ${t(`wizard.questions.timeline.options.${formData.timeline}` as any) || formData.timeline}
Budget: ${t(`wizard.questions.budget.options.${formData.budget}` as any) || formData.budget}
Description: ${formData.description}
Phone: ${formData.phone}
      `.trim()

      const { error } = await supabase.from('leads').insert({
        name: formData.name || 'Anonymous',
        email: formData.email,
        company: formData.company,
        message: message.length >= 10 ? message : 'Insufficient details provided.'
      })

      if (error) throw error

      setStep(8)
      localStorage.removeItem("aivora-wizard")
    } catch (error) {
      console.error("Failed to submit:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) return null

  // ---------------------------------------------------------------------------
  // Step 0: Hero & How it Works
  // ---------------------------------------------------------------------------
  if (step === 0) {
    return (
      <section className="py-24 lg:py-32 bg-background relative min-h-screen">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10 flex flex-col items-center text-center pb-24">
          <div className="max-w-3xl flex flex-col items-center gap-6 mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
              {t("hero.headline")}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t("hero.description")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
              {t.raw("hero.benefits").map((b: string, i: number) => (
                <span key={i} className="flex items-center gap-2 text-sm font-medium text-foreground bg-primary/10 px-4 py-2 rounded-full">
                  <Check className="w-4 h-4 text-primary" /> {b}
                </span>
              ))}
            </div>
            <Button size="lg" onClick={handleNext} className="mt-8 text-lg px-8 h-14 rounded-full">
              {t("hero.cta")} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <div className="w-full mt-12">
            <h2 className="text-2xl font-bold mb-12 text-foreground">{t("howItWorks.title")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-start">
              {t.raw("howItWorks.steps").map((s: any, i: number) => (
                <div key={i} className="bg-card border border-border p-8 rounded-3xl relative overflow-hidden group hover:border-primary/50 transition-colors">
                  <div className="text-5xl font-bold text-primary/10 mb-4">{s.id}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{s.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // ---------------------------------------------------------------------------
  // Step 8: Premium Success Screen
  // ---------------------------------------------------------------------------
  if (step === 8) {
    return (
      <section className="py-24 lg:py-32 min-h-screen flex items-center justify-center bg-background px-4">
        <GlassCard className="max-w-2xl w-full p-12 text-center flex flex-col gap-8 border border-primary/20">
          <div className="flex flex-col gap-4 items-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 ring-8 ring-primary/5">
              <Check size={40} strokeWidth={2} />
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">{t("success.title")}</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              {t("success.description")} <br/> {t("success.timeline")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button className="w-full sm:w-auto h-12 px-8 rounded-full">
              {t("success.ctaCall")}
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full sm:w-auto h-12 px-8 rounded-full">
              {t("success.ctaHome")}
            </Button>
          </div>
        </GlassCard>
      </section>
    )
  }

  // ---------------------------------------------------------------------------
  // Wizard (Steps 1-7)
  // ---------------------------------------------------------------------------
  const currentQIndex = step - 1
  const questions = ["type", "audience", "stage", "timeline", "budget", "description", "contact"] as const
  const currentQuestion = questions[currentQIndex as 0|1|2|3|4|5|6]
  
  const progressText = t("wizard.progressText").replace("{current}", String(step)).replace("{total}", String(TOTAL_QUESTIONS))
  const estimatedTime = t("wizard.estimatedTime").replace("{time}", String(Math.ceil((TOTAL_QUESTIONS - step + 1) * 0.5)))
  const progressPercent = (step / TOTAL_QUESTIONS) * 100

  // Smart Suggestions
  let smartSuggestions: string[] = []
  if (formData.type === "ai") smartSuggestions = ["LLM Integration", "RAG", "Vector Database"]
  if (formData.type === "saas") smartSuggestions = ["Authentication", "Billing", "Dashboard"]

  const renderQuestionOptions = () => {
    if (currentQuestion === "description") {
      return (
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder={t("wizard.questions.description.placeholder")}
          rows={6}
          className="w-full bg-card border border-border focus:border-primary p-6 outline-none text-xl text-foreground placeholder:text-muted-foreground/50 transition-colors rounded-2xl resize-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      )
    }

    if (currentQuestion === "contact") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder={t("wizard.questions.contact.fields.name")}
            required
            className="w-full bg-card border border-border focus:border-primary p-6 outline-none text-lg text-foreground placeholder:text-muted-foreground transition-colors rounded-2xl focus-visible:ring-2 focus-visible:ring-ring"
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder={t("wizard.questions.contact.fields.email")}
            required
            className="w-full bg-card border border-border focus:border-primary p-6 outline-none text-lg text-foreground placeholder:text-muted-foreground transition-colors rounded-2xl focus-visible:ring-2 focus-visible:ring-ring"
          />
          <input
            type="text"
            value={formData.company}
            onChange={(e) => handleChange("company", e.target.value)}
            placeholder={t("wizard.questions.contact.fields.company")}
            required
            className="w-full bg-card border border-border focus:border-primary p-6 outline-none text-lg text-foreground placeholder:text-muted-foreground transition-colors rounded-2xl focus-visible:ring-2 focus-visible:ring-ring"
          />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder={t("wizard.questions.contact.fields.phone")}
            className="w-full bg-card border border-border focus:border-primary p-6 outline-none text-lg text-foreground placeholder:text-muted-foreground transition-colors rounded-2xl focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      )
    }

    // Card Selections
    const options = t.raw(`wizard.questions.${currentQuestion}.options`)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(options).map(([k, v]) => (
          <button
            key={k}
            type="button"
            onClick={() => handleSelectOption(currentQuestion, k)}
            className={cn(
              "p-6 md:p-8 rounded-2xl border text-start transition-all hover:shadow-md",
              (formData as any)[currentQuestion] === k 
                ? "bg-primary/10 border-primary text-primary" 
                : "bg-card border-border hover:border-primary/50 text-foreground"
            )}
          >
            <span className="text-lg md:text-xl font-medium">{v as string}</span>
          </button>
        ))}
      </div>
    )
  }

  const isCurrentStepValid = () => {
    if (currentQuestion === "description") return formData.description.trim().length > 0
    if (currentQuestion === "contact") return formData.name && formData.email && formData.company
    return !!(formData as any)[currentQuestion]
  }

  return (
    <section className="min-h-screen bg-background flex flex-col pb-24">
      {/* Top Progress Bar */}
      <div className="fixed top-16 lg:top-24 left-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl py-4 flex items-center justify-between text-sm font-mono text-muted-foreground">
          <span>{progressText}</span>
          <span>{estimatedTime}</span>
        </div>
        <div className="h-1 w-full bg-muted">
          <div className="h-full bg-primary transition-all duration-500 ease-in-out" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pt-40 lg:pt-48 flex-1 flex flex-col">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 7) handleNext();
            else handleSubmit();
          }}
          className="flex-1 flex flex-col"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
                  {t(`wizard.questions.${currentQuestion}.title`)}
                </h2>
                
                <div className="inline-block px-4 py-2 rounded-xl bg-muted/50 border border-border/50 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Why we ask: </span>
                  {t(`wizard.whyAsk.${currentQuestion}`)}
                </div>

                {smartSuggestions.length > 0 && currentQuestion === "audience" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/20">
                    <span className="text-sm font-medium text-primary mb-3 block">Suggested architecture based on your project type:</span>
                    <div className="flex flex-wrap gap-2">
                      {smartSuggestions.map(s => (
                        <span key={s} className="px-3 py-1.5 rounded-full bg-background border border-primary/20 text-sm text-foreground flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-primary" /> {s}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {currentQuestion === "contact" && (
                <div className="mb-12 p-8 rounded-3xl bg-card border border-border">
                  <h3 className="text-lg font-semibold mb-6 text-foreground">{t("wizard.trust.title")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {t.raw("wizard.trust.points").map((p: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-foreground">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="w-full">
                {renderQuestionOptions()}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-12 mt-auto">
            <Button
              type="button"
              variant="ghost"
              onClick={handlePrev}
              className="text-muted-foreground hover:text-foreground font-medium rounded-full px-6 h-12"
            >
              <ArrowLeft className="mr-2 w-4 h-4" /> {t("wizard.actions.prev")}
            </Button>
            
            {step < 7 ? (
              <Button
                type="submit"
                disabled={!isCurrentStepValid()}
                className="h-12 px-8 rounded-full shadow-md shadow-primary/20"
              >
                {t("wizard.actions.next")} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || !isCurrentStepValid()}
                loading={isSubmitting}
                className="h-12 px-8 rounded-full shadow-md shadow-primary/20"
              >
                {t("wizard.actions.submit")} <Check className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
