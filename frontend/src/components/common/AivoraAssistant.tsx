"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  ChevronDown, 
  ArrowUp, 
  X, 
  FileText, 
  Loader2,
  Archive, 
  MessageSquare,
  Bot,
  Brain,
  Mic,
  MicOff,
  Download,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// ─── SpeechRecognition type (not universally in TS DOM lib) ────────────────────
interface SpeechRecognitionInstance {
  continuous: boolean
  interimResults: boolean
  lang: string
  onstart: (() => void) | null
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const SESSION_STORAGE_KEY = "aivora_chat_session_id"
const MAX_QUERY_LENGTH = 2000
const HEALTH_TIMEOUT_MS = 3000
const NEAR_BOTTOM_THRESHOLD_PX = 120

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  role: "user" | "assistant"
  text: string
  timestamp: string
  files?: AttachedFile[]
  pastedContent?: PastedSnippet[]
  isError?: boolean
}

interface AttachedFile {
  id: string
  file: File
  type: string
  preview: string | null
  uploadStatus: "pending" | "uploading" | "complete"
}

interface PastedSnippet {
  id: string
  content: string
  timestamp: Date
}

// ─── Memoized Markdown Renderer ────────────────────────────────────────────────
const MemoizedMarkdown = React.memo(function MemoizedMarkdown({ content }: { content: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/20 prose-pre:border prose-pre:border-white/10">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
})

// ─── Utils ─────────────────────────────────────────────────────────────────────
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function getOrCreateSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (existing) return existing
    const newId = crypto.randomUUID()
    sessionStorage.setItem(SESSION_STORAGE_KEY, newId)
    return newId
  } catch {
    // sessionStorage unavailable (e.g., private mode restrictions)
    return crypto.randomUUID()
  }
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function AivoraAssistant() {
  const locale = useLocale()

  // ── UI State ──
  const [isOpen, setIsOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)

  // ── Chat State ──
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // ── Health State ──
  // null = checking, true = ok, false = unavailable, "degraded" = show widget but warn
  const [healthStatus, setHealthStatus] = useState<null | true | "degraded">(null)

  // ── Input extras ──
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [pastedSnippets, setPastedSnippets] = useState<PastedSnippet[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isThinkingEnabled, setIsThinkingEnabled] = useState(false)
  const [voiceUnsupported, setVoiceUnsupported] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [inlineNotice, setInlineNotice] = useState<string | null>(null)

  // ── Refs ──
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const welcomeTriggered = useRef(false)
  const sessionIdRef = useRef<string | null>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const objectUrlsRef = useRef<Set<string>>(new Set())

  // ─── Localised copy (memoised) ─────────────────────────────────────────────
  const dict = useMemo(() => ({
    en: {
      botName: "Aivora AI",
      botSubtitle: "Business & Digital Product Consultant",
      initMsg: "Hello, I'm Aivora's AI Business Consultant. How can I help accelerate your business today?",
      smartServicesMsg: "Would you like to discuss a specific project, or explore how Aivora can help your business?",
      unavailable: "Aivora AI is temporarily unavailable. Please try again shortly or reach out via our contact form.",
      placeholder: "Ask me about our services, projects, or pricing…",
      send: "Send message",
      thinking: "Thinking…",
      dropText: "Drop files to upload",
      pastedTag: "PASTED",
      charLimit: `Message limited to ${MAX_QUERY_LENGTH} characters`,
      voiceNotSupported: "Voice input is not supported in your browser.",
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
      botName: "أيفورا الذكي",
      botSubtitle: "مستشار الأعمال والمنتجات الرقمية",
      initMsg: "مرحباً، أنا مستشار الأعمال الرقمية من أيفورا. كيف يمكنني مساعدتك في تسريع نمو أعمالك اليوم؟",
      smartServicesMsg: "هل تود مناقشة مشروع معين، أم استكشاف كيف يمكن لأيفورا مساعدة أعمالك؟",
      unavailable: "أيفورا الذكي غير متاح حالياً. يرجى المحاولة مرة أخرى أو التواصل عبر نموذج الاتصال.",
      placeholder: "اسألني عن خدماتنا أو مشاريعنا أو الأسعار…",
      send: "إرسال الرسالة",
      thinking: "جاري التفكير…",
      dropText: "أفلت الملفات لرفعها",
      pastedTag: "ملصق",
      charLimit: `الرسالة محدودة بـ ${MAX_QUERY_LENGTH} حرف`,
      voiceNotSupported: "الإدخال الصوتي غير مدعوم في متصفحك.",
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

  // ─── Session ID ────────────────────────────────────────────────────────────
  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId()
  }, [])

  useEffect(() => {
    type SpeechRecognitionCtor = new () => SpeechRecognitionInstance
    const SR: SpeechRecognitionCtor | undefined =
      (window as unknown as Record<string, unknown>)["SpeechRecognition"] as SpeechRecognitionCtor | undefined
      ?? (window as unknown as Record<string, unknown>)["webkitSpeechRecognition"] as SpeechRecognitionCtor | undefined

    if (!SR) {
      setVoiceUnsupported(true)
      return
    }
    const rec = new SR()
    rec.continuous = false
    rec.interimResults = false
    rec.onstart = () => setIsRecording(true)
    rec.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript
      if (transcript) setMessageText(prev => prev + " " + transcript)
    }
    rec.onerror = () => setIsRecording(false)
    rec.onend = () => setIsRecording(false)
    recognitionRef.current = rec
  }, [])

  // ─── Health Check & History Hydration ───────────────────────────────────────
  useEffect(() => {
    async function init() {
      // 1. Health check
      try {
        const res = await fetch("/api/v1/health", {
          signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS)
        })
        if (!res.ok) throw new Error("Health check failed")
        setHealthStatus(true)
      } catch {
        setHealthStatus("degraded")
        return // Skip history if backend is down
      }

      // 2. Fetch History (H-05)
      try {
        setIsLoadingHistory(true)
        const sid = sessionIdRef.current
        if (sid) {
          const histRes = await fetch(`/api/v1/ai/sessions/${sid}/messages`)
          if (histRes.ok) {
            const data = await histRes.json()
            if (data.messages && data.messages.length > 0) {
              // Convert backend format to frontend Message format
              const formattedHistory = data.messages.map((m: any) => {
                // If timestamp is ISO string, format it for UI
                let timeStr = ""
                try {
                  timeStr = new Date(m.timestamp).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
                } catch {
                  timeStr = ""
                }
                return {
                  role: m.role,
                  text: m.text,
                  timestamp: timeStr
                }
              })
              setMessages(formattedHistory)
              return // Return early so we don't append the default welcome msg
            }
          }
        }
      } catch (err) {
        console.error("Failed to load history", err)
      } finally {
        setIsLoadingHistory(false)
      }

      // 3. Fallback Welcome Message (if no history)
      setMessages([{
        role: "assistant",
        text: dict.initMsg,
        timestamp: new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
      }])
    }

    init()
  }, [dict.initMsg, locale])

  // ─── Degraded Fallback Message ─────────────────────────────────────────────
  useEffect(() => {
    if (healthStatus === "degraded" && messages.length === 0) {
      setMessages([{
        role: "assistant",
        text: dict.unavailable,
        timestamp: new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
        isError: true
      }])
    }
  }, [healthStatus, dict.unavailable, locale, messages.length])

  // ─── Smart Welcome (30s timer / scroll trigger) ───────────────────────────
  useEffect(() => {
    if (healthStatus !== true) return

    const fire = () => {
      if (welcomeTriggered.current) return
      // Only fire if conversation is still at welcome state and panel is closed
      if (messages.length > 1 || isOpen) return
      welcomeTriggered.current = true
      setMessages(prev => [...prev, {
        role: "assistant",
        text: dict.smartServicesMsg,
        timestamp: new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
      }])
      setHasUnread(true)
    }

    const timer = setTimeout(fire, 30000)
    const onScroll = () => {
      const el = document.getElementById("services")
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom >= 0) fire()
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => { clearTimeout(timer); window.removeEventListener("scroll", onScroll) }
  }, [healthStatus, dict.smartServicesMsg, locale, messages.length, isOpen])

  // ─── Auto-resize textarea ─────────────────────────────────────────────────
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px"
    }
  }, [messageText])

  // ─── Smart auto-scroll (only if near bottom) ─────────────────────────────
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_THRESHOLD_PX
    if (isNearBottom) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages, streamingText])

  // ─── Close dropdown on outside click ─────────────────────────────────────
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        // (dropdown removed — kept ref for future use)
      }
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [])

  // ─── Cleanup object URLs on unmount ──────────────────────────────────────
  useEffect(() => {
    const urls = objectUrlsRef.current
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  // ─── Cancel in-flight request on unmount ─────────────────────────────────
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  // ─── File Handling ────────────────────────────────────────────────────────
  const handleFiles = useCallback((newFilesList: FileList | File[]) => {
    const newFiles = Array.from(newFilesList).map(file => {
      const isImage = file.type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)
      let preview: string | null = null
      if (isImage) {
        preview = URL.createObjectURL(file)
        objectUrlsRef.current.add(preview)
      }
      return {
        id: crypto.randomUUID(),
        file,
        type: isImage ? file.type || "image/unknown" : (file.type || "application/octet-stream"),
        preview,
        uploadStatus: "pending" as const
      }
    })

    setAttachedFiles(prev => [...prev, ...newFiles])
    newFiles.forEach(f => {
      setAttachedFiles(prev => prev.map(p => p.id === f.id ? { ...p, uploadStatus: "uploading" } : p))
      setTimeout(() => {
        setAttachedFiles(prev => prev.map(p => p.id === f.id ? { ...p, uploadStatus: "complete" } : p))
      }, 800 + Math.random() * 600)
    })
  }, [])

  const removeFile = useCallback((id: string) => {
    setAttachedFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
        objectUrlsRef.current.delete(file.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }, [])

  // ─── Drag & Drop ──────────────────────────────────────────────────────────
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false) }
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
  }

  // ─── Paste Handling ───────────────────────────────────────────────────────
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    const pastedFiles: File[] = []
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item?.kind === "file") {
        const file = item.getAsFile()
        if (file) pastedFiles.push(file)
      }
    }
    if (pastedFiles.length > 0) {
      e.preventDefault()
      handleFiles(pastedFiles)
      return
    }
    const text = e.clipboardData.getData("text")
    if (text.length > 300) {
      e.preventDefault()
      setPastedSnippets(prev => [...prev, {
        id: crypto.randomUUID(),
        content: text,
        timestamp: new Date()
      }])
    }
  }

  // ─── Voice Toggle ─────────────────────────────────────────────────────────
  const toggleRecording = () => {
    if (voiceUnsupported || !recognitionRef.current) {
      showInlineNotice(dict.voiceNotSupported)
      return
    }
    if (isRecording) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.lang = locale === "ar" ? "ar-EG" : "en-US"
      recognitionRef.current.start()
    }
  }

  // ─── Inline notice helper ─────────────────────────────────────────────────
  const showInlineNotice = (msg: string) => {
    setInlineNotice(msg)
    setTimeout(() => setInlineNotice(null), 3500)
  }

  // ─── Export transcript ────────────────────────────────────────────────────
  const exportTranscript = () => {
    const text = messages
      .map(m => `[${m.timestamp}] ${m.role.toUpperCase()}:\n${m.text}`)
      .join("\n\n")
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `aivora-consultant-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ─── Send Message ─────────────────────────────────────────────────────────
  const handleSend = useCallback(async (textToSend: string) => {
    const trimmed = textToSend.trim()
    if ((!trimmed && attachedFiles.length === 0 && pastedSnippets.length === 0) || isStreaming) return

    // C-03: Client-side length guard
    if (trimmed.length > MAX_QUERY_LENGTH) {
      showInlineNotice(dict.charLimit)
      return
    }

    // Cancel any in-flight request
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    const userMessage: Message = {
      role: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
      files: [...attachedFiles],
      pastedContent: [...pastedSnippets]
    }

    setMessages(prev => [...prev, userMessage])
    setMessageText("")
    setAttachedFiles([])
    setPastedSnippets([])
    setIsStreaming(true)
    setStreamingText("")

    try {
      const response = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmed,
          // C-01: Use per-session unique ID from sessionStorage
          session_id: sessionIdRef.current ?? "fallback"
        }),
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let completeResponse = ""

      if (reader) {
        while (true) {
          const { value, done } = await reader.read()
          if (done) break

          // C-02: Proper SSE parsing with buffer for split chunks
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          // Keep the last potentially-incomplete line in the buffer
          buffer = lines.pop() ?? ""

          for (const line of lines) {
            const trimmedLine = line.trim()
            if (!trimmedLine) continue
            if (trimmedLine.startsWith("data:")) {
              const data = trimmedLine.slice(5).trim()
              if (data === "[DONE]") break
              if (data) {
                // C-02: Unescape \n sequences the backend escaped to preserve SSE frame boundaries
                const unescaped = data.replace(/\\n/g, "\n")
                completeResponse += unescaped
                setStreamingText(completeResponse)
              }
            }
          }
        }
        // Flush any remaining buffer content
        if (buffer.startsWith("data:")) {
          const data = buffer.slice(5).trim()
          if (data && data !== "[DONE]") completeResponse += data
        }
      }

      setMessages(prev => [...prev, {
        role: "assistant",
        text: completeResponse || dict.unavailable,
        timestamp: new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
      }])
    } catch (err) {
      if ((err as Error).name === "AbortError") return
      console.error("AI Assistant error:", err)
      setMessages(prev => [...prev, {
        role: "assistant",
        text: dict.unavailable,
        timestamp: new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
        isError: true
      }])
    } finally {
      setStreamingText("")
      setIsStreaming(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachedFiles, pastedSnippets, isStreaming, locale, dict.charLimit, dict.unavailable])

  // ─── Derived values ───────────────────────────────────────────────────────
  const hasContent = messageText.trim() || attachedFiles.length > 0 || pastedSnippets.length > 0
  const charCount = messageText.length
  const charOverLimit = charCount > MAX_QUERY_LENGTH

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 flex flex-col items-end",
      locale === "ar" && "right-auto left-6"
    )}>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[360px] sm:w-[445px] h-[640px] border border-border/80 bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col mb-4 relative"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            role="dialog"
            aria-label="Aivora AI Business Consultant"
            aria-modal="false"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between z-10 relative shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Bot className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <span className="font-bold text-sm block">{dict.botName}</span>
                  <span className="text-[10px] opacity-75 block">{dict.botSubtitle}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={exportTranscript}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Export conversation transcript"
                  title="Export Transcript"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close Aivora Assistant"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Inline Notice Banner */}
            <AnimatePresence>
              {inlineNotice && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2 text-[11px] text-amber-600 dark:text-amber-400"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {inlineNotice}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs sm:text-sm"
              aria-live="polite"
              aria-label="Conversation"
            >
              {/* History loading skeleton */}
              {isLoadingHistory && (
                <div className="space-y-3">
                  {[80, 60, 90].map((w, i) => (
                    <div key={i} className={cn("h-8 rounded-xl bg-muted/40 animate-pulse", i % 2 === 0 ? "mr-auto" : "ml-auto")} style={{ width: `${w}%` }} />
                  ))}
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col gap-1 max-w-[85%]",
                    msg.role === "user" ? "ms-auto items-end" : "me-auto items-start"
                  )}
                >
                  <div
                    className={cn(
                      "p-3.5 rounded-2xl leading-relaxed border shadow-sm flex flex-col gap-3",
                      msg.role === "user"
                        ? "bg-primary border-primary/20 text-primary-foreground"
                        : msg.isError
                          ? "bg-destructive/10 border-destructive/20 text-destructive-foreground"
                          : "bg-muted/40 border-border/50 text-foreground"
                    )}
                  >
                    {msg.role === "user" ? (
                      <span className="whitespace-pre-wrap leading-relaxed">{msg.text}</span>
                    ) : (
                      <MemoizedMarkdown content={msg.text} />
                    )}

                    {msg.files && msg.files.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.files.map(file => (
                          <div key={file.id} className="p-1.5 rounded-lg bg-black/10 border border-white/10 flex items-center gap-1.5 text-[10px] max-w-[150px] truncate">
                            <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            <span className="truncate">{file.file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.pastedContent && msg.pastedContent.length > 0 && (
                      <div className="flex flex-col gap-1.5 mt-1">
                        {msg.pastedContent.map(snippet => (
                          <div key={snippet.id} className="p-2 rounded bg-black/10 font-mono text-[9px] border border-white/5 whitespace-pre-wrap max-h-[80px] overflow-y-auto">
                            {snippet.content}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-muted-foreground font-mono px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Streaming bubble */}
              {streamingText && (
                <div className="flex flex-col gap-1 max-w-[85%] me-auto items-start">
                  <div className="p-3.5 rounded-2xl leading-relaxed border shadow-sm bg-muted/40 border-border/50 text-foreground overflow-x-hidden">
                    <MemoizedMarkdown content={streamingText} />
                  </div>
                </div>
              )}

              {/* Typing indicator (pre-stream) */}
              {isStreaming && !streamingText && (
                <div className="flex items-center gap-2 text-muted-foreground text-xs p-2 me-auto">
                  <div className="flex gap-1">
                    {[0, 150, 300].map(delay => (
                      <span
                        key={delay}
                        className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                  <span className="font-mono">{dict.thinking}</span>
                </div>
              )}
            </div>

            {/* Suggestion Chips */}
            <div className="px-4 py-2 border-t border-border/40 bg-muted/10 flex flex-wrap gap-2 max-h-[85px] overflow-y-auto shrink-0">
              {dict.chips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip.query)}
                  disabled={isStreaming}
                  className="px-2.5 py-1 border border-border/80 hover:border-primary/30 bg-background text-[10px] font-mono font-bold text-muted-foreground hover:text-foreground rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border/40 bg-background/50 z-10 relative shrink-0">
              <div className="flex flex-col border border-border/80 focus-within:border-primary/30 rounded-2xl p-3 bg-card/60 transition-all duration-200 shadow-sm relative">

                {/* Attached items */}
                {(attachedFiles.length > 0 || pastedSnippets.length > 0) && (
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-2 border-b border-border/30 max-h-[110px]">
                    {pastedSnippets.map(snippet => (
                      <div key={snippet.id} className="relative group shrink-0 w-24 h-24 rounded-xl border border-border/80 bg-muted/30 p-2 flex flex-col justify-between overflow-hidden">
                        <p className="text-[9px] text-muted-foreground font-mono leading-tight break-all line-clamp-3 select-none">{snippet.content}</p>
                        <div className="inline-flex items-center justify-center px-1 py-[2px] rounded border border-border/80 bg-background text-[8px] font-bold text-muted-foreground">{dict.pastedTag}</div>
                        <button
                          onClick={() => setPastedSnippets(prev => prev.filter(c => c.id !== snippet.id))}
                          className="absolute top-1 right-1 p-0.5 bg-black/60 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove pasted content"
                        >
                          <X className="w-2.5 h-2.5" aria-hidden="true" />
                        </button>
                      </div>
                    ))}

                    {attachedFiles.map(file => {
                      const isImage = !!file.preview
                      return (
                        <div key={file.id} className="relative group shrink-0 w-24 h-24 rounded-xl border border-border/80 bg-muted/30 overflow-hidden">
                          {isImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={file.preview!} alt={file.file.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full p-2 flex flex-col justify-between">
                              <div className="flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                                <span className="text-[8px] font-mono text-muted-foreground uppercase truncate">{file.file.name.split(".").pop()}</span>
                              </div>
                              <div>
                                <p className="text-[9px] font-bold text-foreground truncate" title={file.file.name}>{file.file.name}</p>
                                <p className="text-[8px] text-muted-foreground">{formatFileSize(file.file.size)}</p>
                              </div>
                            </div>
                          )}
                          <button
                            onClick={() => removeFile(file.id)}
                            className="absolute top-1 right-1 p-0.5 bg-black/60 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Remove ${file.file.name}`}
                          >
                            <X className="w-2.5 h-2.5" aria-hidden="true" />
                          </button>
                          {file.uploadStatus === "uploading" && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="w-4 h-4 text-white animate-spin" aria-hidden="true" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      void handleSend(messageText)
                    }
                  }}
                  onPaste={handlePaste}
                  placeholder={dict.placeholder}
                  aria-label={dict.placeholder}
                  className={cn(
                    "w-full bg-transparent border-0 outline-none text-foreground text-xs placeholder:text-muted-foreground resize-none leading-relaxed block h-8 min-h-[2rem]",
                    charOverLimit && "text-destructive"
                  )}
                  rows={1}
                  maxLength={MAX_QUERY_LENGTH + 50}
                />

                {/* Char count warning */}
                {charCount > MAX_QUERY_LENGTH * 0.85 && (
                  <div className={cn(
                    "text-[9px] text-right font-mono mt-1",
                    charOverLimit ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {charCount}/{MAX_QUERY_LENGTH}
                  </div>
                )}

                {/* Action bar */}
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/30">
                  <div className="flex items-center gap-1">
                    {/* Voice */}
                    <button
                      onClick={toggleRecording}
                      disabled={voiceUnsupported}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        isRecording
                          ? "text-red-500 bg-red-500/10 animate-pulse"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                        voiceUnsupported && "opacity-40 cursor-not-allowed"
                      )}
                      type="button"
                      aria-label={isRecording ? "Stop recording" : "Start voice input"}
                      title={voiceUnsupported ? dict.voiceNotSupported : (isRecording ? "Stop" : "Voice input")}
                    >
                      {isRecording ? <MicOff className="w-4 h-4" aria-hidden="true" /> : <Mic className="w-4 h-4" aria-hidden="true" />}
                    </button>

                    {/* Attach */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                      type="button"
                      aria-label="Attach file"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </button>

                    {/* Extended Thinking */}
                    <button
                      onClick={() => setIsThinkingEnabled(!isThinkingEnabled)}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        isThinkingEnabled ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      )}
                      type="button"
                      aria-label={isThinkingEnabled ? "Disable extended thinking" : "Enable extended thinking"}
                      aria-pressed={isThinkingEnabled}
                    >
                      <Brain className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Send */}
                  <button
                    onClick={() => void handleSend(messageText)}
                    disabled={!hasContent || isStreaming || charOverLimit}
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                      hasContent && !charOverLimit
                        ? "bg-primary text-primary-foreground shadow"
                        : "bg-muted text-muted-foreground cursor-default"
                    )}
                    type="button"
                    aria-label={dict.send}
                  >
                    {isStreaming
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                      : <ArrowUp className="w-4 h-4" aria-hidden="true" />
                    }
                  </button>
                </div>
              </div>
            </div>

            {/* Drag overlay */}
            {isDragging && (
              <div className="absolute inset-0 bg-background/90 border-2 border-dashed border-primary/45 rounded-2xl z-50 flex flex-col items-center justify-center backdrop-blur-sm pointer-events-none">
                <Archive className="w-10 h-10 text-primary mb-2 animate-bounce" aria-hidden="true" />
                <p className="text-primary font-medium text-xs">{dict.dropText}</p>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              aria-hidden="true"
              onChange={e => {
                if (e.target.files) handleFiles(e.target.files)
                e.target.value = ""
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB — always visible (M-04: healthStatus null shows widget) */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          setHasUnread(false)
        }}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 relative"
        aria-label={isOpen ? "Close Aivora Assistant" : "Open Aivora Assistant"}
        aria-expanded={isOpen}
      >
        {healthStatus === null && (
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
