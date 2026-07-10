"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { useLocale } from "next-intl"
import { AnimatePresence, useReducedMotion } from "framer-motion"
import { MessageSquare, X } from "lucide-react"
import { cn } from "@aivora/lib/utils"
import { useChat } from "@aivora/hooks/useChat"
import { ChatDialog } from "./ChatDialog"

export function AivoraAssistant() {
  const locale = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)

  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const prefersReducedMotion = useReducedMotion()

  const dict = useMemo(() => ({
    en: {
      initMsg: "Hello, I'm Aivora's AI Business Consultant. How can I help accelerate your business today?",
      smartServicesMsg: "Would you like to discuss a specific project, or explore how Aivora can help your business?",
      unavailable: "Aivora AI is temporarily unavailable. Please try again shortly or reach out via our contact form.",
      charLimit: "Message limited to 2000 characters",
      placeholder: "Ask me about our services, projects, or pricing…",
      send: "Send message",
      thinking: "Thinking…",
      dropText: "Drop files to upload",
      pastedTag: "PASTED",
      voiceNotSupported: "Voice input is not supported in your browser.",
      botName: "Aivora AI",
      botSubtitle: "Business & Digital Product Consultant",
      chips: [
        { label: "🚀 Start a Project", query: "I'd like to start a project with Aivora." },
        { label: "💰 Request a Quote", query: "Can I get a quote for a project?" },
        { label: "📅 Book a Consultation", query: "I'd like to book a consultation call." },
        { label: "🌐 Explore Services", query: "What services does Aivora offer?" },
        { label: "🤖 Build AI Product", query: "I want to build an AI-powered product." },
        { label: "⚙ Business Automation", query: "How can Aivora help automate my business?" }
      ]
    },
    ar: {
      initMsg: "مرحباً، أنا مستشار الأعمال الرقمية من أيفورا. كيف يمكنني مساعدتك في تسريع نمو أعمالك اليوم؟",
      smartServicesMsg: "هل تود مناقشة مشروع معين، أم استكشاف كيف يمكن لأيفورا مساعدة أعمالك؟",
      unavailable: "أيفورا الذكي غير متاح حالياً. يرجى المحاولة مرة أخرى أو التواصل عبر نموذج الاتصال.",
      charLimit: "الرسالة محدودة بـ 2000 حرف",
      placeholder: "اسألني عن خدماتنا أو مشاريعنا أو الأسعار…",
      send: "إرسال الرسالة",
      thinking: "جاري التفكير…",
      dropText: "أفلت الملفات لرفعها",
      pastedTag: "ملصق",
      voiceNotSupported: "الإدخال الصوتي غير مدعوم في متصفحك.",
      botName: "أيفورا الذكي",
      botSubtitle: "مستشار الأعمال والمنتجات الرقمية",
      chips: [
        { label: "🚀 ابدأ مشروعك", query: "أريد بدء مشروع مع أيفورا." },
        { label: "💰 اطلب تسعيرة", query: "هل يمكنني الحصول على عرض سعر؟" },
        { label: "📅 احجز استشارة", query: "أريد حجز مكالمة استشارية." },
        { label: "🌐 استكشف خدماتنا", query: "ما الخدمات التي تقدمها أيفورا؟" },
        { label: "🤖 منتج بالذكاء الاصطناعي", query: "أريد بناء منتج مدعوم بالذكاء الاصطناعي." },
        { label: "⚙ أتمتة الأعمال", query: "كيف يمكن لأيفورا أتمتة عمليات أعمالي؟" }
      ]
    }
  }[locale === "ar" ? "ar" : "en"]), [locale])

  const chat = useChat(locale, dict)

  // Smart Welcome Scroll Trigger
  useEffect(() => {
    if (chat.healthStatus !== true) return
    const onScroll = () => {
      const el = document.getElementById("services")
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          chat.triggerWelcome()
        }
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.healthStatus, chat.triggerWelcome])

  // Focus Trapping and Escape listener for accessibility
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
        return
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex="0"]'
        )
        if (focusables.length === 0) return
        const first = focusables[0] as HTMLElement
        const last = focusables[focusables.length - 1] as HTMLElement
        if (e.shiftKey && document.activeElement === first) {
          last.focus()
          e.preventDefault()
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus()
          e.preventDefault()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    const textarea = textareaRef.current
    if (textarea) textarea.focus()
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 flex flex-col items-end",
      locale === "ar" && "right-auto left-6"
    )}>
      <AnimatePresence>
        {isOpen && (
          <ChatDialog
            chat={chat}
            locale={locale}
            dict={dict}
            setIsOpen={setIsOpen}
            scrollRef={scrollRef}
            textareaRef={textareaRef}
            fileInputRef={fileInputRef}
            dialogRef={dialogRef}
            prefersReducedMotion={!!prefersReducedMotion}
          />
        )}
      </AnimatePresence>

      <button
        onClick={() => {
          setIsOpen(!isOpen)
          setHasUnread(false)
        }}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={isOpen ? "Close Aivora Assistant" : "Open Aivora Assistant"}
        aria-expanded={isOpen}
      >
        {chat.healthStatus === null && (
          <span className="absolute inset-0 rounded-full border border-primary animate-ping opacity-25" aria-hidden="true" />
        )}
        {isOpen ? (
          <X className="w-6 h-6" aria-hidden="true" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6" aria-hidden="true" />
            {hasUnread && (
              <span
                className="absolute top-0 right-0 w-3.5 h-3.5 bg-destructive border-[2.5px] border-background rounded-full"
                aria-label="Unread message"
              />
            )}
          </>
        )}
      </button>
    </div>
  )
}
