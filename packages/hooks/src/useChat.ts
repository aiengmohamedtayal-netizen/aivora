import { useState, useCallback } from "react";
export interface AttachedFile {
  id: string;
  file: File;
  type: string;
  preview: string | null;
  uploadStatus: "pending" | "uploading" | "complete";
}

export interface PastedSnippet {
  id: string;
  content: string;
  timestamp: Date;
}

export interface Message {
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  files?: AttachedFile[];
  pastedContent?: PastedSnippet[];
  isError?: boolean;
}

import { useAssistantHistory } from "./useAssistantHistory";
import { useFileUpload } from "./useFileUpload";
import { useChatStream } from "./useChatStream";
import { useSpeechRecognition } from "./useSpeechRecognition";

const MAX_QUERY_LENGTH = 2000;

export function useChat(locale: string, dict: any) {
  const [messageText, setMessageText] = useState("");
  const [isThinkingEnabled, setIsThinkingEnabled] = useState(false);
  const [pastedSnippets, setPastedSnippets] = useState<PastedSnippet[]>([]);
  const [inlineNotice, setInlineNotice] = useState<string | null>(null);

  const showInlineNotice = useCallback((msg: string) => {
    setInlineNotice(msg);
    setTimeout(() => setInlineNotice(null), 3500);
  }, []);

  const history = useAssistantHistory(locale, dict);
  const fileUpload = useFileUpload();
  const chatStream = useChatStream();

  const handleVoiceTranscript = useCallback((transcript: string) => {
    setMessageText(prev => prev + " " + transcript);
  }, []);

  const voice = useSpeechRecognition(locale, handleVoiceTranscript);

  const handleSend = useCallback(async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if ((!trimmed && fileUpload.attachedFiles.length === 0 && pastedSnippets.length === 0) || chatStream.isStreaming) return;

    if (trimmed.length > MAX_QUERY_LENGTH) {
      showInlineNotice(dict.charLimit);
      return;
    }

    // Cancel in-flight
    chatStream.abortStream();
    const controller = new AbortController();
    chatStream.abortControllerRef.current = controller;

    const userMessage: Message = {
      role: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
      files: [...fileUpload.attachedFiles],
      pastedContent: [...pastedSnippets]
    };

    history.setMessages(prev => [...prev, userMessage]);
    setMessageText("");
    fileUpload.setAttachedFiles([]);
    setPastedSnippets([]);

    await chatStream.startStream(
      trimmed,
      history.sessionId ?? "fallback",
      (completeResponse) => {
        history.setMessages(prev => [...prev, {
          role: "assistant",
          text: completeResponse || dict.unavailable,
          timestamp: new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
        }]);
      },
      (err) => {
        console.error("Chat error:", err);
        history.setMessages(prev => [...prev, {
          role: "assistant",
          text: dict.unavailable,
          timestamp: new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
          isError: true
        }]);
      },
      controller.signal
    );
  }, [fileUpload, pastedSnippets, chatStream, history, locale, dict, showInlineNotice]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const pastedFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item?.kind === "file") {
        const file = item.getAsFile();
        if (file) pastedFiles.push(file);
      }
    }
    if (pastedFiles.length > 0) {
      e.preventDefault();
      fileUpload.handleFiles(pastedFiles);
      return;
    }
    const text = e.clipboardData.getData("text");
    if (text.length > 300) {
      e.preventDefault();
      setPastedSnippets(prev => [...prev, {
        id: crypto.randomUUID(),
        content: text,
        timestamp: new Date()
      }]);
    }
  }, [fileUpload]);

  return {
    // States from hooks
    messages: history.messages,
    setMessages: history.setMessages,
    isLoadingHistory: history.isLoadingHistory,
    healthStatus: history.healthStatus,
    triggerWelcome: history.triggerWelcome,

    attachedFiles: fileUpload.attachedFiles,
    setAttachedFiles: fileUpload.setAttachedFiles,
    isDragging: fileUpload.isDragging,
    handleFiles: fileUpload.handleFiles,
    removeFile: fileUpload.removeFile,
    onDragOver: fileUpload.onDragOver,
    onDragLeave: fileUpload.onDragLeave,
    onDrop: fileUpload.onDrop,

    isStreaming: chatStream.isStreaming,
    streamingText: chatStream.streamingText,

    isRecording: voice.isRecording,
    voiceUnsupported: voice.voiceUnsupported,
    toggleRecording: voice.toggleRecording,

    // Local states
    messageText,
    setMessageText,
    isThinkingEnabled,
    setIsThinkingEnabled,
    pastedSnippets,
    setPastedSnippets,
    inlineNotice,
    showInlineNotice,

    handleSend,
    handlePaste,
    exportTranscript: () => {
      const text = history.messages
        .map(m => `[${m.timestamp}] ${m.role.toUpperCase()}:\n${m.text}`)
        .join("\n\n");
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aivora-consultant-${new Date().toISOString().slice(0, 10)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
}
