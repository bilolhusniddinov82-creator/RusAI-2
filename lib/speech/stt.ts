"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Real browser speech-to-text (Web Speech API) — no API key needed.
// Supported in Chrome/Edge; gracefully reports `supported: false` elsewhere
// (e.g. Firefox) so the UI can show a fallback message.

interface Options {
  lang?: string;
  /** Keep listening through pauses (long exam answers) instead of stopping at the first one. */
  continuous?: boolean;
}

const ERROR_MESSAGES: Record<string, string> = {
  "not-allowed": "Доступ к микрофону запрещён. Разреши микрофон в настройках браузера и попробуй снова.",
  "service-not-allowed": "Доступ к микрофону запрещён. Разреши микрофон в настройках браузера и попробуй снова.",
  "no-speech": "Речь не обнаружена. Попробуй говорить чуть громче и ближе к микрофону.",
  "audio-capture": "Микрофон не найден. Проверь, подключён ли он.",
  network: "Проблема с сетью во время распознавания речи. Попробуй ещё раз.",
  aborted: "",
};

export function useSpeechRecognition({ lang = "ru-RU", continuous = false }: Options = {}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Average recognizer confidence (0..1) of the final results in this session —
  // a rough but real proxy for how clearly the learner pronounced the words.
  const [confidence, setConfidence] = useState<number | null>(null);
  // Timestamp of the last recognized speech, used for silence detection.
  const [lastHeardAt, setLastHeardAt] = useState(0);
  const recognitionRef = useRef<any>(null);
  const confidencesRef = useRef<number[]>([]);
  const sessionFinalRef = useRef("");

  useEffect(() => {
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setSupported(false);
      return;
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = continuous;

    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";
      const confs: number[] = [];
      for (let i = 0; i < event.results.length; i++) {
        const alt = event.results[i][0];
        if (event.results[i].isFinal) {
          finalText += (finalText ? " " : "") + alt.transcript.trim();
          if (typeof alt.confidence === "number" && alt.confidence > 0) confs.push(alt.confidence);
        } else {
          interimText += alt.transcript;
        }
      }
      setInterim(interimText);
      setLastHeardAt(Date.now());
      if (confs.length) {
        confidencesRef.current = confs;
        setConfidence(confs.reduce((a, b) => a + b, 0) / confs.length);
      }
      // event.results holds every result of the current recognition session,
      // so rebuild from it rather than appending (avoids duplicated phrases).
      if (finalText && finalText !== sessionFinalRef.current) {
        sessionFinalRef.current = finalText;
        setTranscript(finalText);
      }
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = (event: any) => {
      setListening(false);
      const msg = ERROR_MESSAGES[event?.error as string];
      if (msg) setError(msg);
    };

    recognitionRef.current = recognition;
    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      try {
        recognition.abort();
      } catch {}
    };
  }, [lang, continuous]);

  const start = useCallback(() => {
    setTranscript("");
    setInterim("");
    setError(null);
    setConfidence(null);
    setLastHeardAt(Date.now());
    confidencesRef.current = [];
    sessionFinalRef.current = "";
    try {
      recognitionRef.current?.start();
      setListening(true);
    } catch {
      // start() throws if already listening — ignore.
    }
  }, []);

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {}
    setListening(false);
  }, []);

  return { listening, transcript, interim, start, stop, supported, error, confidence, lastHeardAt };
}
