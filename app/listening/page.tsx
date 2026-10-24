"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Gauge, FileText, Check, X, Volume2 } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { LISTENING_EXERCISE } from "@/lib/lessons/data";
import { useLearningStore } from "@/store/learning-store";
import { useUserStore } from "@/store/user-store";
import { isSpeechSupported, primeSpeech, hasAnyVoice, hasRussianVoice } from "@/lib/speech/tts";

export default function ListeningPage() {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [slow, setSlow] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [voiceWarning, setVoiceWarning] = useState<string | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const setLessonProgress = useLearningStore((s) => s.setLessonProgress);
  const addXp = useUserStore((s) => s.addXp);
  // Rough estimate only used for the progress bar — actual audio length is
  // whatever the browser's speech engine takes to read the transcript.
  const estimatedDuration = Math.max(12, Math.round(LISTENING_EXERCISE.transcript.split(/\s+/).length / 2.5));

  useEffect(() => {
    (async () => {
      if (!isSpeechSupported()) {
        setVoiceWarning("Этот браузер не поддерживает озвучку. Попробуй Chrome или Edge.");
        return;
      }
      const any = await hasAnyVoice();
      if (!any) {
        setVoiceWarning("В этой системе не найдено голосов для озвучки — звук не сможет проиграться.");
        return;
      }
      const ru = await hasRussianVoice();
      if (!ru) setVoiceWarning("Русский голос не найден — текст прозвучит на другом голосе.");
    })();
    return () => {
      window.speechSynthesis?.cancel();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function speakTranscript(fromStart: boolean) {
    if (!isSpeechSupported()) return;
    primeSpeech();
    window.speechSynthesis.cancel();
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (fromStart) setElapsed(0);

    const utter = new SpeechSynthesisUtterance(LISTENING_EXERCISE.transcript);
    utter.lang = "ru-RU";
    utter.rate = slow ? 0.6 : 0.95;
    const voices = window.speechSynthesis.getVoices();
    const ru = voices.find((v) => v.lang.toLowerCase().startsWith("ru"));
    if (ru) utter.voice = ru;

    utter.onstart = () => {
      setPlaying(true);
      const step = 0.5;
      intervalRef.current = setInterval(() => {
        setElapsed((e) => Math.min(estimatedDuration, e + step));
      }, 500);
    };
    utter.onend = () => {
      setPlaying(false);
      setElapsed(estimatedDuration);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    utter.onerror = () => {
      setPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  }

  function togglePlay() {
    if (playing) {
      window.speechSynthesis?.pause();
      setPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else if (window.speechSynthesis?.paused) {
      window.speechSynthesis.resume();
      setPlaying(true);
      intervalRef.current = setInterval(() => {
        setElapsed((e) => Math.min(estimatedDuration, e + 0.5));
      }, 500);
    } else {
      speakTranscript(true);
    }
  }

  function replay() {
    speakTranscript(true);
  }

  function format(sec: number) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function submit(opt: string) {
    setAnswer(opt);
    if (opt === LISTENING_EXERCISE.correct) {
      addXp(50);
      setLessonProgress("listening-1", 100);
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 py-6 sm:p-6 lg:p-8 animate-in max-w-2xl mx-auto w-full">
        <h1 className="text-xl font-bold font-display mb-1">Аудирование</h1>
        <p className="text-sm text-slate-400 mb-4">{LISTENING_EXERCISE.title}</p>

        {voiceWarning && (
          <p className="text-xs text-amber-400 mb-4 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2">
            ⚠️ {voiceWarning}
          </p>
        )}

        <div className="card p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-500 shrink-0"
            >
              {playing ? <Pause className="w-6 h-6 text-accent-fg" /> : <Play className="w-6 h-6 text-accent-fg ml-0.5" />}
            </button>
            <div className="flex-1">
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
                  style={{ width: `${(elapsed / estimatedDuration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>{format(elapsed)}</span>
                <span>~{format(estimatedDuration)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={replay}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:border-indigo-500"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Заново
            </button>
            <button
              onClick={() => {
                setSlow((s) => !s);
                if (playing) speakTranscript(false);
              }}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border ${
                slow ? "border-indigo-500 text-indigo-300 bg-indigo-500/10" : "border-slate-700 text-slate-300"
              }`}
            >
              <Gauge className="w-3.5 h-3.5" /> {slow ? "Медленно" : "Обычная скорость"}
            </button>
            <button
              onClick={() => setShowTranscript((s) => !s)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border ${
                showTranscript ? "border-indigo-500 text-indigo-300 bg-indigo-500/10" : "border-slate-700 text-slate-300"
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Транскрипт
            </button>
          </div>

          {showTranscript && (
            <p className="mt-4 text-sm text-slate-300 whitespace-pre-line rounded-xl bg-slate-800/70 p-4 leading-relaxed">
              {LISTENING_EXERCISE.transcript}
            </p>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-4">{LISTENING_EXERCISE.question}</h2>
          <div className="space-y-2">
            {LISTENING_EXERCISE.options.map((opt) => {
              const isCorrect = opt === LISTENING_EXERCISE.correct;
              const selected = answer === opt;
              return (
                <button
                  key={opt}
                  onClick={() => submit(opt)}
                  disabled={!!answer}
                  className={`w-full flex items-center justify-between text-left py-3 px-4 option ${
                    selected
                      ? isCorrect
                        ? "option-correct"
                        : "option-wrong"
                      : ""
                  }`}
                >
                  {opt}
                  {selected && (isCorrect ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-400" />)}
                </button>
              );
            })}
          </div>
          {answer && (
            <p className="mt-4 text-sm text-slate-400 rounded-lg bg-slate-800/70 p-3">
              💡 {LISTENING_EXERCISE.explanation}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
