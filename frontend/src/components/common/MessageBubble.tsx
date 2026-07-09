"use client";

import React from "react";
import Image from "next/image";
import { FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Message } from "@/hooks/useChat";

import { ErrorMessage } from "./ErrorMessage";

const MemoizedMarkdown = React.memo(function MemoizedMarkdown({ content }: { content: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/20 prose-pre:border prose-pre:border-white/10">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
});

interface MessageBubbleProps {
  msg: Message;
  isLast: boolean;
  locale: string;
  onRetry: (text: string) => void;
  previousMsgText?: string | undefined;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  msg,
  isLast,
  locale,
  onRetry,
  previousMsgText
}) => {
  if (msg.isError) {
    return (
      <div className="flex flex-col gap-1.5 max-w-[88%] me-auto items-start">
        {isLast ? (
          <ErrorMessage
            message={msg.text}
            onRetry={() => onRetry(previousMsgText || "")}
          />
        ) : (
          <ErrorMessage message={msg.text} />
        )}
        <span className="text-[10px] text-muted-foreground/70 font-mono px-1">
          {msg.timestamp}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 max-w-[88%]",
        msg.role === "user" ? "ms-auto items-end" : "me-auto items-start"
      )}
    >
      <div
        className={cn(
          "px-4 py-3 rounded-2xl leading-relaxed shadow-sm flex flex-col gap-3",
          msg.role === "user"
            ? "bg-primary text-primary-foreground rounded-se-sm"
            : "bg-muted/40 border border-border/50 text-foreground rounded-ss-sm"
        )}
      >
        {msg.role === "user" ? (
          <span className="whitespace-pre-wrap leading-relaxed font-medium">{msg.text}</span>
        ) : (
          <MemoizedMarkdown content={msg.text} />
        )}

        {/* Files rendering */}
        {msg.files && msg.files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {msg.files.map(file => (
              <div
                key={file.id}
                className="p-1.5 rounded-lg bg-black/10 border border-white/10 flex items-center gap-1.5 text-[11px] max-w-[160px] truncate"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{file.file.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Pasted Content rendering */}
        {msg.pastedContent && msg.pastedContent.length > 0 && (
          <div className="flex flex-col gap-1.5 mt-1">
            {msg.pastedContent.map(snippet => (
              <div
                key={snippet.id}
                className="p-2.5 rounded-lg bg-black/10 font-mono text-[11px] border border-white/5 whitespace-pre-wrap max-h-[100px] overflow-y-auto"
              >
                {snippet.content}
              </div>
            ))}
          </div>
        )}
      </div>
      <span className="text-[10px] text-muted-foreground/70 font-mono px-1">
        {msg.timestamp}
      </span>
    </div>
  );
};
