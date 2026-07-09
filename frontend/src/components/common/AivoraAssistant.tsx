"use client"
/* eslint-disable @next/next/no-img-element */


import React, { useState, useEffect, useRef, useTransition, useCallback } from "react"
import { useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  ChevronDown, 
  ArrowUp, 
  X, 
  FileText, 
  Loader2, 
  Check, 
  Archive, 
  MessageSquare,
  Bot,
  Brain,
  Sparkles,
  Mic,
  MicOff,
  Download
} from "lucide-react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// eslint-disable-next-line react/display-name
const MemoizedMarkdown = React.memo(({ content }: { content: string }) => {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/20 prose-pre:border prose-pre:border-white/10">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
})

interface Message {
  role: "user" | "assistant"
  text: string
  timestamp: string
  files?: AttachedFile[]
  pastedContent?: PastedSnippet[]
}

interface AttachedFile {
  id: string
  file: File
  type: string
  preview: string | null
  uploadStatus: 'pending' | 'uploading' | 'complete'
}

interface PastedSnippet {
  id: string
  content: string
  timestamp: Date
}

interface Model {
  id: string
  name: string
  description: string
  badge?: string
}

/* --- UTILS --- */
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function AivoraAssistant() {
  const locale = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [isPending, startTransition] = useTransition()
  const [streamingText, setStreamingText] = useState("")
  const [hasUnread, setHasUnread] = useState(true)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  
  // Claude Chat Input states
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [pastedSnippets, setPastedSnippets] = useState<PastedSnippet[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isThinkingEnabled, setIsThinkingEnabled] = useState(false)
  const [selectedModel, setSelectedModel] = useState("sonnet-4.5")
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const welcomeTriggered = useRef(false)

  const models: Model[] = [
    { id: "opus-4.5", name: "Opus 4.5", description: "Most capable for complex project scope" },
    { id: "sonnet-4.5", name: "Sonnet 4.5", description: "Best for everyday business tasks" },
    { id: "haiku-4.5", name: "Haiku 4.5", description: "Fastest for quick answers" }
  ]

  // B2B Text Dictionary
  const dict = {
    en: {
      botName: "Aivora AI",
      botSubtitle: "Business & Digital Product Consultant",
      initMsg: "Hello, I am the Aivora AI Business Consultant. How can we accelerate your business today?",
      smartServicesMsg: "Would you like to discuss a specific project, or explore our engineering services?",
      unavailable: "Aivora AI is temporarily unavailable.",
      placeholder: "How can I help you today?",
      send: "Send message",
      thinking: "Thinking...",
      dropText: "Drop files to upload",
      pastedTag: "PASTED",
      chips: [
        "🚀 Start a Project",
        "💰 Request a Quote",
        "📅 Book a Consultation",
        "🌐 Explore Services",
        "💻 View Portfolio",
        "🤖 Build AI SaaS",
        "⚙ Business Automation"
      ]
    },
    ar: {
      botName: "أيفورا الذكي",
      botSubtitle: "مستشار الأعمال والمنتجات الرقمية",
      initMsg: "مرحباً، أنا مستشار الأعمال الرقمية من أيفورا. كيف يمكننا تسريع نمو أعمالك اليوم؟",
      smartServicesMsg: "هل تود مناقشة مشروع معين، أم استكشاف خدماتنا الهندسية؟",
      unavailable: "أيفورا الذكي غير متاح حالياً.",
      placeholder: "كيف يمكنني مساعدتك اليوم؟",
      send: "إرسال الرسالة",
      thinking: "جاري التفكير...",
      dropText: "أفلت الملفات لرفعها",
      pastedTag: "ملصق",
      chips: [
        "🚀 ابدأ مشروعك",
        "💰 اطلب تسعيرة",
        "📅 احجز استشارة",
        "🌐 استكشف خدماتنا",
        "💻 تصفح أعمالنا",
        "🤖 بناء نظام ذكاء اصطناعي",
        "⚙ أتمتة العمليات"
      ]
    }
  }[locale === "ar" ? "ar" : "en"]

  // Voice Input State
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      const rec = new SpeechRecognition()
      rec.continuous = false
      rec.interimResults = false
      rec.onstart = () => setIsRecording(true)
      rec.onresult = (event: any) => {
        if (event.results[0][0].transcript) {
          setMessageText(prev => prev + " " + event.results[0][0].transcript)
        }
      }
      rec.onerror = () => setIsRecording(false)
      rec.onend = () => setIsRecording(false)
      recognitionRef.current = rec
    }
  }, [])

  const toggleRecording = () => {
    if (!recognitionRef.current) return alert("Voice input not supported in this browser.")
    if (isRecording) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.lang = locale === "ar" ? "ar-EG" : "en-US"
      recognitionRef.current.start()
    }
  }

  const exportTranscript = () => {
    const text = messages.map(m => `[${m.timestamp}] ${m.role.toUpperCase()}:\n${m.text}`).join("\n\n")
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aivora-business-consultant-${new Date().toISOString().slice(0,10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px"
    }
  }, [messageText])

  // 1. Startup validation (AI Health check)
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch("/api/v1/health")
        if (res.ok) {
          setIsValid(true)
        } else {
          setIsValid(false)
        }
      } catch (err) {
        setIsValid(false)
      }
    }
    checkHealth()
  }, [])

  // 2. Welcome Message Init
  useEffect(() => {
    if (isValid === true && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          text: dict.initMsg,
          timestamp: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
        }
      ])
    }
  }, [isValid, locale, dict.initMsg, messages.length])

  // 3. Smart Welcome Actions (Scroll/Time-based)
  useEffect(() => {
    if (isValid !== true) return

    const handleSmartWelcome = () => {
      if (welcomeTriggered.current) return
      welcomeTriggered.current = true
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: dict.smartServicesMsg,
          timestamp: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
        }
      ])
      setHasUnread(true)
    }

    const timer = setTimeout(handleSmartWelcome, 30000)

    const handleScroll = () => {
      const servicesEl = document.getElementById("services")
      if (servicesEl) {
        const rect = servicesEl.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          handleSmartWelcome()
        }
      }
    }
    window.addEventListener("scroll", handleScroll)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isValid, locale, dict.smartServicesMsg])

  // Auto Scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, streamingText])

  // File Handling
  const handleFiles = useCallback((newFilesList: FileList | File[]) => {
    const newFiles = Array.from(newFilesList).map(file => {
      const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)
      return {
        id: Math.random().toString(36).substring(2, 9),
        file,
        type: isImage ? 'image/unknown' : (file.type || 'application/octet-stream'),
        preview: isImage ? URL.createObjectURL(file) : null,
        uploadStatus: 'pending' as const
      }
    })

    setAttachedFiles(prev => [...prev, ...newFiles])

    // Simulate upload status update
    newFiles.forEach(f => {
      setAttachedFiles(prev => prev.map(p => p.id === f.id ? { ...p, uploadStatus: 'uploading' } : p))
      setTimeout(() => {
        setAttachedFiles(prev => prev.map(p => p.id === f.id ? { ...p, uploadStatus: 'complete' } : p))
      }, 1000 + Math.random() * 1000)
    })
  }, [])

  // Drag & Drop handlers
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
  }

  // Paste Handling
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    const pastedFiles: File[] = []
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item && item.kind === 'file') {
        const file = item.getAsFile()
        if (file) pastedFiles.push(file)
      }
    }

    if (pastedFiles.length > 0) {
      e.preventDefault()
      handleFiles(pastedFiles)
      return
    }

    // Handle large text paste
    const text = e.clipboardData.getData('text')
    if (text.length > 300) {
      e.preventDefault()
      const snippet = {
        id: Math.random().toString(36).substring(2, 9),
        content: text,
        timestamp: new Date()
      }
      setPastedSnippets(prev => [...prev, snippet])
    }
  }

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim() && attachedFiles.length === 0 && pastedSnippets.length === 0 || isPending) return

    const userMessage: Message = {
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
      files: [...attachedFiles],
      pastedContent: [...pastedSnippets]
    }

    setMessages((prev) => [...prev, userMessage])
    setMessageText("")
    setAttachedFiles([])
    setPastedSnippets([])

    startTransition(async () => {
      try {
        const response = await fetch("/api/v1/ai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query: textToSend,
            session_id: "aivora_success_assistant"
          })
        })

        if (!response.ok) throw new Error("Failed to reach assistant stream")

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let completeResponse = ""

        if (reader) {
          while (true) {
            const { value, done } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split("\n")
            for (const line of lines) {
              if (line.startsWith("data:")) {
                const data = line.replace("data:", "").trim()
                if (data) {
                  completeResponse += data
                  setStreamingText(completeResponse)
                }
              }
            }
          }
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: completeResponse || "Processed successfully.",
            timestamp: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
          }
        ])
        setStreamingText("")
      } catch (err) {
        console.error("AI Assistant connection error:", err)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: dict.unavailable,
            timestamp: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
          }
        ])
      }
    })
  }

  if (isValid === false) return null

  const currentModel = models.find(m => m.id === selectedModel) || models[0] || { id: "sonnet-4.5", name: "Sonnet 4.5", description: "Best for everyday business tasks" }
  const hasContent = messageText.trim() || attachedFiles.length > 0 || pastedSnippets.length > 0

  return (
    <div className={cn("fixed bottom-6 right-6 z-50 flex flex-col items-end", locale === "ar" && "right-auto left-6")}>
      
      {/* Chat window panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-[360px] sm:w-[445px] h-[640px] border border-border/80 bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col mb-4 relative"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between z-10 relative">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-sm block">{dict.botName}</span>
                  <span className="text-[10px] opacity-75 block">{dict.botSubtitle}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={exportTranscript} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Export Transcript">
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs sm:text-sm"
            >
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
                        : "bg-muted/40 border-border/50 text-foreground"
                    )}
                  >
                    {msg.role === "user" ? (
                      <span className="whitespace-pre-wrap leading-relaxed">{msg.text}</span>
                    ) : (
                      <MemoizedMarkdown content={msg.text} />
                    )}

                    {/* Display user attachments if any */}
                    {msg.files && msg.files.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.files.map((file) => (
                          <div key={file.id} className="p-1.5 rounded-lg bg-black/10 border border-white/10 flex items-center gap-1.5 text-[10px] max-w-[150px] truncate">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="truncate">{file.file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {msg.pastedContent && msg.pastedContent.length > 0 && (
                      <div className="flex flex-col gap-1.5 mt-1">
                        {msg.pastedContent.map((snippet) => (
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

              {/* Streaming */}
              {streamingText && (
                <div className="flex flex-col gap-1 max-w-[85%] me-auto items-start">
                  <div className="p-3.5 rounded-2xl leading-relaxed border shadow-sm bg-muted/40 border-border/50 text-foreground overflow-x-hidden">
                    <MemoizedMarkdown content={streamingText} />
                  </div>
                </div>
              )}

              {/* Loader */}
              {isPending && !streamingText && (
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono p-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>{dict.thinking}</span>
                </div>
              )}
            </div>

            {/* Suggestion Chips */}
            <div className="px-4 py-2 border-t border-border/40 bg-muted/10 flex flex-wrap gap-2 max-h-[85px] overflow-y-auto">
              {dict.chips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  disabled={isPending}
                  className="px-2.5 py-1 border border-border/80 hover:border-primary/30 bg-background text-[10px] font-mono font-bold text-muted-foreground hover:text-foreground rounded-lg transition-colors whitespace-nowrap"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Claude Chat Input implementation */}
            <div className="p-4 border-t border-border/40 bg-background/50 z-10 relative">
              <div className="flex flex-col border border-border/80 focus-within:border-primary/30 rounded-2xl p-3 bg-card/60 transition-all duration-200 cursor-text shadow-sm relative">
                
                {/* 1. Attached items & pastings rendered ABOVE text input */}
                {(attachedFiles.length > 0 || pastedSnippets.length > 0) && (
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-2 border-b border-border/30 max-h-[110px] scrollbar-thin">
                    
                    {/* Pasted Content Cards */}
                    {pastedSnippets.map((snippet) => (
                      <div key={snippet.id} className="relative group shrink-0 w-24 h-24 rounded-xl border border-border/80 bg-muted/30 p-2 flex flex-col justify-between overflow-hidden">
                        <p className="text-[9px] text-muted-foreground font-mono leading-tight break-all line-clamp-3 select-none">
                          {snippet.content}
                        </p>
                        <div className="inline-flex items-center justify-center px-1 py-[2px] rounded border border-border/80 bg-background text-[8px] font-bold text-muted-foreground">
                          {dict.pastedTag}
                        </div>
                        <button
                          onClick={() => setPastedSnippets(prev => prev.filter(c => c.id !== snippet.id))}
                          className="absolute top-1 right-1 p-0.5 bg-black/60 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}

                    {/* File Attachment Cards */}
                    {attachedFiles.map((file) => {
                      const isImage = file.preview && file.type.startsWith("image/")
                      return (
                        <div key={file.id} className="relative group shrink-0 w-24 h-24 rounded-xl border border-border/80 bg-muted/30 overflow-hidden">
                          {isImage ? (
                            <img src={file.preview!} alt={file.file.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full p-2 flex flex-col justify-between">
                              <div className="flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5 text-primary" />
                                <span className="text-[8px] font-mono text-muted-foreground uppercase truncate">
                                  {file.file.name.split('.').pop()}
                                </span>
                              </div>
                              <div>
                                <p className="text-[9px] font-bold text-foreground truncate" title={file.file.name}>
                                  {file.file.name}
                                </p>
                                <p className="text-[8px] text-muted-foreground">
                                  {formatFileSize(file.file.size)}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Delete card */}
                          <button
                            onClick={() => setAttachedFiles(prev => prev.filter(f => f.id !== file.id))}
                            className="absolute top-1 right-1 p-0.5 bg-black/60 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>

                          {/* Upload Spinner progress */}
                          {file.uploadStatus === "uploading" && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="w-4 h-4 text-white animate-spin" />
                            </div>
                          )}
                        </div>
                      )
                    })}

                  </div>
                )}

                {/* 2. Text Input Area (Auto-resizing) */}
                <textarea
                  ref={textareaRef}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend(messageText)
                    }
                  }}
                  onPaste={handlePaste}
                  placeholder={dict.placeholder}
                  className="w-full bg-transparent border-0 outline-none text-foreground text-xs placeholder:text-muted-foreground resize-none leading-relaxed block h-8 min-h-[2rem]"
                  rows={1}
                />

                {/* 3. Action bar */}
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/30">
                    
                  <div className="flex items-center gap-1">
                    
                    {/* Voice Input Button */}
                    <button
                      onClick={toggleRecording}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors flex items-center gap-1",
                        isRecording 
                          ? "text-red-500 bg-red-500/10 animate-pulse" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      )}
                      type="button"
                      title="Voice Input"
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    {/* Attach File Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                      type="button"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* Extended Thinking Button */}
                    <button
                      onClick={() => setIsThinkingEnabled(!isThinkingEnabled)}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors flex items-center gap-1",
                        isThinkingEnabled 
                          ? "text-primary bg-primary/10" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      )}
                      type="button"
                    >
                      <Brain className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Model Selector & Send Button */}
                  <div className="flex items-center gap-2">
                    
                    {/* Model Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                        className="px-2.5 py-1 rounded-lg border border-border/80 text-[10px] font-mono font-bold text-muted-foreground hover:text-foreground hover:bg-muted/30 flex items-center gap-1 transition-colors"
                        type="button"
                      >
                        <span>{currentModel.name}</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      {isModelDropdownOpen && (
                        <div className="absolute bottom-full right-0 mb-1.5 w-[220px] bg-card border border-border/80 rounded-xl p-1 shadow-2xl z-50 flex flex-col">
                          {models.map((model) => (
                            <button
                              key={model.id}
                              onClick={() => {
                                setSelectedModel(model.id)
                                setIsModelDropdownOpen(false)
                              }}
                              className="w-full text-start p-2 rounded-lg hover:bg-muted/40 transition-colors flex flex-col gap-0.5"
                              type="button"
                            >
                              <span className="text-[10px] font-bold text-foreground flex items-center justify-between">
                                {model.name}
                                {model.badge && (
                                  <span className="text-[8px] bg-primary/10 text-primary px-1 rounded">
                                    {model.badge}
                                  </span>
                                )}
                              </span>
                              <span className="text-[8px] text-muted-foreground block">{model.description}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Send Button */}
                    <button
                      onClick={() => handleSend(messageText)}
                      disabled={!hasContent || isPending}
                      className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                        hasContent 
                          ? "bg-primary text-primary-foreground shadow" 
                          : "bg-muted text-muted-foreground cursor-default"
                      )}
                      type="button"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            </div>

            {/* Drag Overlay container */}
            {isDragging && (
              <div className="absolute inset-0 bg-background/90 border-2 border-dashed border-primary/45 rounded-2xl z-50 flex flex-col items-center justify-center backdrop-blur-sm pointer-events-none">
                <Archive className="w-10 h-10 text-primary mb-2 animate-bounce" />
                <p className="text-primary font-medium text-xs">{dict.dropText}</p>
              </div>
            )}

            {/* Hidden Input file reader */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files)
                e.target.value = ''
              }}
            />

          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher floating button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          setHasUnread(false)
        }}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 relative group"
      >
        <span className="absolute inset-0 rounded-full border border-primary animate-ping opacity-25" />
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6" />
            {hasUnread && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-destructive border-[2.5px] border-primary-foreground rounded-full" />
            )}
          </>
        )}
      </button>

    </div>
  )
}
