import { useState, useEffect, useRef, useCallback } from "react";

export function useChatStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const startStream = useCallback(async (
    query: string, 
    sessionId: string, 
    onSuccess: (text: string) => void, 
    onError: (err: any) => void,
    signal?: AbortSignal
  ) => {
    setIsStreaming(true);
    setStreamingText("");

    try {
      const requestInit: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          session_id: sessionId
        })
      };
      if (signal) {
        requestInit.signal = signal;
      }
      const response = await fetch("/api/v1/ai/chat", requestInit);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let completeResponse = "";

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.trim() || !line.startsWith("data:")) continue;
            let data = line.startsWith("data: ") ? line.slice(6) : line.slice(5);
            if (data === "[DONE]") break;
            if (data) {
              const unescaped = data.replace(/\\n/g, "\n");
              completeResponse += unescaped;
              setStreamingText(completeResponse);
            }
          }
        }
        if (buffer.startsWith("data:")) {
          let data = buffer.startsWith("data: ") ? buffer.slice(6) : buffer.slice(5);
          if (data && data !== "[DONE]") completeResponse += data;
        }
      }

      onSuccess(completeResponse);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      onError(err);
    } finally {
      setStreamingText("");
      setIsStreaming(false);
    }
  }, []);

  const abortStream = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  useEffect(() => {
    const currentAbortController = abortControllerRef.current;
    return () => {
      currentAbortController?.abort();
    };
  }, []);

  return {
    isStreaming,
    streamingText,
    startStream,
    abortStream,
    abortControllerRef
  };
}
