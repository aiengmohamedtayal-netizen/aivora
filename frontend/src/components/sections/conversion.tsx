"use client"

import { useState, useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { SectionLabel, Card, Button } from "@/components/ui"
import { fadeUp } from "@/lib/motion"
import { Check, Mail, Instagram, Globe, Clock, ShieldCheck, HeartHandshake, ArrowRight, Phone } from "lucide-react"

export function SectionConversion() {
  const t = useTranslations("contact")
  const locale = useLocale()

  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [projectType, setProjectType] = useState("")
  const [budget, setBudget] = useState("")
  const [message, setMessage] = useState("")

  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    startTransition(async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()

        const messageDetail = `
Project Type: ${projectType || 'N/A'}
Budget: ${budget || 'N/A'}
Phone: ${phone || 'N/A'}
Message: ${message}
        `.trim()

        const { error } = await supabase.from('leads').insert({
          name: name || 'Anonymous',
          email: email,
          company: company || 'N/A',
          message: messageDetail
        })

        if (error) throw error

        // Send email via API route
        await fetch('/next-api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name, email, company, projectType, budget, phone, message
          })
        })

        setIsSuccess(true)
        setName("")
        setCompany("")
        setEmail("")
        setPhone("")
        setProjectType("")
        setBudget("")
        setMessage("")
      } catch (err) {
        console.error("Failed to submit lead in conversion section:", err)
      }
    })
  }

  return (
    <section id="intake" aria-label="Contact" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background spotlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Headline and Direct Contacts */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div>
              <SectionLabel className="mb-4">{locale === "ar" ? "تواصل معنا" : "Let's Talk"}</SectionLabel>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15] whitespace-pre-line mb-6">
                {t("headline")}
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                {t("supportingText")}
              </p>
            </div>

            {/* Direct Connect Card */}
            <Card className="bg-card/40 backdrop-blur-md border-border/80 p-6 rounded-2xl flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-2">
                {t("directContact")}
              </span>
              <div className="flex flex-col gap-3.5 text-xs sm:text-sm font-mono">
                <a href={`mailto:${t("email")}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{t("email")}</span>
                </a>
                <a href="https://www.instagram.com/aiivoraa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="w-4 h-4 text-primary" />
                  <span>{t("igHandle")}</span>
                </a>
                <a href={t("website")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Globe className="w-4 h-4 text-primary" />
                  <span>{t("website").replace("https://", "")}</span>
                </a>
              </div>
            </Card>

            {/* Dedicated Instagram QR Card */}
            <a 
              href="https://www.instagram.com/aiivoraa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="border border-border/80 bg-card/20 hover:border-primary/30 rounded-2xl p-6 flex items-center gap-6 group transition-all duration-300 shadow-md relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {/* QR Code Container */}
              <div className="w-[100px] h-[100px] bg-white rounded-xl p-1.5 flex items-center justify-center border border-border/80 group-hover:scale-102 transition-transform duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <Image 
                  src="/qr-code.jpg" 
                  alt="Aivora Instagram QR Code" 
                  width={88}
                  height={88}
                  className="object-contain rounded"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <span className="font-mono text-xs font-medium text-foreground flex items-center gap-2">
                  <Instagram className="w-3.5 h-3.5 text-primary" />
                  {t("igHandle")}
                </span>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-normal max-w-[200px]">
                  {t("instagram")}
                </p>
                <span className="text-[10px] font-mono font-medium text-primary group-hover:underline flex items-center gap-1 mt-1">
                  {t("igFollow")}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform rtl:rotate-180" />
                </span>
              </div>
            </a>
          </div>

          {/* Right Column: Contact Intake Form */}
          <div className="lg:col-span-7">
            <Card className="bg-card/40 backdrop-blur-md border-border/80 p-8 rounded-2xl shadow-xl relative">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center text-center py-12"
                  >
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                      <Check className="w-6 h-6" strokeWidth={3} />
                    </div>
                    <h3 className="text-xl font-medium text-foreground mb-3">{t("successTitle")}</h3>
                    <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                      {t("successMsg")}
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                          {t("form.fullName")}
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-background/50 border border-border/80 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-primary transition-colors text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                          {t("form.companyName")}
                        </label>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full bg-background/50 border border-border/80 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-primary transition-colors text-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                          {t("form.email")}
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-background/50 border border-border/80 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-primary transition-colors text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                          {t("form.phone")}
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-background/50 border border-border/80 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-primary transition-colors text-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                          {t("form.projectType")}
                        </label>
                        <select
                          required
                          value={projectType}
                          onChange={(e) => setProjectType(e.target.value)}
                          className="w-full bg-background/50 border border-border/80 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-primary transition-colors text-foreground appearance-none"
                        >
                          <option value="" disabled className="text-muted-foreground">{t("form.projectTypePlaceholder")}</option>
                          {t.raw("types").map((type: string, i: number) => (
                            <option key={i} value={type} className="bg-card text-foreground">{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                          {t("form.budget")}
                        </label>
                        <select
                          required
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="w-full bg-background/50 border border-border/80 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-primary transition-colors text-foreground appearance-none"
                        >
                          <option value="" disabled className="text-muted-foreground">{t("form.budgetPlaceholder")}</option>
                          {t.raw("budgets").map((b: string, i: number) => (
                            <option key={i} value={b} className="bg-card text-foreground">{b}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                        {t("form.details")}
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-background/50 border border-border/80 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-primary transition-colors text-foreground resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full py-4 text-xs font-mono font-medium tracking-wider uppercase text-center flex items-center justify-center gap-2"
                    >
                      {isPending ? (locale === "ar" ? "جاري الإرسال..." : "Submitting...") : t("form.submit")}
                      {!isPending && <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />}
                    </Button>

                    {/* Trust Indicators */}
                    <div className="pt-6 border-t border-border/40 flex flex-col gap-3 font-mono text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>{t("helpers.response")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HeartHandshake className="w-3.5 h-3.5 text-primary" />
                        <span>{t("helpers.consultation")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        <span>{t("helpers.secure")}</span>
                      </div>
                    </div>

                  </motion.form>
                )}
              </AnimatePresence>
            </Card>
          </div>

        </div>
      </div>
    </section>
  )
}
