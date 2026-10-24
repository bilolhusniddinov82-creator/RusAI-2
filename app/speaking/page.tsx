"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Sparkles, MessageSquareText, Keyboard, Send } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { VoiceOrb, type OrbPhase } from "@/components/speaking/voice-orb";
import { ModeTabs } from "@/components/speaking/mode-tabs";
import { useUserStore } from "@/store/user-store";
import { useLearningStore } from "@/store/learning-store";
import { speak, primeSpeech, hasAnyVoice, hasRussianVoice } from "@/lib/speech/tts";
import { useSpeechRecognition } from "@/lib/speech/stt";
import { useMicLevel } from "@/lib/speech/mic-level";
import type { ChatMessage } from "@/lib/ai/types";

const OPENING: ChatMessage = {
  role: "assistant",
  content: "Привет! Расскажи, как прошёл твой день?",
};

interface Correction { before: string; after: string; note: string }

export default function SpeakingPage() {
  const level = useUserStore((s) => s.level);
  const addXp = useUserStore((s) => s.addXp);
  const setLessonProgress = useLearningStore((s) => s.setLessonProgress);

  const [history, setHistory] = useState<ChatMessage[]>([OPENING]);
  const [caption, setCaption] = useState(OPENING.content);
  const [captionRole, setCaptionRole] = useState<"assistant" | "user">("assistant");
  const [thinking, setThinking] = useState(false);
  const [speakingNow, setSpeakingNow] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  // Hands-free: after the AI finishes answering a spoken turn, the mic opens
  // again by itself so the conversation flows without tapping every time.
  const [autoMic, setAutoMic] = useState(true);
  const autoMicRef = useRef(true);
  autoMicRef.current = autoMic;
  const [correction, setCorrection] = useState<Correction | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  const [voiceWarning, setVoiceWarning] = useState<string | null>(null);
  const [feedbackPhase, setFeedbackPhase] = useState<"correct" | "incorrect" | null>(null);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [speakingVariant, setSpeakingVariant] = useState(0);

  const { listening, transcript, interim, start, stop, supported, error } = useSpeechRecognition();
  const micLevel = useMicLevel(listening);
  const lastSent = useRef("");

  const phase: OrbPhase = thinking
    ? "thinking"
    : feedbackPhase
    ? feedbackPhase
    : speakingNow
    ? "speaking"
    : listening
    ? "listening"
    : "idle";

  useEffect(() => {
    (async () => {
      const any = await hasAnyVoice();
      if (!any) {
        setVoiceWarning("В этом браузере не найдено голосов для озвучки. Попробуй Chrome на компьютере или телефоне.");
        return;
      }
      const ru = await hasRussianVoice();
      if (!ru) setVoiceWarning("Русский голос не найден — ответы прозвучат другим голосом.");
    })();
  }, []);

  useEffect(() => {
    if (listening) {
      setCaptionRole("user");
      setCaption(interim || "Слушаю...");
      // The previous turn's verdict no longer applies once the learner speaks again.
      setLastCorrect(false);
      setCorrection(null);
      return;
    }
    // Mic closed without hearing anything — put the tutor's last line back
    // instead of leaving a stale "Слушаю..." on screen.
    if (!transcript) {
      setCaptionRole("assistant");
      setCaption((c) =>
        c === "Слушаю..." ? [...history].reverse().find((m) => m.role === "assistant")?.content ?? OPENING.content : c
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening, interim]);

  function playOpening() {
    primeSpeech();
    hasGreeted.current = true;
    setCaptionRole("assistant");
    setCaption(OPENING.content);
    setSpeakingVariant(Math.floor(Math.random() * 3));
    setSpeakingNow(true);
    speak(OPENING.content).finally(() => setSpeakingNow(false));
  }

  async function converseTurn(userText: string, fromVoice = false) {
    setCaptionRole("user");
    setCaption(userText);
    const next = [...history, { role: "user" as const, content: userText }];
    setHistory(next);
    setThinking(true);
    setCorrection(null);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next, level, topic: "free conversation" }),
      });
      const data = await res.json();
      setHistory((h) => [...h, { role: "assistant", content: data.reply }]);
      setThinking(false);

      // Flash the orb blue (correct) or red (mistake found) before the AI
      // speaks — the color itself is the feedback, not just a text card.
      if (data.correction) {
        setCorrection(data.correction);
        setLastCorrect(false);
        setFeedbackPhase("incorrect");
      } else {
        setCorrection(null);
        setLastCorrect(true);
        setFeedbackPhase("correct");
      }
      await new Promise((r) => setTimeout(r, 1300));
      setFeedbackPhase(null);

      setCaptionRole("assistant");
      setCaption(data.reply);
      if (voiceOn) {
        setSpeakingVariant(Math.floor(Math.random() * 3));
        setSpeakingNow(true);
        await speak(data.reply);
      }
    } catch {
      setHistory((h) => [...h, { role: "assistant", content: "Извини, произошла ошибка. Попробуй ещё раз." }]);
    } finally {
      setThinking(false);
      setSpeakingNow(false);
    }
    if (fromVoice && autoMicRef.current) {
      start();
    }
  }

  const hasGreeted = useRef(false);

  async function handleOrbTap() {
    primeSpeech();
    if (phase === "listening") {
      stop();
      return;
    }
    if (phase !== "idle") return;

    setCorrection(null);
    setLastCorrect(false);

    // First tap: read the greeting aloud (needs a real user gesture) before
    // opening the mic, so the text on screen is always actually spoken.
    if (!hasGreeted.current) {
      hasGreeted.current = true;
      if (voiceOn) {
        setSpeakingVariant(Math.floor(Math.random() * 3));
        setSpeakingNow(true);
        await speak(OPENING.content);
        setSpeakingNow(false);
      }
    }
    start();
  }

  useEffect(() => {
    if (!listening && transcript && transcript !== lastSent.current) {
      lastSent.current = transcript;
      converseTurn(transcript, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening, transcript]);

  function sendTyped() {
    const text = textInput.trim();
    if (!text) return;
    setTextInput("");
    setShowTextInput(false);
    converseTurn(text);
  }

  async function finish() {
    const userText = history
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join(" ");
    const res = await fetch("/api/ai/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: userText }),
    });
    const data = await res.json();
    setScores(data);
    addXp(120);
    setLessonProgress("speaking-free", 100);
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 py-6 sm:p-6 lg:p-8 animate-in max-w-xl mx-auto w-full flex flex-col items-center">
        <ModeTabs />
        <div className="flex items-center justify-between w-full mb-1">
          <h1 className="text-xl font-bold font-display">Разговор с AI</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoMic((v) => !v)}
              title="Микрофон включается сам после ответа AI"
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                autoMic ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-400" : "border-slate-700 text-slate-400"
              }`}
            >
              Авто-микрофон {autoMic ? "вкл" : "выкл"}
            </button>
            <button
              onClick={() => setVoiceOn((v) => !v)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              aria-label={voiceOn ? "Выключить голос" : "Включить голос"}
            >
              {voiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <p className="text-sm text-slate-400 mb-6 text-center">
          Нажми один раз и говори — дальше разговор пойдёт сам, как с живым собеседником.
        </p>

        {voiceWarning && (
          <p className="text-xs text-amber-400 mb-4 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2 w-full text-center">
            ⚠️ {voiceWarning}
          </p>
        )}
        {!supported && (
          <p className="text-xs text-amber-400 mb-4 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2 w-full text-center">
            Голос не поддерживается в этом браузере — используй Chrome/Edge или текст ниже.
          </p>
        )}
        {error && (
          <p className="text-xs text-rose-400 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-2 w-full text-center">
            🎙 {error}
          </p>
        )}

        <VoiceOrb
          phase={phase}
          level={micLevel}
          speakingVariant={speakingVariant}
          onTap={handleOrbTap}
          disabled={thinking || speakingNow || !supported}
        />

        <p className="text-xs mt-4 mb-2 text-slate-500 h-4">
          {phase === "listening" && "Слушаю..."}
          {phase === "thinking" && "Думаю..."}
          {phase === "speaking" && "Говорю..."}
          {phase === "correct" && "Правильно! ✓"}
          {phase === "incorrect" && "Есть ошибка ✗"}
          {phase === "idle" && "Нажми, чтобы говорить"}
        </p>

        <div className="min-h-[64px] max-w-md text-center mb-4">
          <p
            className={`text-base leading-relaxed transition-opacity ${
              captionRole === "user" ? "text-indigo-300" : "text-slate-100"
            }`}
          >
            {caption}
          </p>
        </div>

        {correction && (
          <div className="w-full rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 mb-4">
            <p className="text-xs uppercase tracking-wide text-rose-400 mb-2">Есть ошибка</p>
            <p className="text-sm mb-1">
              <span className="line-through text-rose-400">{correction.before}</span>{" "}
              <span className="text-blue-300">→ {correction.after}</span>
            </p>
            <p className="text-xs text-slate-400">{correction.note}</p>
          </div>
        )}
        {!correction && lastCorrect && (
          <div className="w-full rounded-2xl border border-blue-500/40 bg-blue-500/10 p-4 mb-4 text-center">
            <p className="text-sm text-blue-300">Отлично, без ошибок! ✓</p>
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <button onClick={playOpening} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" /> Приветствие
          </button>
          <button
            onClick={() => setShowHistory((s) => !s)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
          >
            <MessageSquareText className="w-3.5 h-3.5" /> {showHistory ? "Скрыть историю" : "История"}
          </button>
          <button
            onClick={() => setShowTextInput((s) => !s)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
          >
            <Keyboard className="w-3.5 h-3.5" /> Текстом
          </button>
        </div>

        {showTextInput && (
          <div className="flex items-center gap-2 w-full mb-6">
            <input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendTyped()}
              placeholder="Напиши сообщение..."
              className="flex-1 bg-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <button onClick={sendTyped} className="p-2 rounded-lg btn-primary">
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}

        {showHistory && (
          <div className="w-full card p-4 space-y-2 mb-6 max-h-52 overflow-y-auto">
            {history.map((m, i) => (
              <p key={i} className={`text-xs ${m.role === "user" ? "text-indigo-300" : "text-slate-400"}`}>
                <span className="font-semibold">{m.role === "user" ? "Ты: " : "AI: "}</span>
                {m.content}
              </p>
            ))}
          </div>
        )}

        <button
          onClick={finish}
          disabled={history.filter((m) => m.role === "user").length === 0}
          className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl btn-primary text-sm font-medium disabled:opacity-40"
        >
          <Sparkles className="w-4 h-4" /> Завершить и получить оценку
        </button>

        {scores && (
          <div className="mt-6 w-full card p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-3">Анализ речи</p>
            <div className="space-y-3">
              {Object.entries(scores)
                .filter(([k]) => k !== "feedback" && k !== "text")
                .map(([label, val]) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 capitalize">{label}</span>
                      <span className="font-mono">{val as number}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
            {(scores as any).feedback && (
              <p className="mt-4 text-sm text-slate-300 rounded-lg bg-slate-800/70 p-3">💡 {(scores as any).feedback}</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
