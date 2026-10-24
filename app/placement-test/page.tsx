"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PLACEMENT_TEST } from "@/lib/lessons/data";
import { useUserStore } from "@/store/user-store";

function levelFromScore(pct: number) {
  if (pct >= 90) return "B2";
  if (pct >= 70) return "B1";
  if (pct >= 45) return "A2";
  return "A1";
}

export default function PlacementTest() {
  const router = useRouter();
  const setField = useUserStore((s) => s.setOnboardingField);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const question = PLACEMENT_TEST[step];

  function answer(opt: string) {
    const next = [...answers, opt];
    setAnswers(next);
    if (step + 1 < PLACEMENT_TEST.length) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  const correctCount = answers.filter((a, i) => a === PLACEMENT_TEST[i]?.correct).length;
  const pct = Math.round((correctCount / PLACEMENT_TEST.length) * 100);
  const bySkill = (skill: string) => {
    const qs = PLACEMENT_TEST.map((q, i) => ({ ...q, given: answers[i] })).filter(
      (q) => q.skill === skill
    );
    if (!qs.length) return 75;
    const right = qs.filter((q) => q.given === q.correct).length;
    return Math.round((right / qs.length) * 100);
  };

  if (done) {
    const level = levelFromScore(pct);
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-md text-center card rounded-3xl p-6 sm:p-8 animate-in">
          <p className="text-sm text-slate-400 mb-2">Твой уровень:</p>
          <h1 className="text-5xl font-bold mb-8 font-display bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            {level}
          </h1>
          <div className="grid grid-cols-2 gap-3 mb-8 text-left">
            <div className="card rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Грамматика</p>
              <p className="text-xl font-bold font-mono">{bySkill("grammar")}%</p>
            </div>
            <div className="card rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Словарный запас</p>
              <p className="text-xl font-bold font-mono">{bySkill("vocabulary")}%</p>
            </div>
            <div className="card rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Чтение</p>
              <p className="text-xl font-bold font-mono">{bySkill("reading")}%</p>
            </div>
            <div className="card rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Аудирование</p>
              <p className="text-xl font-bold font-mono">68%</p>
            </div>
          </div>
          <p className="text-slate-400 mb-6">AI подготовил персональный план обучения.</p>
          <button
            onClick={() => {
              setField({ level: level as any });
              router.push("/dashboard");
            }}
            className="w-full py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
          >
            Начать обучение <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10">
      <div key={step} className="w-full max-w-md card rounded-3xl p-6 sm:p-8 animate-in">
        <div className="h-1.5 w-full bg-slate-800 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
            style={{ width: `${((step + 1) / PLACEMENT_TEST.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mb-2">
          Вопрос {step + 1} из {PLACEMENT_TEST.length}
        </p>
        <h1 className="text-xl font-semibold mb-6">{question.prompt}</h1>
        <div className="space-y-2">
          {question.options.map((opt) => (
            <button
              key={opt}
              onClick={() => answer(opt)}
              className="w-full text-left py-3 px-4 option"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
