import { useState, useEffect, useRef } from "react";

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

export function useSpeechRecognition(locale: string, onTranscript: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceUnsupported, setVoiceUnsupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) {
      setVoiceUnsupported(true);
      return;
    }

    const rec = new SR() as SpeechRecognitionInstance;
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart = () => setIsRecording(true);
    rec.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        onTranscript(transcript);
      }
    };
    rec.onerror = () => setIsRecording(false);
    rec.onend = () => setIsRecording(false);
    recognitionRef.current = rec;
  }, [onTranscript]);

  const toggleRecording = () => {
    if (voiceUnsupported || !recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.lang = locale === "ar" ? "ar-EG" : "en-US";
      recognitionRef.current.start();
    }
  };

  return { isRecording, voiceUnsupported, toggleRecording };
}
