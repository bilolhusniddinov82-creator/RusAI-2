"use client";

import Link from "next/link";
import {
  Flame, Star, TrendingUp, Trophy, MessageSquare, BookOpen, ArrowRight,
  GraduationCap, Headphones, Check,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Roadmap } from "@/components/dashboard/roadmap";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useUserStore, useDailyStats } from "@/store/user-store";
import { useLearningStore } from "@/store/learning-store";
import { useT } from "@/lib/i18n/use-t";

const ACHIEVEMENT_META: Record<string, { icon: any; label: string }> = {
  "first-lesson": { icon: Trophy, label: "Первый урок" },
  "7-day-streak": { icon: Flame, label: "7 дней подряд" },
  "500-words": { icon: BookOpen, label: "500 слов" },
  "first-conversation": { icon: MessageSquare, label: "Первый диалог" },
  "master": { icon: Star, label: "Русский мастер" },
};
const ALL_ACHIEVEMENTS = ["first-lesson", "7-day-streak", "500-words", "first-conversation", "master"];

const PLAN = [
  { label: "Повторить 15 слов", href: "/vocabulary", icon: BookOpen, progressKey: null, minutes: 5 },
  { label: "Урок «Прошедшее время»", href: "/learn/lesson/past-tense-1", icon: GraduationCap, progressKey: "past-tense-1", minutes: 8 },
  { label: "5 минут разговора с AI", href: "/speaking", icon: MessageSquare, progressKey: "speaking-free", minutes: 5 },
  { label: "Listening practice", href: "/listening", icon: Headphones, progressKey: "listening-1", minutes: 4 },
];

export default function Dashboard() {
  const { name, level, xp, dailyMinutes } = useUserStore();
  const { streak, minutesToday } = useDailyStats();
  const achievements = useLearningStore((s) => s.achievements);
  const lessonProgress = useLearningStore((s) => s.lessonProgress);
  const pct = Math.min(100, Math.round((minutesToday / dailyMinutes) * 100));
  const t = useT();

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 py-6 sm:p-6 lg:p-8 animate-in">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">
              {t("greeting_prefix")} <span className="text-gradient">{name}</span> 👋
            </h1>
            <p className="text-sm mt-1 text-slate-400">{t("ready")}</p>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-accent-fg text-sm font-semibold shadow-lg shadow-indigo-500/25">
            <Star className="w-4 h-4" /> {level}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="card p-4 sm:p-5 flex items-center gap-4 col-span-2 lg:col-span-1">
            <ProgressRing pct={pct} />
            <div>
              <p className="text-xs text-slate-400">{t("goal_today")}</p>
              <p className="font-semibold font-mono">
                {minutesToday} / {dailyMinutes} мин
              </p>
            </div>
          </div>
          <StatCard icon={Flame} tint="text-orange-400 bg-orange-500/10" label={t("streak")} value={`${streak} ${t("days")}`} />
          <StatCard icon={Star} tint="text-amber-400 bg-amber-500/10" label="XP" value={xp.toLocaleString("ru-RU")} />
          <StatCard icon={TrendingUp} tint="text-indigo-400 bg-indigo-500/10" label={t("level")} value={level} />
        </div>

        <div className="card p-5 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{t("today_plan")}</h3>
            <span className="text-xs text-slate-400 font-mono">
              {PLAN.filter((p) => p.progressKey && lessonProgress[p.progressKey] === 100).length}/{PLAN.length}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2.5 mb-5">
            {PLAN.map(({ label, href, icon: Icon, progressKey, minutes }) => {
              const done = progressKey ? lessonProgress[progressKey] === 100 : false;
              return (
                <Link
                  key={label}
                  href={href}
                  className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-800/40 px-3.5 py-3 transition-all hover:border-indigo-500/50 hover:bg-slate-800/70"
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      done ? "bg-emerald-500/15 text-emerald-400" : "bg-indigo-500/10 text-indigo-400"
                    }`}
                  >
                    {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${done ? "text-slate-400 line-through" : ""}`}>{label}</p>
                    <p className="text-xs text-slate-500">~{minutes} мин</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-400" />
                </Link>
              );
            })}
          </div>
          <Link
            href="/learn/lesson/past-tense-1"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-sm font-medium"
          >
            {t("continue_learning")} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{t("achievements")}</h3>
              <span className="text-xs text-slate-400 font-mono">
                {achievements.length}/{ALL_ACHIEVEMENTS.length}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {ALL_ACHIEVEMENTS.map((id) => {
                const meta = ACHIEVEMENT_META[id];
                const earned = achievements.includes(id);
                const Icon = meta.icon;
                return (
                  <div key={id} className="flex flex-col items-center gap-1.5" title={meta.label}>
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform hover:scale-110 ${
                        earned
                          ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-accent-fg shadow-lg shadow-indigo-500/30"
                          : "bg-slate-800 text-slate-600 border border-dashed border-slate-700"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] text-center leading-tight ${earned ? "text-slate-300" : "text-slate-500"}`}>
                      {meta.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <h3 className="font-semibold mb-6">{t("levels")}</h3>
            <Roadmap />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, tint, label, value }: { icon: any; tint: string; label: string; value: string }) {
  return (
    <div className="card card-hover p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${tint}`}>
          <Icon className="w-4 h-4" />
        </span>
        <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>
      </div>
      <p className="text-xl sm:text-2xl font-bold font-mono">{value}</p>
    </div>
  );
}
