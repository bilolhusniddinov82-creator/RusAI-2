"use client";

import { Clock, Flame, Target, TrendingUp } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

const SKILLS = [
  { skill: "Слова", value: 82 },
  { skill: "Грамматика", value: 71 },
  { skill: "Говорение", value: 64 },
  { skill: "Аудирование", value: 78 },
  { skill: "Чтение", value: 86 },
];

const WEEKLY = [
  { day: "Пн", min: 18 },
  { day: "Вт", min: 22 },
  { day: "Ср", min: 15 },
  { day: "Чт", min: 25 },
  { day: "Пт", min: 20 },
  { day: "Сб", min: 10 },
  { day: "Вс", min: 15 },
];

const totalMinutes = WEEKLY.reduce((s, d) => s + d.min, 0);
const weakest = SKILLS.reduce((a, b) => (b.value < a.value ? b : a));

// Recharts takes plain color strings; these mid-tones read on both themes.
const AXIS = "#94a3b8";
const GRID = "rgba(148, 163, 184, 0.2)";

export default function ProgressPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 py-6 sm:p-6 lg:p-8 animate-in">
        <h1 className="text-2xl font-bold font-display mb-1">Твой прогресс</h1>
        <p className="text-sm text-slate-400 mb-6 sm:mb-8">Статистика за последнюю неделю</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Summary icon={Clock} tint="text-indigo-400 bg-indigo-500/10" label="Минут за неделю" value={`${totalMinutes}`} />
          <Summary icon={Target} tint="text-emerald-400 bg-emerald-500/10" label="Среднее в день" value={`${Math.round(totalMinutes / 7)} мин`} />
          <Summary icon={Flame} tint="text-orange-400 bg-orange-500/10" label="Лучший день" value={`${Math.max(...WEEKLY.map((d) => d.min))} мин`} />
          <Summary icon={TrendingUp} tint="text-violet-400 bg-violet-500/10" label="Средний навык" value={`${Math.round(SKILLS.reduce((s, x) => s + x.value, 0) / SKILLS.length)}%`} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="card p-5 sm:p-6">
            <h3 className="font-semibold mb-4">Навыки</h3>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <RadarChart data={SKILLS} outerRadius="72%">
                  <defs>
                    <linearGradient id="radar-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3ECF5E" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#3ECF5E" stopOpacity={0.25} />
                    </linearGradient>
                  </defs>
                  <PolarGrid stroke={GRID} />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: AXIS, fontSize: 12 }} />
                  <Radar dataKey="value" stroke="#3ECF5E" strokeWidth={2} fill="url(#radar-grad)" dot={{ r: 3, fill: "#3ECF5E" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2.5">
              {SKILLS.map((s) => (
                <div key={s.skill}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{s.skill}</span>
                    <span className="font-mono">{s.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${s.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5 sm:p-6">
            <h3 className="font-semibold mb-4">Активность за неделю</h3>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={WEEKLY} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22B8F0" />
                      <stop offset="100%" stopColor="#3ECF5E" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={GRID} />
                  <XAxis dataKey="day" stroke={AXIS} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={AXIS} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(62, 207, 94, 0.1)" }}
                    contentStyle={{
                      background: "rgb(var(--slate-900))",
                      border: "1px solid rgb(var(--slate-700))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "rgb(var(--slate-100))" }}
                    formatter={(v: number) => [`${v} мин`, "Время"]}
                  />
                  <Bar dataKey="min" fill="url(#bar-grad)" radius={[8, 8, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card rounded-xl p-4 text-sm text-slate-300 flex items-start gap-3 border-indigo-500/30">
          <span className="text-lg leading-none">💡</span>
          <p>
            Твоя главная зона роста — <span className="font-semibold text-indigo-400">{weakest.skill}</span> ({weakest.value}%).
            Попробуй 5 минут разговора с AI каждый день.
          </p>
        </div>
      </main>
    </div>
  );
}

function Summary({ icon: Icon, tint, label, value }: { icon: any; tint: string; label: string; value: string }) {
  return (
    <div className="card p-4">
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${tint}`}>
        <Icon className="w-4 h-4" />
      </span>
      <p className="text-xl font-bold font-mono">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}
