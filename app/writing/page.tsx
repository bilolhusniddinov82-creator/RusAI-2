"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { useUserStore } from "@/store/user-store";
import { useLearningStore } from "@/store/learning-store";

const PROMPT = "Расскажи о своём последнем выходном дне.";

interface Issue { before: string; after: string; note: string; }
interface Result {
  corrected: string;
  issues: Issue[];
  feedback: string;
  scores: { grammar: number; vocabulary: number; naturalness: number };
}

export default function WritingPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const addXp = useUserStore((s) => s.addXp);
  const setLessonProgress = useLearningStore((s) => s.setLessonProgress);

  async function check() {
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/writing", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data);
      addXp(80);
      setLessonProgress("writing-1", 100);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 py-6 sm:p-6 lg:p-8 animate-in max-w-2xl mx-auto w-full">
        <h1 className="text-xl font-bold font-display mb-1">Письмо</h1>
        <p className="text-sm text-slate-400 mb-6">{PROMPT}</p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напиши здесь..."
          rows={7}
          className="input p-4 text-sm leading-relaxed mb-4 resize-y min-h-[160px]"
        />

        <button
          onClick={check}
          disabled={!text.trim() || loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-sm font-medium disabled:opacity-40 mb-6"
        >
          <Sparkles className="w-4 h-4" /> {loading ? "Проверяю…" : "Проверить с AI"}
        </button>

        {result && (
          <div className="space-y-4">
            <div className="card p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Отзыв AI</p>
              <p className="text-sm text-slate-300 mb-4">{result.feedback}</p>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(result.scores).map(([label, val]) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 capitalize">{label}</span>
                      <span className="font-mono">{val}%</span>
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
            </div>

            {result.issues.length > 0 && (
              <div className="card p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-3">Что можно улучшить</p>
                <div className="space-y-3">
                  {result.issues.map((issue, i) => (
                    <div key={i} className="rounded-xl bg-slate-800/70 p-3 text-sm">
                      <p className="mb-1">
                        <span className="line-through text-rose-400">{issue.before}</span>{" "}
                        <span className="text-emerald-400">→ {issue.after}</span>
                      </p>
                      <p className="text-xs text-slate-400">{issue.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
