"use client"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { z } from "zod"

export function NewsletterForm() {
  const t = useTranslations("footer")
  const v = useTranslations("validation")
  const locale = useLocale()

  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    // Client-side validation
    const emailSchema = z.string().trim().toLowerCase().email(v("email"))
    const result = emailSchema.safeParse(email)
    
    if (!result.success) {
      setStatus("error")
      setMessage(result.error.errors[0]?.message || "Invalid email")
      return
    }

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: result.data, locale }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(v("newsletterSuccess"))
        setEmail("")
      } else {
        setStatus("error")
        setMessage(data.error || v("newsletterError"))
      }
    } catch (err) {
      setStatus("error")
      setMessage(v("newsletterError"))
    }
  }

  return (
    <form className="mt-6 flex flex-col gap-3" onSubmit={handleSubmit}>
      <div className="sm:flex sm:max-w-md w-full gap-4">
        <div className="w-full relative">
          <Input 
            label={t("emailPlaceholder")}
            type="email" 
            autoComplete="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            className="w-full min-w-0"
            aria-invalid={status === "error"}
            aria-describedby={message ? "newsletter-message" : undefined}
          />
        </div>
        <div className="mt-4 sm:mt-0 sm:flex-shrink-0 flex items-end">
          <Button 
            type="submit" 
            variant="primary" 
            className="h-[46px] min-w-[120px]" 
            disabled={status === "loading" || status === "success"}
          >
            {status === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              t("primaryCTA")
            )}
          </Button>
        </div>
      </div>
      
      {/* Feedback Message */}
      {message && (
        <div 
          id="newsletter-message" 
          className={`text-sm flex items-center gap-2 ${
            status === "success" ? "text-emerald-500" : "text-destructive"
          }`}
          role="alert"
        >
          {status === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {message}
        </div>
      )}
    </form>
  )
}
