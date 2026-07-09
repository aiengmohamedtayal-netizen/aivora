"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  ArrowUp, 
  X, 
  FileText, 
  Loader2,
  Archive, 
  Bot,
  Brain,
  Mic,
  MicOff,
  Download,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MessageBubble } from "./MessageBubble"

const MAX_QUERY_LENGTH = 2000

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

interface ChatDialogProps {
  chat: any;
  locale: string;
  dict: any;
  setIsOpen: (isOpen: boolean) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  dialogRef: React.RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
}

export const ChatDialog: React.FC<ChatDialogProps> = ({
  chat,
  locale,
  dict,
  setIsOpen,
  scrollRef,
  textareaRef,
  fileInputRef,
  dialogRef,
  prefersReducedMotion
}) => {
  const hasContent = chat.messageText.trim() || chat.attachedFiles.length > 0 || chat.pastedSnippets.length > 0
  const charCount = chat.messageText.length
  const charOverLimit = charCount > MAX_QUERY_LENGTH

  const motionTransition = prefersReducedMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" as const }

  return (
    <motion.div
      ref={dialogRef}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={motionTransition}
      className="w-[360px] sm:w-[445px] h-[640px] border border-border/80 bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col mb-4 relative"
      onDragOver={chat.onDragOver}
      onDragLeave={chat.onDragLeave}
      onDrop={chat.onDrop}
      role="dialog"
      aria-label="Aivora AI Business Consultant"
      aria-modal="true"
    >
      {/* Header */}
      <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between z-10 relative shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Bot className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <span className="font-medium text-sm block">{dict.botName}</span>
            <span className="text-[10px] opacity-75 block">{dict.botSubtitle}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={chat.exportTranscript}
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

      {/* Banner */}
      <AnimatePresence>
        {chat.inlineNotice && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2 text-[11px] text-amber-600 dark:text-amber-400"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            {chat.inlineNotice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-5 font-sans text-[13px] sm:text-sm scroll-smooth"
        aria-live="polite"
        aria-label="Conversation"
      >
        {chat.isLoadingHistory && (
          <div className="space-y-4">
            {[80, 60, 90].map((w, i) => (
              <div key={i} className={cn("h-10 rounded-2xl bg-muted/30 animate-pulse", i % 2 === 0 ? "mr-auto" : "ml-auto")} style={{ width: `${w}%` }} />
            ))}
          </div>
        )}

        <AnimatePresence initial={false}>
          {chat.messages.map((msg: any, i: number) => (
            <MessageBubble
              key={i}
              msg={msg}
              isLast={i === chat.messages.length - 1}
              locale={locale}
              onRetry={(text) => void chat.handleSend(text)}
              previousMsgText={chat.messages[i - 1]?.text}
            />
          ))}

          {chat.streamingText && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              className="flex flex-col gap-1.5 max-w-[88%] me-auto items-start"
            >
              <div className="px-4 py-3 rounded-2xl rounded-ss-sm leading-relaxed border shadow-sm bg-muted/40 border-border/50 text-foreground overflow-x-hidden">
                <MessageBubble
                  msg={{ role: "assistant", text: chat.streamingText, timestamp: "" }}
                  isLast={false}
                  locale={locale}
                  onRetry={() => {}}
                />
              </div>
            </motion.div>
          )}

          {chat.isStreaming && !chat.streamingText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-3 text-muted-foreground text-[13px] px-2 py-1 me-auto"
            >
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Brain className="w-2.5 h-2.5 text-primary animate-pulse" />
                </div>
              </div>
              <span className="animate-pulse">{dict.thinking}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 border-t border-border/40 bg-muted/10 flex flex-wrap gap-2 max-h-[85px] overflow-y-auto shrink-0">
        {dict.chips.map((chip: any, idx: number) => (
          <button
            key={idx}
            onClick={() => void chat.handleSend(chip.query)}
            disabled={chat.isStreaming}
            className="px-2.5 py-1 border border-border/80 hover:border-primary/30 bg-background text-[10px] font-mono font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border/40 bg-background/50 z-10 relative shrink-0">
        <div className="flex flex-col border border-border/80 focus-within:border-primary/30 rounded-2xl p-3 bg-card/60 transition-all duration-200 shadow-sm relative">
          {/* Attached Previews */}
          {(chat.attachedFiles.length > 0 || chat.pastedSnippets.length > 0) && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-2 border-b border-border/30 max-h-[110px]">
              {chat.pastedSnippets.map((snippet: any) => (
                <div key={snippet.id} className="relative group shrink-0 w-24 h-24 rounded-xl border border-border/80 bg-muted/30 p-2 flex flex-col justify-between overflow-hidden">
                  <p className="text-[9px] text-muted-foreground font-mono leading-tight break-all line-clamp-3 select-none">{snippet.content}</p>
                  <div className="inline-flex items-center justify-center px-1 py-[2px] rounded border border-border/80 bg-background text-[8px] font-medium text-muted-foreground">{dict.pastedTag}</div>
                  <button
                    onClick={() => chat.setPastedSnippets((prev: any[]) => prev.filter(c => c.id !== snippet.id))}
                    className="absolute top-1 right-1 p-0.5 bg-black/60 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove pasted content"
                  >
                    <X className="w-2.5 h-2.5" aria-hidden="true" />
                  </button>
                </div>
              ))}

              {chat.attachedFiles.map((file: any) => {
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
                          <p className="text-[9px] font-medium text-foreground truncate" title={file.file.name}>{file.file.name}</p>
                          <p className="text-[8px] text-muted-foreground">{formatFileSize(file.file.size)}</p>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => chat.removeFile(file.id)}
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
            value={chat.messageText}
            onChange={e => chat.setMessageText(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                void chat.handleSend(chat.messageText)
              }
            }}
            onPaste={chat.handlePaste}
            placeholder={dict.placeholder}
            aria-label={dict.placeholder}
            className={cn(
              "w-full bg-transparent border-0 outline-none text-foreground text-[16px] sm:text-[14px] placeholder:text-muted-foreground resize-none leading-relaxed block h-8 min-h-[2rem] focus-visible:ring-0",
              charOverLimit && "text-destructive"
            )}
            rows={1}
            maxLength={MAX_QUERY_LENGTH + 50}
          />

          {/* Action Bar */}
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/30">
            <div className="flex items-center gap-1">
              <button
                onClick={chat.toggleRecording}
                disabled={chat.voiceUnsupported}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  chat.isRecording
                    ? "text-red-500 bg-red-500/10 animate-pulse"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                  chat.voiceUnsupported && "opacity-40 cursor-not-allowed"
                )}
                type="button"
                aria-label={chat.isRecording ? "Stop recording" : "Start voice input"}
                title={chat.voiceUnsupported ? dict.voiceNotSupported : (chat.isRecording ? "Stop" : "Voice input")}
              >
                {chat.isRecording ? <MicOff className="w-4 h-4" aria-hidden="true" /> : <Mic className="w-4 h-4" aria-hidden="true" />}
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                type="button"
                aria-label="Attach file"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                onClick={() => chat.setIsThinkingEnabled(!chat.isThinkingEnabled)}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  chat.isThinkingEnabled ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
                type="button"
                aria-label={chat.isThinkingEnabled ? "Disable extended thinking" : "Enable extended thinking"}
                aria-pressed={chat.isThinkingEnabled}
              >
                <Brain className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <button
              onClick={() => void chat.handleSend(chat.messageText)}
              disabled={!hasContent || chat.isStreaming || charOverLimit}
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                hasContent && !charOverLimit
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-muted text-muted-foreground cursor-default"
              )}
              type="button"
              aria-label={dict.send}
            >
              {chat.isStreaming
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                : <ArrowUp className="w-4 h-4" aria-hidden="true" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      {chat.isDragging && (
        <div className="absolute inset-0 bg-background/90 border-2 border-dashed border-primary/45 rounded-2xl z-50 flex flex-col items-center justify-center backdrop-blur-sm pointer-events-none">
          <Archive className="w-10 h-10 text-primary mb-2 animate-bounce" aria-hidden="true" />
          <p className="text-primary font-medium text-xs">{dict.dropText}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        aria-hidden="true"
        onChange={e => {
          if (e.target.files) chat.handleFiles(e.target.files)
          e.target.value = ""
        }}
      />
    </motion.div>
  )
}
