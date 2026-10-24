"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Mic, Menu, X, MessageSquare, BookOpen, GraduationCap,
  Headphones, ScrollText, PenTool, Flame, Star, Trophy, Users, Zap, Lock,
} from "lucide-react";
import { useT } from "@/lib/i18n/use-t";
import type { DictKey } from "@/lib/i18n/dictionary";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const NAV: [string, DictKey][] = [
  ["#features", "nav_features"],
  ["#how", "nav_how"],
  ["#start", "nav_tutor"],
];

const STATS: { value: string; key: DictKey; icon: any; tone: string }[] = [
  { value: "50K+", key: "stat_students", icon: Users, tone: "bg-sky-500/15 text-sky-400" },
  { value: "2M+", key: "stat_exercises", icon: Zap, tone: "bg-amber-500/15 text-amber-400" },
  { value: "94%", key: "stat_active", icon: Flame, tone: "bg-orange-500/15 text-orange-400" },
  { value: "4.9", key: "stat_rating", icon: Star, tone: "bg-purple-500/15 text-purple-400" },
];

// Each skill has its own colour, so the page reads like a box of crayons.
// Classes are written out in full so Tailwind keeps them in the build.
const FEATURES: { href: string; icon: any; title: DictKey; desc: DictKey; tile: string; edge: string }[] = [
  { href: "/speaking", icon: MessageSquare, title: "feat_speaking", desc: "feat_speaking_desc", tile: "bg-emerald-500/15 text-emerald-400", edge: "" },
  { href: "/vocabulary", icon: BookOpen, title: "feat_vocab", desc: "feat_vocab_desc", tile: "bg-sky-500/15 text-sky-400", edge: "" },
  { href: "/learn/lesson/past-tense-1", icon: GraduationCap, title: "feat_grammar", desc: "feat_grammar_desc", tile: "bg-amber-500/15 text-amber-400", edge: "" },
  { href: "/listening", icon: Headphones, title: "feat_listening", desc: "feat_listening_desc", tile: "bg-purple-500/15 text-purple-400", edge: "" },
  { href: "/reading", icon: ScrollText, title: "feat_reading", desc: "feat_reading_desc", tile: "bg-orange-500/15 text-orange-400", edge: "" },
  { href: "/writing", icon: PenTool, title: "feat_writing", desc: "feat_writing_desc", tile: "bg-rose-500/15 text-rose-400", edge: "" },
];

const STEPS: [DictKey, DictKey, string][] = [
  ["step1_title", "step1_desc", "bg-sky-500"],
  ["step2_title", "step2_desc", "bg-amber-400"],
  ["step3_title", "step3_desc", "bg-purple-500"],
  ["step4_title", "step4_desc", "bg-emerald-500"],
];

const LEVELS: { code: string; tone: string }[] = [
  { code: "A1", tone: "bg-emerald-500" },
  { code: "A2", tone: "bg-sky-500" },
  { code: "B1", tone: "bg-amber-400" },
  { code: "B2", tone: "bg-orange-500" },
  { code: "C1", tone: "bg-purple-500" },
  { code: "C2", tone: "bg-rose-500" },
];

export default function Landing() {
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b-2 border-slate-800">
        <nav className="max-w-6xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={30} />
            <span className="text-xl font-extrabold tracking-tight">RusAI</span>
          </Link>
          <div className="hidden md:flex items-center gap-1 font-bold text-slate-400">
            {NAV.map(([href, key]) => (
              <a key={href} href={href} className="px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-slate-100 transition-colors">
                {t(key)}
              </a>
            ))}
            <Link href="/pricing" className="px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-slate-100 transition-colors">
              {t("nav_pricing")}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block"><LanguageSwitcher /></div>
            <ThemeToggle />
            <Link href="/onboarding" className="hidden sm:inline-flex h-11 px-5 rounded-2xl btn-primary text-sm items-center">
              {t("start_free")}
            </Link>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden w-11 h-11 rounded-2xl flex items-center justify-center text-slate-300 hover:bg-slate-800"
              aria-label="Меню"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
        {menuOpen && (
          <div className="md:hidden border-t-2 border-slate-800 px-4 py-4 space-y-1 animate-in">
            {NAV.map(([href, key]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-2xl font-bold text-slate-200 hover:bg-slate-800">
                {t(key)}
              </a>
            ))}
            <Link href="/pricing" className="block px-4 py-3 rounded-2xl font-bold text-slate-200 hover:bg-slate-800">
              {t("nav_pricing")}
            </Link>
            <div className="flex items-center justify-between pt-3">
              <LanguageSwitcher />
              <Link href="/onboarding" className="h-11 px-5 rounded-2xl btn-primary text-sm inline-flex items-center">
                {t("start_free")}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Product preview: what a real lesson with the AI tutor looks like */}
          <div className="relative w-full max-w-md mx-auto order-2 animate-in" style={{ animationDelay: "120ms" }}>
            <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-indigo-500/20 via-transparent to-violet-500/20 blur-3xl pointer-events-none" />

            <div className="relative card overflow-hidden shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <Logo size={34} />
                  <div>
                    <p className="text-sm font-bold leading-tight">RusAI Tutor</p>
                    <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> online
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">A2</span>
              </div>

              <div className="px-5 py-5 space-y-3 text-[15px]">
                <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-slate-800 px-4 py-2.5 text-slate-200">
                  Привет! Как прошёл твой день?
                </div>
                <div className="max-w-[85%] ml-auto rounded-2xl rounded-tr-md bg-indigo-500 px-4 py-2.5 text-accent-fg font-medium">
                  Вчера я пойду в кино с друзьями.
                </div>
                <div className="max-w-[90%] rounded-2xl rounded-tl-md border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">Поправка</p>
                  <p className="text-sm">
                    <span className="line-through text-rose-400">пойду</span>
                    <span className="text-slate-500 mx-1.5">→</span>
                    <span className="font-bold text-emerald-400">ходил</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">«Вчера» — прошедшее время.</p>
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-slate-800 px-4 py-2.5 text-slate-200">
                  Отлично! А какой фильм вы смотрели?
                </div>
              </div>

              <div className="px-5 pb-5">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/50 pl-4 pr-1.5 py-1.5">
                  <span className="flex-1 text-sm text-slate-500">Напиши или скажи…</span>
                  <span className="w-9 h-9 rounded-xl bg-indigo-500 text-accent-fg flex items-center justify-center">
                    <Mic className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>

            {/* Floating stat chips */}
            <div className="absolute -top-5 right-2 sm:-right-6 card rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl animate-float">
              <span className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </span>
              <div>
                <p className="text-lg font-extrabold leading-none font-mono">12</p>
                <p className="text-xs text-slate-400">{t("streak")}</p>
              </div>
            </div>
            <div className="absolute -bottom-6 left-2 sm:-left-8 card rounded-2xl px-4 py-3 w-52 shadow-xl animate-float" style={{ animationDelay: "1.5s" }}>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400">{t("level")}</span>
                <span className="font-bold">A2 → B1</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              </div>
            </div>
          </div>

          <div className="order-1 text-center lg:text-left animate-in">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 text-indigo-400 text-sm font-extrabold mb-6">
              <Zap className="w-4 h-4" /> {t("hero_badge")}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold leading-[1.08] mb-5">{t("hero_title")}</h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-9 max-w-xl mx-auto lg:mx-0">{t("hero_subtitle")}</p>
            <div className="flex flex-col gap-3.5 max-w-sm mx-auto lg:mx-0">
              <Link href="/onboarding" className="h-14 rounded-2xl btn-primary text-base flex items-center justify-center gap-2">
                {t("start_free")} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/speaking/exam" className="h-14 rounded-2xl btn-ghost text-base flex items-center justify-center gap-2 text-indigo-400">
                <Mic className="w-5 h-5" /> {t("try_tutor")}
              </Link>
            </div>
            <p className="text-sm text-slate-500 mt-5">{t("demo_hint")}</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y-2 border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ value, key, icon: Icon, tone }) => (
            <div key={key} className="flex items-center gap-3 justify-center md:justify-start">
              <span className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", tone)}>
                <Icon className="w-6 h-6" />
              </span>
              <div>
                <p className="text-2xl font-extrabold leading-none">{value}</p>
                <p className="text-sm text-slate-400 font-bold mt-1">{t(key)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">{t("features_title")}</h2>
          <p className="text-lg text-slate-400">{t("features_subtitle")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map(({ href, icon: Icon, title, desc, tile, edge }) => (
            <Link key={href} href={href} className="group card card-hover p-6 flex flex-col">
              <span className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105", tile, edge)}>
                <Icon className="w-7 h-7" strokeWidth={2} />
              </span>
              <h3 className="text-xl font-extrabold mb-1.5">{t(title)}</h3>
              <p className="text-slate-400 leading-relaxed">{t(desc)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Level path */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="card p-6 sm:p-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-2">{t("level_map_title")}</h2>
            <p className="text-slate-400">{t("level_map_subtitle")}</p>
          </div>
          <div className="relative grid grid-cols-6 gap-2 max-w-3xl mx-auto">
            <div className="absolute left-[8%] right-[8%] top-7 sm:top-9 h-2 rounded-full bg-slate-800" />
            <div className="absolute left-[8%] w-[17%] top-7 sm:top-9 h-2 rounded-full bg-indigo-500" />
            {LEVELS.map((l, i) => (
              <div key={l.code} className="relative flex flex-col items-center gap-3">
                <span
                  className={cn(
                    "w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-extrabold transition-transform hover:-translate-y-1",
                    i < 2 ? l.tone : "bg-slate-800 text-slate-500"
                  )}
                >
                  {i < 2 ? l.code : <Lock className="w-5 h-5 sm:w-6 sm:h-6" />}
                </span>
                <span className={cn("text-xs sm:text-sm font-extrabold", i < 2 ? "text-slate-200" : "text-slate-500")}>{l.code}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-center mb-12">{t("how_it_works_title")}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {STEPS.map(([titleKey, descKey, color], i) => (
            <div key={titleKey} className="card p-6">
              <span className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-extrabold mb-5", color)}>
                {i + 1}
              </span>
              <h3 className="text-lg font-extrabold mb-2">{t(titleKey)}</h3>
              <p className="text-slate-400 leading-relaxed">{t(descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="start" className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 sm:pb-32">
        <div className="relative overflow-hidden rounded-[2rem] bg-indigo-500 px-6 py-14 sm:p-16 text-center text-white">
          <span className="absolute -left-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
          <span className="absolute right-10 -bottom-12 w-40 h-40 rounded-full bg-white/10" />
          <Trophy className="relative w-12 h-12 mx-auto mb-6" />
          <h2 className="relative text-3xl sm:text-5xl font-extrabold mb-4 max-w-3xl mx-auto">{t("final_cta_title")}</h2>
          <p className="relative text-lg text-white/85 mb-9 max-w-xl mx-auto">{t("final_cta_subtitle")}</p>
          <Link
            href="/onboarding"
            className="relative inline-flex items-center gap-2 h-14 px-10 rounded-2xl bg-white text-indigo-700 font-bold shadow-[0_2px_0_rgb(0_0_0/0.2)] hover:brightness-95 active:translate-y-0.5 active:shadow-none transition-all"
          >
            {t("start_free")} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t-2 border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-sm font-bold text-slate-500">
          <div className="flex items-center gap-2.5">
            <Logo size={26} />
            <span>{t("footer_text")}</span>
          </div>
          <div className="flex items-center gap-6">
            {NAV.map(([href, key]) => (
              <a key={href} href={href} className="hover:text-slate-200 transition-colors">{t(key)}</a>
            ))}
            <Link href="/pricing" className="hover:text-slate-200 transition-colors">{t("nav_pricing")}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

