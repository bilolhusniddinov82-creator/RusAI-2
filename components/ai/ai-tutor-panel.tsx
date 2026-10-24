"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Mic, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/ai/types";
import { useUserStore } from "@/store/user-store";
import { speak } from "@/lib/speech/tts";
import { useSpeechRecognition } from "@/lib/speech/stt";

const INITIAL: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Привет! Я твой AI-репетитор 👋 Напиши или скажи предложение на русском, и я помогу его улучшить.",
  },
];

export function AITutorPanel({ topic }: { topic?: string }) {
  const level = useUserStore((s) => s.level);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const { listening, transcript, start, stop, supported } = useSpeechRecognition();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // When the mic finishes listening, drop the transcript into the input box.
  useEffect(() => {
    if (!listening && transcript) {
      setInput(transcript);
    }
  }, [listening, transcript]);

  async function send(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text || thinking) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setThinking(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next, level, topic }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      if (voiceOn) speak(data.reply);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Извини, произошла ошибка. Попробуй ещё раз." },
      ]);
    } finally {
      setThinking(false);
    }
  }

  function toggleMic() {
    if (listening) {
      stop();
    } else {
      setInput("");
      start();
    }
  }

  return (
    <div className="flex flex-col h-full card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm">RusAI Tutor</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setVoiceOn((v) => !v)}
            className="text-slate-400 hover:text-slate-200"
            title={voiceOn ? "Выключить голос" : "Включить голос"}
          >
            {voiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Готов помочь
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[280px]">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line leading-relaxed flex items-start gap-2",
                m.role === "user"
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-accent-fg rounded-tr-sm"
                  : "bg-slate-800 text-slate-200 rounded-tl-sm"
              )}
            >
              <span>{m.content}</span>
              {m.role === "assistant" && (
                <button
                  onClick={() => speak(m.content)}
                  className="shrink-0 text-slate-400 hover:text-indigo-300 mt-0.5"
                  title="Прослушать"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-slate-400">
              печатает…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {!supported && (
        <p className="px-4 pb-1 text-[11px] text-amber-400">
          Голосовой ввод не поддерживается в этом браузере (используй Chrome/Edge).
        </p>
      )}
      <div className="p-3 border-t border-slate-800 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMic}
          className={cn(
            "p-2 rounded-lg transition-colors",
            listening ? "bg-rose-500 text-white animate-pulse" : "text-slate-400 hover:bg-slate-800"
          )}
          aria-label="Голосовой ввод"
        >
          <Mic className="w-4 h-4" />
        </button>
        <input
          value={listening ? transcript || "Слушаю..." : input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          disabled={listening}
          placeholder="Напиши сообщение..."
          className="flex-1 bg-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
        />
        <button
          onClick={() => send()}
          disabled={thinking || listening}
          className="p-2 rounded-lg btn-primary disabled:opacity-50"
          aria-label="Отправить"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
