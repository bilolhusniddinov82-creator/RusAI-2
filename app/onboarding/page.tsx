"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useUserStore, type Level } from "@/store/user-store";
import { useLearningStore } from "@/store/learning-store";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const GOALS = ["Разговор", "Работа", "Учёба", "Переезд", "Экзамен", "Для себя"];
const MINUTES = [10, 20, 30, 45];

export default function Onboarding() {
  const router = useRouter();
  const setField = useUserStore((s) => s.setOnboardingField);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const resetProgress = useUserStore((s) => s.resetProgress);
  const resetLearning = useLearningStore((s) => s.resetAll);

  const [screen, setScreen] = useState(0);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<Level | "unknown" | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [minutes, setMinutes] = useState<number | null>(null);

  function finish() {
    // Onboarding creates a new learner: nothing from a previous person on
    // this browser (XP, streak, level tests, words) should carry over.
    resetProgress();
    resetLearning();
    setField({
      name: name || "Ученик",
      level: level && level !== "unknown" ? level : "A1",
      goal: goal ?? "Для себя",
      dailyMinutes: minutes ?? 20,
    });
    completeOnboarding();
    if (level === "unknown") {
      router.push("/placement-test");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10">
      <div className="w-full max-w-md card rounded-3xl p-6 sm:p-8 animate-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Logo size={26} />
            <span className="font-bold font-display">RusAI</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">{screen + 1} / 4</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
            style={{ width: `${((screen + 1) / 4) * 100}%` }}
          />
        </div>
        {screen > 0 && (
          <button
            onClick={() => setScreen(screen - 1)}
            className="mb-4 -mt-2 text-sm text-slate-400 hover:text-slate-100 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Назад
          </button>
        )}
        {screen === 0 && (
          <div key={screen} className="animate-in">
            <h1 className="text-2xl font-bold mb-6 font-display">Как тебя зовут?</h1>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && setScreen(1)}
              placeholder="Твоё имя"
              className="input mb-6"
            />
            <button
              disabled={!name.trim()}
              onClick={() => setScreen(1)}
              className="w-full py-3 rounded-xl btn-primary font-medium disabled:opacity-40 flex items-center justify-center gap-2"
            >
              Далее <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {screen === 1 && (
          <div key={screen} className="animate-in">
            <h1 className="text-2xl font-bold mb-6 font-display">Какой у тебя уровень русского?</h1>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`py-3 option font-semibold ${
                    level === l ? "option-selected" : "text-slate-300"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              onClick={() => setLevel("unknown")}
              className={`w-full py-3 option font-medium mb-6 ${
                level === "unknown" ? "option-selected" : "text-slate-300"
              }`}
            >
              Не знаю
            </button>
            <button
              disabled={!level}
              onClick={() => setScreen(2)}
              className="w-full py-3 rounded-xl btn-primary font-medium disabled:opacity-40 flex items-center justify-center gap-2"
            >
              Далее <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {screen === 2 && (
          <div key={screen} className="animate-in">
            <h1 className="text-2xl font-bold mb-6 font-display">Зачем тебе русский?</h1>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`py-3 option font-medium ${
                    goal === g ? "option-selected" : "text-slate-300"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <button
              disabled={!goal}
              onClick={() => setScreen(3)}
              className="w-full py-3 rounded-xl btn-primary font-medium disabled:opacity-40 flex items-center justify-center gap-2"
            >
              Далее <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {screen === 3 && (
          <div key={screen} className="animate-in">
            <h1 className="text-2xl font-bold mb-6 font-display">
              Сколько времени ты хочешь заниматься?
            </h1>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {MINUTES.map((m) => (
                <button
                  key={m}
                  onClick={() => setMinutes(m)}
                  className={`py-3 option font-medium ${
                    minutes === m ? "option-selected" : "text-slate-300"
                  }`}
                >
                  {m === 45 ? "45+ мин" : `${m} мин`}
                </button>
              ))}
            </div>
            <button
              disabled={!minutes}
              onClick={finish}
              className="w-full py-3 rounded-xl btn-primary font-medium disabled:opacity-40 flex items-center justify-center gap-2"
            >
              Создать мой персональный план <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
