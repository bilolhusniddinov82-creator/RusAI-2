"use client";

import { useState } from "react";
import { Check, X, Volume2 } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { READING_PASSAGE, type ReadingWord } from "@/lib/lessons/data";
import { useUserStore } from "@/store/user-store";
import { useLearningStore } from "@/store/learning-store";
import { speak } from "@/lib/speech/tts";

function Paragraph({ text, onWord }: { text: string; onWord: (w: string) => void }) {
  const parts = text.split(/(\s+)/);
  return (
    <p className="leading-relaxed text-slate-200 mb-4">
      {parts.map((part, i) => {
        const clean = part.toLowerCase().replace(/[.,!?]/g, "");
        const isHighlighted = clean in READING_PASSAGE.highlighted;
        if (isHighlighted) {
          return (
            <span
              key={i}
              onClick={() => onWord(clean)}
              className="underline decoration-dotted decoration-indigo-400 text-indigo-300 cursor-pointer hover:text-indigo-200"
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

export default function ReadingPage() {
  const [active, setActive] = useState<ReadingWord | null>(null);
  const [answers, setAnswers] = useState<(string | null)[]>(
    READING_PASSAGE.questions.map(() => null)
  );
  const addXp = useUserStore((s) => s.addXp);
  const setLessonProgress = useLearningStore((s) => s.setLessonProgress);

  function answer(qi: number, opt: string) {
    setAnswers((prev) => {
      const next = prev.map((p, i) => (i === qi ? opt : p));
      const correctCount = next.filter((a, i) => a === READING_PASSAGE.questions[i]?.correct).length;
      if (next.every((a) => a !== null)) {
        addXp(correctCount * 25);
        setLessonProgress("reading-1", 100);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 py-6 sm:p-6 lg:p-8 animate-in max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold font-display">Чтение</h1>
          <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
            {READING_PASSAGE.level}
          </span>
        </div>
        <p className="text-sm text-slate-400 mb-6">
          Нажми на подчёркнутое слово, чтобы увидеть перевод.
        </p>

        <div className="card p-6 mb-6 relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold font-display">{READING_PASSAGE.title}</h2>
            <button
              onClick={() => speak(READING_PASSAGE.paragraphs.join(" "))}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 shrink-0"
            >
              <Volume2 className="w-3.5 h-3.5" /> Слушать весь текст
            </button>
          </div>
          {READING_PASSAGE.paragraphs.map((p, i) => (
            <Paragraph key={i} text={p} onWord={(w) => setActive(READING_PASSAGE.highlighted[w])} />
          ))}

          {active && (
            <div className="mt-2 rounded-xl border border-indigo-500/50 bg-indigo-500/10 p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold">{active.word}</p>
                <button onClick={() => setActive(null)} className="text-slate-400 hover:text-slate-200 text-xs">
                  ✕
                </button>
              </div>
              <p className="text-sm text-slate-300 mb-1">{active.translation}</p>
              <button
                onClick={() => speak(active.word)}
                className="text-xs flex items-center gap-1.5 text-indigo-300 mb-2 hover:text-indigo-200"
              >
                <Volume2 className="w-3.5 h-3.5" /> {active.pronunciation}
              </button>
              <p className="text-xs italic text-slate-400">«{active.example}»</p>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-4">Вопросы на понимание</h2>
          <div className="space-y-6">
            {READING_PASSAGE.questions.map((q, qi) => (
              <div key={q.prompt}>
                <p className="mb-2">{q.prompt}</p>
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const selected = answers[qi] === opt;
                    const isCorrect = opt === q.correct;
                    return (
                      <button
                        key={opt}
                        onClick={() => answer(qi, opt)}
                        disabled={!!answers[qi]}
                        className={`w-full flex items-center justify-between text-left py-2.5 px-4 option ${
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
                {answers[qi] && (
                  <p className="mt-2 text-sm text-slate-400 rounded-lg bg-slate-800/70 p-3">
                    💡 {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
