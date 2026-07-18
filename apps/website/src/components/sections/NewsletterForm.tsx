"use client"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Input } from "@aivora/ui/Input"
import { Button } from "@aivora/ui/Button"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { z } from "zod"

export function NewsletterForm({ source = "footer" }: { source?: string }) {
  const t = useTranslations("footer")
  const v = useTranslations("validation")
  const locale = useLocale()

  const [email, setEmail] = useState("")
  const [honeypot, setHoneypot] = useState("") // Spam honeypot field
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
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: result.data, 
          locale, 
          source,
          honeypot // Bot protection field
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message || (locale === "ar" 
          ? "تم إرسال بريد تأكيد. يرجى تفعيل اشتراكك!" 
          : "Verification email sent. Please confirm!"))
        setEmail("")
      } else {
        setStatus("error")
        setMessage(data.error || (locale === "ar" ? "فشل الاشتراك." : "Subscription failed."))
      }
    } catch (err) {
      setStatus("error")
      setMessage(locale === "ar" ? "فشل الاتصال بالخادم." : "Could not connect to subscription server.")
    }
  }

  return (
    <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
      
      {/* Honeypot Spam Protection Field (visually hidden) */}
      <div className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden" aria-hidden="true">
        <input 
          type="text" 
          name="website_url_verify" 
          value={honeypot} 
          onChange={(e) => setHoneypot(e.target.value)} 
          tabIndex={-1} 
          autoComplete="off" 
        />
      </div>

      <div className="sm:flex sm:max-w-md w-full gap-4 items-end">
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
            className="h-[46px] min-w-[120px] rounded-xl cursor-pointer" 
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
      
      {/* Feedback Message with elegant status colors */}
      {message && (
        <div 
          id="newsletter-message" 
          className={`text-sm flex items-center gap-2 mt-1 font-medium transition-all ${
            status === "success" ? "text-emerald-400" : "text-red-400"
          }`}
          role="alert"
        >
          {status === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 animate-bounce" />
          )}
          <span>{message}</span>
        </div>
      )}
    </form>
  )
}
