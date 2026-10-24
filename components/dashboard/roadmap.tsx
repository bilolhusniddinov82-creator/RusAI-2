"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, ArrowRight, Clock, Trophy, GraduationCap } from "lucide-react";
import { getRoadmap } from "@/lib/lessons/data";
import { nextLevelOf, retryWaitMs, splitWait, PASS_PERCENT } from "@/lib/lessons/level-tests";
import { useUserStore } from "@/store/user-store";
import { useLearningStore } from "@/store/learning-store";
import { useT } from "@/lib/i18n/use-t";
import { cn } from "@/lib/utils";

export function Roadmap() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(null);
  const level = useUserStore((s) => s.level);
  const roadmap = getRoadmap(level);
  const next = nextLevelOf(level);

  return (
    <div>
      <div className="relative">
        <div className="absolute left-[8%] right-[8%] top-5 sm:top-6 h-0.5 bg-gradient-to-r from-emerald-500/50 via-indigo-500/40 to-slate-800" />
        <div className="relative grid grid-cols-6 gap-1 sm:gap-2">
          {roadmap.map((lvl, idx) => {
            const isNext = lvl.code === next;
            return (
              <div key={lvl.code} className="flex flex-col items-center">
                <button
                  onClick={() => setOpen(open === idx ? null : idx)}
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all z-10",
                    lvl.status === "done" && "bg-emerald-500 border-emerald-400 text-white hover:scale-105",
                    lvl.status === "current" &&
                      "bg-gradient-to-br from-indigo-500 to-violet-500 border-indigo-300 text-accent-fg shadow-lg shadow-indigo-500/30 scale-110",
                    lvl.status === "locked" && !isNext && "bg-slate-800 border-slate-700 text-slate-500",
                    // The next level is "knockable": dashed ring invites taking its exam.
                    isNext && "bg-slate-800 border-dashed border-indigo-500/70 text-indigo-400 hover:scale-105"
                  )}
                >
                  {lvl.status === "locked" ? <Lock className="w-4 h-4" /> : lvl.code}
                </button>
                <span className={cn("text-[10px] sm:text-xs mt-2 text-center leading-tight", isNext ? "text-indigo-400" : "text-slate-400")}>
                  {lvl.name}
                </span>
                {open === idx && (
                  <div className="absolute mt-14 sm:mt-16 w-44 p-3 animate-in rounded-xl border border-slate-700 bg-slate-900 text-xs text-slate-300 z-20 shadow-xl">
                    {isNext ? (
                      <Link href={`/level-test/${lvl.code}`} className="flex items-center gap-1.5 text-indigo-400 font-semibold hover:text-indigo-300">
                        {t("lt_exam")} {lvl.code} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : lvl.status === "locked" ? (
                      t("unlock_hint")
                    ) : (
                      `${t("level_progress")}: ${lvl.pct}%`
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <LevelUpCard />
    </div>
  );
}

// Call-to-action for the next level's exam, or the 7-day countdown after a failed attempt.
export function LevelUpCard() {
  const t = useT();
  const level = useUserStore((s) => s.level);
  const next = nextLevelOf(level);
  const attempt = useLearningStore((s) => (next ? s.levelTests[next] : undefined));
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!next) {
    return (
      <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center gap-3">
        <Trophy className="w-5 h-5 text-emerald-400" />
        <p className="text-sm text-emerald-400 font-medium">{t("lt_max_level")}</p>
      </div>
    );
  }

  const wait = now ? retryWaitMs(attempt, now) : 0;
  const w = splitWait(wait);

  return (
    <div
      className={cn(
        "mt-8 rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center gap-4",
        wait > 0 ? "border-amber-500/30 bg-amber-500/5" : "border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-violet-500/5"
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
            wait > 0 ? "bg-amber-500/15 text-amber-400" : "bg-indigo-500/15 text-indigo-400"
          )}
        >
          {wait > 0 ? <Clock className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {t("lt_next_level")}: {level} → {next}
          </p>
          <p className="text-xs text-slate-400">
            {wait > 0
              ? `${t("lt_retry_in")}: ${w.days} ${t("lt_days")} ${w.hours} ${t("lt_hours")} ${w.minutes} ${t("lt_minutes")}`
              : attempt && !attempt.passed
              ? `${t("lt_last_score")}: ${attempt.score}% · ${t("lt_pass_mark")}: ${PASS_PERCENT}%`
              : t("lt_ready_q")}
          </p>
        </div>
      </div>
      {wait > 0 ? (
        <Link href={`/level-test/${next}`} className="px-4 py-2.5 rounded-xl btn-ghost text-sm font-medium text-center shrink-0">
          {t("lt_prepare").split(":")[0]}
        </Link>
      ) : (
        <Link
          href={`/level-test/${next}`}
          className="group px-5 py-2.5 rounded-xl btn-primary text-sm font-medium flex items-center justify-center gap-2 shrink-0"
        >
          {t("lt_start")} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
