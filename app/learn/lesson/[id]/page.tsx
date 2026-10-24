"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mic, Check, X, ArrowRight, Volume2 } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { AITutorPanel } from "@/components/ai/ai-tutor-panel";
import { getLessonById, getNextLessonId } from "@/lib/lessons/data";
import { useLearningStore } from "@/store/learning-store";
import { useUserStore } from "@/store/user-store";
import { speak } from "@/lib/speech/tts";
import { useSpeechRecognition } from "@/lib/speech/stt";

export default function LessonPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const lesson = getLessonById(params.id);
  const nextLessonId = getNextLessonId(lesson.id);

  const [stepIndex, setStepIndex] = useState(0);
  const [exerciseAnswer, setExerciseAnswer] = useState<string | null>(null);
  const [testAnswers, setTestAnswers] = useState<(string | null)[]>(
    lesson.miniTest.map(() => null)
  );
  const [speakingDone, setSpeakingDone] = useState(false);
  const [scores, setScores] = useState<{ pronunciation: number; grammar: number; vocabulary: number; fluency: number } | null>(null);
  const { listening, transcript, start, stop, supported } = useSpeechRecognition();

  const setLessonProgress = useLearningStore((s) => s.setLessonProgress);
  const unlockAchievement = useLearningStore((s) => s.unlockAchievement);
  const addXp = useUserStore((s) => s.addXp);
  const addMinutes = useUserStore((s) => s.addMinutes);

  // Reset step state whenever the lesson itself changes (e.g. navigating
  // straight from one lesson's results screen into the next lesson).
  useEffect(() => {
    setStepIndex(0);
    setExerciseAnswer(null);
    setTestAnswers(lesson.miniTest.map(() => null));
    setSpeakingDone(false);
    setScores(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  const step = lesson.steps[stepIndex];
  const pct = Math.round(((stepIndex + 1) / lesson.steps.length) * 100);

  function next() {
    setLessonProgress(lesson.id, Math.min(100, pct));
    if (stepIndex + 1 < lesson.steps.length) {
      setStepIndex(stepIndex + 1);
    }
  }

  async function runSpeaking() {
    const res = await fetch("/api/ai/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: transcript || "demo speaking sample" }),
    });
    const data = await res.json();
    setScores(data);
    setSpeakingDone(true);
    unlockAchievement("first-conversation");
  }

  function toggleRecording() {
    if (listening) {
      stop();
      runSpeaking();
    } else {
      setSpeakingDone(false);
      start();
    }
  }

  function finishLesson() {
    addXp(150);
    addMinutes(15);
    setLessonProgress(lesson.id, 100);
    unlockAchievement("first-lesson");
    router.push(nextLessonId ? `/learn/lesson/${nextLessonId}` : "/dashboard");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 grid lg:grid-cols-[1fr_360px]">
        <div className="px-4 py-6 sm:p-6 lg:p-8 min-w-0 animate-in">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold font-display">{lesson.title}</h1>
            <span className="text-xs text-slate-400 font-mono">{pct}% завершено</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="card p-6 min-h-[360px]">
            {step.type === "explanation" && (
              <div>
                <h2 className="font-semibold mb-3">Объяснение</h2>
                <p className="text-slate-300 leading-relaxed">{lesson.explanation}</p>
              </div>
            )}

            {step.type === "examples" && (
              <div>
                <h2 className="font-semibold mb-4">Примеры</h2>
                <div className="space-y-3">
                  {lesson.examples.map((ex) => (
                    <div key={ex.ru} className="flex items-center justify-between rounded-xl bg-slate-800/70 px-4 py-3">
                      <span>{ex.ru}</span>
                      <span className="text-xs text-slate-400">{ex.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step.type === "vocabulary" && (
              <div>
                <h2 className="font-semibold mb-4">Слова</h2>
                <div className="space-y-3">
                  {lesson.vocabulary.map((v) => (
                    <div key={v.word} className="flex items-center justify-between rounded-xl bg-slate-800/70 px-4 py-3">
                      <button
                        onClick={() => speak(v.word)}
                        className="flex items-center gap-2 font-medium hover:text-indigo-300"
                      >
                        <Volume2 className="w-4 h-4 text-indigo-400" /> {v.word}
                      </button>
                      <span className="text-sm text-slate-400">{v.translation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step.type === "exercise" && (
              <div>
                <h2 className="font-semibold mb-4">Выберите правильный вариант</h2>
                <p className="mb-4">{lesson.exercise.prompt}</p>
                <div className="space-y-2">
                  {lesson.exercise.options.map((opt) => {
                    const isCorrect = opt === lesson.exercise.correct;
                    const selected = exerciseAnswer === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => setExerciseAnswer(opt)}
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
                {exerciseAnswer && (
                  <p className="mt-4 text-sm text-slate-400 rounded-lg bg-slate-800/70 p-3">
                    💡 {lesson.exercise.explanation}
                  </p>
                )}
              </div>
            )}

            {step.type === "speaking" && (
              <div className="text-center py-6">
                <h2 className="font-semibold mb-4">Расскажи о своём обычном дне</h2>
                {!supported && (
                  <p className="text-xs text-amber-400 mb-3">
                    Голосовой ввод не поддерживается в этом браузере — попробуй Chrome или Edge.
                  </p>
                )}
                <button
                  onClick={toggleRecording}
                  className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    listening
                      ? "bg-rose-500 text-white animate-pulse"
                      : "bg-gradient-to-br from-indigo-500 to-violet-500 text-accent-fg hover:scale-105"
                  }`}
                >
                  <Mic className="w-6 h-6" />
                </button>
                <p className="text-xs mt-3 text-slate-500">
                  {listening ? "Слушаю... нажми ещё раз, чтобы закончить" : "Начать говорить"}
                </p>
                {transcript && (
                  <p className="mt-4 text-sm text-slate-300 rounded-lg bg-slate-800/70 p-3 max-w-sm mx-auto">
                    Ты сказал: «{transcript}»
                  </p>
                )}
                {speakingDone && scores && (
                  <div className="mt-6 space-y-3 text-left max-w-sm mx-auto">
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
                )}
              </div>
            )}

            {step.type === "test" && (
              <div>
                <h2 className="font-semibold mb-4">Мини-тест</h2>
                <div className="space-y-6">
                  {lesson.miniTest.map((q, qi) => (
                    <div key={q.prompt}>
                      <p className="mb-2">{q.prompt}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {q.options.map((opt) => {
                          const selected = testAnswers[qi] === opt;
                          const isCorrect = opt === q.correct;
                          return (
                            <button
                              key={opt}
                              onClick={() =>
                                setTestAnswers((prev) => prev.map((p, i) => (i === qi ? opt : p)))
                              }
                              className={`py-2 rounded-lg text-sm option ${
                                selected
                                  ? isCorrect
                                    ? "option-correct"
                                    : "option-wrong"
                                  : ""
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step.type === "results" && (
              <div className="text-center py-6">
                <h2 className="text-2xl font-bold mb-2 font-display">Отличная работа!</h2>
                <p className="text-slate-400 mb-6">Ты стал ближе к следующему уровню.</p>
                <div className="text-4xl font-bold font-mono mb-8 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  +150 XP
                </div>
                <button
                  onClick={finishLesson}
                  className="px-6 py-3 rounded-xl btn-primary font-medium inline-flex items-center gap-2"
                >
                  {nextLessonId ? `Следующий урок: ${getLessonById(nextLessonId).title}` : "В личный кабинет"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {step.type !== "results" && (
            <button
              onClick={next}
              className="mt-6 px-6 py-3 rounded-xl btn-primary font-medium inline-flex items-center gap-2"
            >
              Продолжить <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="p-6 hidden lg:block">
          <div className="sticky top-6 h-[calc(100vh-3rem)]">
            <AITutorPanel topic={lesson.title} />
          </div>
        </div>
      </main>
    </div>
  );
}
