import { useState, useEffect, useRef } from "react";
import { Message } from "@aivora/hooks/useChat";

const SESSION_STORAGE_KEY = "aivora_chat_session_id";
const HEALTH_TIMEOUT_MS = 3000;

function getOrCreateSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;
    const newId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_STORAGE_KEY, newId);
    return newId;
  } catch {
    return crypto.randomUUID();
  }
}

export function useAssistantHistory(locale: string, dict: any) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [healthStatus, setHealthStatus] = useState<null | true | "degraded">(null);
  const sessionIdRef = useRef<string | null>(null);
  const welcomeTriggered = useRef(false);

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  useEffect(() => {
    async function init() {
      // 1. Health check
      try {
        const res = await fetch("/api/v1/health", {
          signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS)
        });
        if (!res.ok) throw new Error("Health check failed");
        setHealthStatus(true);
      } catch {
        setHealthStatus("degraded");
        return;
      }

      // 2. Fetch History
      try {
        setIsLoadingHistory(true);
        const sid = sessionIdRef.current;
        if (sid) {
          const histRes = await fetch(`/api/v1/ai/sessions/${sid}/messages`);
          if (histRes.ok) {
            const data = await histRes.json();
            if (data.messages && data.messages.length > 0) {
              const formattedHistory = data.messages.map((m: any) => {
                let timeStr = "";
                try {
                  timeStr = new Date(m.timestamp).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
                } catch {
                  timeStr = "";
                }
                return {
                  role: m.role,
                  text: m.content || m.text,
                  timestamp: timeStr
                };
              });
              setMessages(formattedHistory);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setIsLoadingHistory(false);
      }

      // 3. Fallback Welcome Message
      setMessages([{
        role: "assistant",
        text: dict.initMsg,
        timestamp: new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
      }]);
    }

    init();
  }, [dict.initMsg, locale]);

  // Degraded state fallback
  useEffect(() => {
    if (healthStatus === "degraded" && messages.length === 0) {
      setMessages([{
        role: "assistant",
        text: dict.unavailable,
        timestamp: new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
        isError: true
      }]);
    }
  }, [healthStatus, dict.unavailable, locale, messages.length]);

  const triggerWelcome = () => {
    if (welcomeTriggered.current || messages.length > 1) return;
    welcomeTriggered.current = true;
    setMessages(prev => [...prev, {
      role: "assistant",
      text: dict.smartServicesMsg,
      timestamp: new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
    }]);
  };

  return {
    messages,
    setMessages,
    isLoadingHistory,
    healthStatus,
    sessionId: sessionIdRef.current,
    triggerWelcome
  };
}
