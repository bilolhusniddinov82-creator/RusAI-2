"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, BookOpen, GraduationCap, MessageSquare, Headphones,
  PenTool, BarChart3, Settings, ScrollText, Menu, X, Flame, Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/use-t";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Logo } from "@/components/ui/logo";
import { useUserStore, useDailyStats } from "@/store/user-store";
import { useLearningStore } from "@/store/learning-store";
import type { DictKey } from "@/lib/i18n/dictionary";

// Every section keeps its own colour (same as the landing page tiles).
const ITEMS: { href: string; key: DictKey; icon: any; color: string }[] = [
  { href: "/dashboard", key: "sidebar_overview", icon: Home, color: "text-emerald-400" },
  { href: "/vocabulary", key: "sidebar_vocab", icon: BookOpen, color: "text-sky-400" },
  { href: "/learn/lesson/past-tense-1", key: "sidebar_grammar", icon: GraduationCap, color: "text-amber-400" },
  { href: "/speaking", key: "sidebar_speaking", icon: MessageSquare, color: "text-emerald-400" },
  { href: "/listening", key: "sidebar_listening", icon: Headphones, color: "text-purple-400" },
  { href: "/reading", key: "sidebar_reading", icon: ScrollText, color: "text-orange-400" },
  { href: "/writing", key: "sidebar_writing", icon: PenTool, color: "text-rose-400" },
  { href: "/progress", key: "sidebar_progress", icon: BarChart3, color: "text-sky-400" },
];

function isActive(pathname: string, href: string) {
  if (href.startsWith("/learn")) return pathname.startsWith("/learn");
  if (href === "/speaking") return pathname.startsWith("/speaking");
  return pathname === href;
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const t = useT();
  const { name, xp, level } = useUserStore();
  const { streak } = useDailyStats();

  return (
    <>
      {/* Streak / XP / level chips, game-style */}
      <div className="mb-5 grid grid-cols-3 gap-2">
        <span className="flex flex-col items-center gap-0.5 rounded-2xl border-2 border-slate-800 py-2">
          <Flame className="w-5 h-5 text-orange-400" fill="currentColor" />
          <span className="text-sm font-extrabold text-orange-400 font-mono">{streak}</span>
        </span>
        <span className="flex flex-col items-center gap-0.5 rounded-2xl border-2 border-slate-800 py-2">
          <Star className="w-5 h-5 text-amber-400" fill="currentColor" />
          <span className="text-sm font-extrabold text-amber-400 font-mono">{xp >= 1000 ? `${(xp / 1000).toFixed(1)}k` : xp}</span>
        </span>
        <span className="flex flex-col items-center gap-0.5 rounded-2xl border-2 border-slate-800 py-2">
          <span className="w-5 h-5 rounded-md bg-indigo-500 text-accent-fg text-[10px] font-extrabold flex items-center justify-center">
            {(name || "?").charAt(0).toUpperCase()}
          </span>
          <span className="text-sm font-extrabold text-indigo-400">{level}</span>
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {ITEMS.map(({ href, key, icon: Icon, color }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={key}
              href={href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3.5 px-3 py-2.5 rounded-2xl border-2 text-[15px] font-semibold transition-all",
                active
                  ? "border-violet-500/70 bg-violet-500/10 text-violet-400"
                  : "border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", color)} strokeWidth={2.1} />
              {t(key)}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t-2 border-slate-800 space-y-3">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3.5 px-3 py-2.5 rounded-2xl text-[15px] font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
        >
          <Settings className="w-5 h-5" strokeWidth={2.1} /> {t("sidebar_settings")}
        </Link>
        <div className="px-1 flex items-center justify-between">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}

// Every app page renders the sidebar, so it also does the app-wide upkeep:
// sends visitors who never onboarded to onboarding, and unlocks
// achievements once they are actually earned.
function useAppGuards() {
  const router = useRouter();
  const onboarded = useUserStore((s) => s.onboarded);
  const { streak } = useDailyStats();
  const vocabStatus = useLearningStore((s) => s.vocabStatus);
  const unlockAchievement = useLearningStore((s) => s.unlockAchievement);

  useEffect(() => {
    // Persisted state loads from localStorage synchronously on the client,
    // but check explicitly so a not-yet-hydrated store never redirects.
    if (useUserStore.persist.hasHydrated() && !onboarded) router.replace("/onboarding");
  }, [onboarded, router]);

  useEffect(() => {
    if (streak >= 7) unlockAchievement("7-day-streak");
    const known = Object.values(vocabStatus).filter((s) => s === "known").length;
    if (known >= 500) unlockAchievement("500-words");
  }, [streak, vocabStatus, unlockAchievement]);
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useAppGuards();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 h-14 px-4 flex items-center justify-between border-b-2 border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={26} />
          <span className="text-xl font-extrabold tracking-tight">RusAI</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="p-2 -mr-2 rounded-lg text-slate-300 hover:bg-slate-800"
          aria-label="Меню"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-50 transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-slate-950 border-r-2 border-slate-800 p-5 flex flex-col transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-2">
              <Logo size={28} />
              <span className="text-xl font-extrabold tracking-tight">RusAI</span>
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="p-2 -mr-2 rounded-lg text-slate-400 hover:bg-slate-800"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <NavContent onNavigate={() => setOpen(false)} />
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex sticky top-0 h-screen border-r-2 border-slate-800 bg-slate-950 p-5 flex-col w-64 shrink-0">
        <Link href="/" className="flex items-center gap-2 mb-6 px-1">
          <Logo size={30} />
          <span className="text-2xl font-extrabold tracking-tight">RusAI</span>
        </Link>
        <NavContent />
      </aside>
    </>
  );
}
