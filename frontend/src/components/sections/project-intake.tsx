"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { fadeUp } from "@/lib/motion"
import { GlassCard } from "@/components/ui/GlassCard"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Check } from "lucide-react"

// Types
type FormData = {
  projectType: string
  industry: string
  currentSituation: string
  desiredOutcome: string
  aiIntegration: string
  expectedUsers: string
  requiredIntegrations: string
  timeline: string
  budget: string
  name: string
  email: string
  contactMethod: string
}

const initialData: FormData = {
  projectType: "",
  industry: "",
  currentSituation: "",
  desiredOutcome: "",
  aiIntegration: "",
  expectedUsers: "",
  requiredIntegrations: "",
  timeline: "",
  budget: "",
  name: "",
  email: "",
  contactMethod: "",
}

const TOTAL_STEPS = 5

export function ProjectIntake() {
  const t = useTranslations("intake-portal")
  
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load from local storage
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("aivora-discovery")
    if (saved) {
      try {
        setFormData(JSON.parse(saved))
      } catch (e) {
        // ignore
      }
    }
  }, [])

  // Save to local storage
  useEffect(() => {
    if (mounted && !isSuccess) {
      localStorage.setItem("aivora-discovery", JSON.stringify(formData))
    }
  }, [formData, mounted, isSuccess])

  const handleNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS + 1))
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1))

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      
      const message = `
Project Type: ${formData.projectType}
Industry: ${formData.industry}
Current Situation: ${formData.currentSituation}
Desired Outcome: ${formData.desiredOutcome}
AI Integration: ${formData.aiIntegration}
Expected Users: ${formData.expectedUsers}
Required Integrations: ${formData.requiredIntegrations}
Timeline: ${formData.timeline}
Budget: ${formData.budget}
Contact Method: ${formData.contactMethod}
      `.trim()

      const { error } = await supabase.from('leads').insert({
        name: formData.name || 'Anonymous',
        email: formData.email,
        company: formData.industry,
        message: message.length >= 10 ? message : 'Insufficient details provided.'
      })

      if (error) throw error

      setIsSuccess(true)
      localStorage.removeItem("aivora-discovery")
    } catch (error) {
      console.error("Failed to submit intake form:", error)
      // Fallback/Silent error for UX gracefully handled by a toast in a full implementation.
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) return null

  // Success Experience
  if (isSuccess) {
    return (
      <section className="py-24 lg:py-32 min-h-[80vh] flex items-center justify-center bg-background px-4">
        <GlassCard className="max-w-2xl w-full p-8 lg:p-12 text-center flex flex-col gap-8 border-s-4 border-primary">
          <div className="flex flex-col gap-4 items-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Check size={32} strokeWidth={2} />
            </div>
            <h2 className="text-h2 font-bold">{t("actions.successTitle")}</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              {t("actions.successMessage")}
            </p>
          </div>
          
          <div className="bg-background/50 border border-border/50 rounded-2xl p-6 text-start mt-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-6 text-center">
              Engagement Protocol
            </h3>
            <ul className="flex flex-col gap-4 relative">
              <div className="absolute top-4 bottom-4 start-4 w-px bg-border/50" />
              {[1, 2, 3, 4, 5].map((s, i) => (
                <li key={s} className="flex items-center gap-4 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono
                    ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border border-border"}
                  `}>
                    0{s}
                  </div>
                  <span className={`text-sm ${i === 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                    {t(`actions.successFlow.step${s}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>
      </section>
    )
  }

  return (
    <section className="py-24 lg:py-32 bg-background relative min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        
        {/* Header & Progress */}
        <header className="flex flex-col gap-6">
          <div>
            <SectionLabel>{t("title")}</SectionLabel>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
            {step <= TOTAL_STEPS ? t(`steps.${getStepKey(step)}.title`) : t("steps.review.title")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {step <= TOTAL_STEPS ? t(`steps.${getStepKey(step)}.description`) : t("steps.review.description")}
          </p>

          <div className="flex gap-2 mt-4">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div 
                key={i} 
                className={`h-1 flex-1 rounded-full transition-colors duration-500
                  ${i + 1 < step ? "bg-primary" : i + 1 === step ? "bg-primary/50" : "bg-border"}
                `} 
              />
            ))}
          </div>
        </header>

        {/* Form Area */}
        <form 
          className="relative"
          onSubmit={(e) => { e.preventDefault(); if (step > TOTAL_STEPS) handleSubmit(); }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8"
            >
              {renderStep(step, formData, handleChange, t)}
            </motion.div>
          </AnimatePresence>
        </form>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-border/50">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1 || isSubmitting}
            className="text-muted-foreground hover:text-foreground font-medium disabled:opacity-0 transition-opacity"
          >
            {t("actions.prev")}
          </button>
          
          {step <= TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              {t("actions.next")}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? t("actions.submitting") : t("actions.submit")}
            </button>
          )}
        </div>

      </div>
    </section>
  )
}

function getStepKey(step: number): string {
  switch(step) {
    case 1: return "discovery"
    case 2: return "business"
    case 3: return "technical"
    case 4: return "delivery"
    case 5: return "partnership"
    default: return "discovery"
  }
}

// -----------------------------------------------------------------------------
// Step Renderers
// -----------------------------------------------------------------------------

function renderStep(step: number, data: FormData, onChange: (k: keyof FormData, v: string) => void, t: any) {
  
  const InputGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <label className="flex flex-col gap-3 cursor-pointer group">
      <span className="text-sm font-mono uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">{label}</span>
      {children}
    </label>
  )

  const Input = ({ field, type = "text" }: { field: keyof FormData, type?: string }) => (
    <input 
      type={type}
      value={data[field]}
      onChange={(e) => onChange(field, e.target.value)}
      placeholder={t(`fields.${field}.placeholder`)}
      className="bg-transparent border-b border-border/50 focus:border-primary pb-4 outline-none text-lg text-foreground placeholder:text-muted-foreground/50 transition-colors rounded-none"
    />
  )
  
  const Select = ({ field }: { field: keyof FormData }) => {
    const opts = t.raw(`fields.${field}.options`)
    return (
      <select 
        value={data[field]}
        onChange={(e) => onChange(field, e.target.value)}
        className="bg-transparent border-b border-border/50 focus:border-primary pb-4 outline-none text-lg text-foreground transition-colors appearance-none rounded-none cursor-pointer"
      >
        <option value="" disabled>{t(`fields.${field}.placeholder`)}</option>
        {Object.entries(opts).map(([k, v]) => (
          <option key={k} value={k} className="bg-background text-foreground">{v as string}</option>
        ))}
      </select>
    )
  }

  const Textarea = ({ field }: { field: keyof FormData }) => (
    <textarea 
      value={data[field]}
      onChange={(e) => onChange(field, e.target.value)}
      placeholder={t(`fields.${field}.placeholder`)}
      rows={4}
      className="bg-transparent border border-border/50 focus:border-primary p-4 outline-none text-lg text-foreground placeholder:text-muted-foreground/50 transition-colors rounded-xl resize-none"
    />
  )

  switch (step) {
    case 1:
      return (
        <>
          <InputGroup label={t("fields.projectType.label")}><Select field="projectType" /></InputGroup>
          <InputGroup label={t("fields.industry.label")}><Input field="industry" /></InputGroup>
        </>
      )
    case 2:
      return (
        <>
          <InputGroup label={t("fields.currentSituation.label")}><Textarea field="currentSituation" /></InputGroup>
          <InputGroup label={t("fields.desiredOutcome.label")}><Textarea field="desiredOutcome" /></InputGroup>
        </>
      )
    case 3:
      return (
        <>
          <InputGroup label={t("fields.aiIntegration.label")}><Select field="aiIntegration" /></InputGroup>
          <InputGroup label={t("fields.expectedUsers.label")}><Input field="expectedUsers" /></InputGroup>
          <InputGroup label={t("fields.requiredIntegrations.label")}><Input field="requiredIntegrations" /></InputGroup>
        </>
      )
    case 4:
      return (
        <>
          <InputGroup label={t("fields.timeline.label")}><Select field="timeline" /></InputGroup>
          <InputGroup label={t("fields.budget.label")}><Select field="budget" /></InputGroup>
        </>
      )
    case 5:
      return (
        <>
          <InputGroup label={t("fields.name.label")}><Input field="name" /></InputGroup>
          <InputGroup label={t("fields.email.label")}><Input field="email" type="email" /></InputGroup>
          <InputGroup label={t("fields.contactMethod.label")}><Select field="contactMethod" /></InputGroup>
        </>
      )
    case 6:
      // Review Step
      return (
        <GlassCard className="p-8 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <span className="block text-xs font-mono text-muted-foreground mb-1">{t("fields.projectType.label")}</span>
              <span className="text-sm">{data.projectType || "—"}</span>
            </div>
            <div>
              <span className="block text-xs font-mono text-muted-foreground mb-1">{t("fields.industry.label")}</span>
              <span className="text-sm">{data.industry || "—"}</span>
            </div>
            <div className="col-span-2">
              <span className="block text-xs font-mono text-muted-foreground mb-1">{t("fields.desiredOutcome.label")}</span>
              <span className="text-sm">{data.desiredOutcome || "—"}</span>
            </div>
            <div>
              <span className="block text-xs font-mono text-muted-foreground mb-1">{t("fields.budget.label")}</span>
              <span className="text-sm">{data.budget || "—"}</span>
            </div>
            <div>
              <span className="block text-xs font-mono text-muted-foreground mb-1">{t("fields.email.label")}</span>
              <span className="text-sm">{data.email || "—"}</span>
            </div>
          </div>
        </GlassCard>
      )
    default:
      return null
  }
}
