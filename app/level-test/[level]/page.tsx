"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowRight, ArrowLeft, Check, X, Clock, Trophy, BookOpen, GraduationCap,
  MessageSquare, Lock, RotateCcw, FileText, Target,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useUserStore, type Level } from "@/store/user-store";
import { useLearningStore } from "@/store/learning-store";
import { useT } from "@/lib/i18n/use-t";
import type { DictKey } from "@/lib/i18n/dictionary";
import { LEVEL_ORDER } from "@/lib/lessons/data";
import {
  buildLevelTest, nextLevelOf, retryWaitMs, splitWait,
  PASS_PERCENT, QUESTIONS_PER_TEST, type LevelQuestion, type TestSkill,
} from "@/lib/lessons/level-tests";
import { cn } from "@/lib/utils";

type Stage = "intro" | "test" | "result";

const PREP_LINKS = [
  { href: "/vocabulary", key: "sidebar_vocab" as DictKey, icon: BookOpen },
  { href: "/learn/lesson/past-tense-1", key: "sidebar_grammar" as DictKey, icon: GraduationCap },
  { href: "/speaking", key: "sidebar_speaking" as DictKey, icon: MessageSquare },
  { href: "/reading", key: "sidebar_reading" as DictKey, icon: FileText },
];

export default function LevelTestPage() {
  const t = useT();
  const params = useParams<{ level: string }>();
  const target = (params.level ?? "").toUpperCase();

  const level = useUserStore((s) => s.level);
  const setField = useUserStore((s) => s.setOnboardingField);
  const addXp = useUserStore((s) => s.addXp);
  const attempt = useLearningStore((s) => s.levelTests[target]);
  const recordLevelTest = useLearningStore((s) => s.recordLevelTest);
  const unlockAchievement = useLearningStore((s) => s.unlockAchievement);

  const [stage, setStage] = useState<Stage>("intro");
  const [questions, setQuestions] = useState<LevelQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [fromLevel, setFromLevel] = useState<string>(level);
  // `now` is only known on the client; keeping it in state avoids a
  // server/client mismatch and lets the countdown tick.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const expected = nextLevelOf(stage === "intro" ? level : fromLevel);
  const wait = now ? retryWaitMs(attempt, now) : 0;
  const alreadyHave = LEVEL_ORDER.indexOf(target as Level) <= LEVEL_ORDER.indexOf(level);

  function start() {
    setFromLevel(level);
    setQuestions(buildLevelTest(target));
    setAnswers(Array(QUESTIONS_PER_TEST).fill(null));
    setCurrent(0);
    setStage("test");
  }

  function choose(opt: string) {
    setAnswers((prev) => prev.map((a, i) => (i === current ? opt : a)));
  }

  const correctCount = answers.filter((a, i) => questions[i] && a === questions[i].correct).length;
  const score = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
  const passed = score >= PASS_PERCENT;

  function finish() {
    recordLevelTest(target, { at: Date.now(), score, passed });
    if (passed) {
      setField({ level: target as Level });
      addXp(500);
      if (target === "C2") unlockAchievement("master");
    }
    setNow(Date.now());
    setStage("result");
  }

  const bySkill = useMemo(() => {
    const out: Partial<Record<TestSkill, { right: number; total: number }>> = {};
    questions.forEach((q, i) => {
      const s = (out[q.skill] ??= { right: 0, total: 0 });
      s.total++;
      if (answers[i] === q.correct) s.right++;
    });
    return out;
  }, [questions, answers]);

  const shell = (children: React.ReactNode) => (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 py-6 sm:p-6 lg:p-8 animate-in">
        <div className="max-w-2xl mx-auto">{children}</div>
      </main>
    </div>
  );

  // ---- Guards: wrong level, already passed, cooldown ------------------------

  if (stage === "intro" && (!expected || target !== expected)) {
    return shell(
      <div className="card rounded-3xl p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
          {alreadyHave ? <Check className="w-7 h-7 text-emerald-400" /> : <Lock className="w-7 h-7" />}
        </div>
        <p className="text-lg font-semibold mb-2">
          {!expected ? t("lt_max_level") : alreadyHave ? `${target} ✓` : t("unlock_hint")}
        </p>
        {expected && (
          <Link href={`/level-test/${expected}`} className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl btn-primary text-sm font-medium">
            {t("lt_exam")} {expected} <ArrowRight className="w-4 h-4" />
          </Link>
        )}
        <Link href="/dashboard" className="block mt-4 text-sm text-slate-400 hover:text-slate-200">
          ← {t("back_to_dashboard")}
        </Link>
      </div>
    );
  }

  if (stage === "intro" && wait > 0) {
    const w = splitWait(wait);
    return shell(
      <div className="space-y-5">
        <div className="card rounded-3xl p-6 sm:p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Clock className="w-7 h-7" />
          </div>
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
            {t("lt_exam")} {level} → {target}
          </p>
          <p className="text-lg font-semibold mb-5">{t("lt_retry_in")}</p>
          <div className="flex justify-center gap-3 mb-5">
            {[
              [w.days, t("lt_days")],
              [w.hours, t("lt_hours")],
              [w.minutes, t("lt_minutes")],
            ].map(([n, label]) => (
              <div key={String(label)} className="w-20 rounded-2xl bg-slate-800/70 border border-slate-700 py-3">
                <p className="text-3xl font-bold font-mono">{n}</p>
                <p className="text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
          {attempt && (
            <p className="text-sm text-slate-400">
              {t("lt_last_score")}: <span className="font-mono font-semibold text-rose-400">{attempt.score}%</span> · {t("lt_pass_mark")}:{" "}
              <span className="font-mono">{PASS_PERCENT}%</span>
            </p>
          )}
        </div>
        <PrepCard t={t} />
      </div>
    );
  }

  // ---- Intro ----------------------------------------------------------------

  if (stage === "intro") {
    return shell(
      <div className="card rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <LevelBadge code={level} muted />
          <ArrowRight className="w-5 h-5 text-slate-500" />
          <LevelBadge code={target} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-center mb-2">
          {t("lt_exam")}: {target}
        </h1>
        <p className="text-slate-400 text-center mb-8">{t("lt_ready_q")}</p>

        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="rounded-2xl bg-slate-800/60 p-4">
            <p className="text-2xl font-bold font-mono">{QUESTIONS_PER_TEST}</p>
            <p className="text-xs text-slate-400">{t("lt_questions")}</p>
          </div>
          <div className="rounded-2xl bg-slate-800/60 p-4">
            <p className="text-2xl font-bold font-mono">{PASS_PERCENT}%</p>
            <p className="text-xs text-slate-400">{t("lt_pass_mark")}</p>
          </div>
          <div className="rounded-2xl bg-slate-800/60 p-4">
            <p className="text-2xl font-bold font-mono">+500</p>
            <p className="text-xs text-slate-400">XP</p>
          </div>
        </div>

        <p className="text-sm text-amber-400 rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-3 mb-6 flex items-start gap-2">
          <Clock className="w-4 h-4 shrink-0 mt-0.5" /> {t("lt_rule")}
        </p>

        <button onClick={start} className="group w-full py-4 rounded-2xl btn-primary font-semibold text-lg flex items-center justify-center gap-2">
          {t("lt_start")} <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    );
  }

  // ---- Test -----------------------------------------------------------------

  if (stage === "test") {
    const q = questions[current];
    const isLast = current === questions.length - 1;
    return shell(
      <div>
        <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
          <span className="font-semibold">
            {t("lt_exam")} {target}
          </span>
          <span className="font-mono">
            {t("lt_question")} {current + 1} / {questions.length}
          </span>
        </div>
        <div className="flex gap-1 mb-6">
          {questions.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i === current ? "bg-indigo-500" : answers[i] ? "bg-indigo-500/40" : "bg-slate-800"
              )}
            />
          ))}
        </div>

        <div key={current} className="card rounded-3xl p-6 sm:p-8 animate-in">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 mb-4">
            {t(`skill_${q.skill}` as DictKey)}
          </span>
          {q.passage && (
            <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-4 mb-5">
              <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1.5">{t("lt_read_text")}</p>
              <p className="leading-relaxed text-slate-200">{q.passage}</p>
            </div>
          )}
          <h2 className="text-lg sm:text-xl font-semibold mb-5 leading-relaxed">{q.prompt}</h2>
          <div className="space-y-2.5">
            {q.options.map((opt, i) => (
              <button
                key={opt}
                onClick={() => choose(opt)}
                className={cn("w-full text-left py-3.5 px-4 option flex items-center gap-3", answers[current] === opt && "option-selected")}
              >
                <span
                  className={cn(
                    "w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold shrink-0",
                    answers[current] === opt ? "border-indigo-500 bg-indigo-500 text-accent-fg" : "border-slate-600 text-slate-400"
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="px-4 py-3 rounded-xl btn-ghost text-sm flex items-center gap-2 disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          {isLast ? (
            <button
              onClick={finish}
              disabled={answers.some((a) => !a)}
              className="px-6 py-3 rounded-xl btn-primary font-medium flex items-center gap-2"
            >
              {t("lt_finish")} <Check className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setCurrent((c) => c + 1)}
              disabled={!answers[current]}
              className="px-6 py-3 rounded-xl btn-primary font-medium flex items-center gap-2"
            >
              {t("next")} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---- Result ---------------------------------------------------------------

  const mistakes = questions
    .map((q, i) => ({ q, given: answers[i] }))
    .filter(({ q, given }) => given !== q.correct);
  const w = splitWait(retryWaitMs({ at: attempt?.at ?? Date.now(), passed }, now ?? Date.now()));

  return shell(
    <div className="space-y-5 animate-in">
      <div className={cn("card rounded-3xl p-6 sm:p-8 text-center", passed ? "border-emerald-500/40" : "border-rose-500/30")}>
        <div className="flex justify-center mb-4">
          <ProgressRing pct={score} size={120} />
        </div>
        {passed ? (
          <>
            <div className="inline-flex items-center gap-2 text-emerald-400 font-semibold mb-2">
              <Trophy className="w-5 h-5" /> {t("lt_passed")}
            </div>
            <div className="flex items-center justify-center gap-3 my-3">
              <LevelBadge code={fromLevel} muted />
              <ArrowRight className="w-5 h-5 text-slate-500" />
              <LevelBadge code={target} />
            </div>
            <p className="text-sm text-slate-400">+500 XP</p>
          </>
        ) : (
          <>
            <p className="text-xl font-bold mb-1">{t("lt_failed")}</p>
            <p className="text-sm text-slate-400 mb-4">
              {t("lt_your_score")}: <span className="font-mono text-rose-400 font-semibold">{score}%</span> · {t("lt_pass_mark")}:{" "}
              <span className="font-mono">{PASS_PERCENT}%</span>
            </p>
            <p className="inline-flex items-center gap-2 text-sm text-amber-400 rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-2">
              <Clock className="w-4 h-4" /> {t("lt_retry_in")}: {w.days} {t("lt_days")} {w.hours} {t("lt_hours")}
            </p>
          </>
        )}

        <div className="grid grid-cols-3 gap-3 mt-6">
          {(Object.keys(bySkill) as TestSkill[]).map((skill) => {
            const s = bySkill[skill]!;
            const pct = Math.round((s.right / s.total) * 100);
            return (
              <div key={skill} className="rounded-xl bg-slate-800/60 p-3">
                <p className="text-[11px] text-slate-400 mb-1">{t(`skill_${skill}` as DictKey)}</p>
                <p className={cn("text-lg font-bold font-mono", pct >= PASS_PERCENT ? "text-emerald-400" : "text-amber-400")}>
                  {s.right}/{s.total}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <p className="font-semibold mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-400" /> {t("lt_mistakes")}
        </p>
        {mistakes.length === 0 ? (
          <p className="text-sm text-emerald-400">{t("lt_all_correct")}</p>
        ) : (
          <div className="space-y-3">
            {mistakes.map(({ q, given }, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                {q.passage && <p className="text-xs text-slate-500 italic mb-2 line-clamp-2">{q.passage}</p>}
                <p className="text-sm font-medium mb-2">{q.prompt}</p>
                <p className="text-sm flex items-start gap-2 text-rose-400">
                  <X className="w-4 h-4 shrink-0 mt-0.5" /> {t("lt_your_answer")}: {given}
                </p>
                <p className="text-sm flex items-start gap-2 text-emerald-400">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" /> {t("lt_correct_answer")}: {q.correct}
                </p>
                <p className="text-xs text-slate-400 mt-2">💡 {q.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {!passed && <PrepCard t={t} />}

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/dashboard" className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2">
          {t("back_to_dashboard")} <ArrowRight className="w-4 h-4" />
        </Link>
        {passed && nextLevelOf(target) && (
          <Link
            href={`/level-test/${nextLevelOf(target)}`}
            onClick={() => setStage("intro")}
            className="flex-1 py-3 rounded-xl btn-ghost font-medium flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> {t("lt_next_level")}: {nextLevelOf(target)}
          </Link>
        )}
      </div>
    </div>
  );
}

function LevelBadge({ code, muted }: { code: string; muted?: boolean }) {
  return (
    <span
      className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold font-display",
        muted ? "bg-slate-800 text-slate-400 border border-slate-700" : "bg-gradient-to-br from-indigo-500 to-violet-500 text-accent-fg shadow-lg shadow-indigo-500/30"
      )}
    >
      {code}
    </span>
  );
}

function PrepCard({ t }: { t: (k: DictKey) => string }) {
  return (
    <div className="card p-5 sm:p-6">
      <p className="font-semibold mb-1">{t("lt_weak")}</p>
      <p className="text-sm text-slate-400 mb-4">{t("lt_prepare")}</p>
      <div className="grid grid-cols-2 gap-2.5">
        {PREP_LINKS.map(({ href, key, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-800/40 px-3.5 py-3 text-sm font-medium transition-colors hover:border-indigo-500/50"
          >
            <Icon className="w-4 h-4 text-indigo-400" /> {t(key)}
          </Link>
        ))}
      </div>
    </div>
  );
}
