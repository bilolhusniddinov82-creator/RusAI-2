import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type Locale = "ru" | "uz" | "en";

/** Local calendar day as "YYYY-MM-DD" (streaks follow the learner's own midnight). */
export function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dayKey(d);
}

interface UserState {
  name: string;
  level: Level;
  goal: string;
  dailyMinutes: number;
  /** Minutes studied on `minutesDate`; other days count as 0. */
  minutesToday: number;
  minutesDate: string | null;
  xp: number;
  /** Consecutive study days ending on `lastActiveDate`. */
  streak: number;
  lastActiveDate: string | null;
  onboarded: boolean;
  theme: "dark" | "light";
  interfaceLang: Locale;
  setOnboardingField: (
    data: Partial<Pick<UserState, "name" | "level" | "goal" | "dailyMinutes">>
  ) => void;
  completeOnboarding: () => void;
  addXp: (amount: number) => void;
  addMinutes: (amount: number) => void;
  /** Starts a brand-new learner: progress back to zero, settings kept. */
  resetProgress: () => void;
  toggleTheme: () => void;
  setInterfaceLang: (lang: Locale) => void;
}

const FRESH_PROGRESS = {
  name: "",
  level: "A1" as Level,
  goal: "",
  dailyMinutes: 20,
  minutesToday: 0,
  minutesDate: null,
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  onboarded: false,
};

// Any learning activity counts the day toward the streak: continuing from
// yesterday adds one, a gap starts over at 1, and today only counts once.
function withActivity(s: UserState) {
  const today = dayKey();
  if (s.lastActiveDate === today) return {};
  return {
    lastActiveDate: today,
    streak: s.lastActiveDate === yesterdayKey() ? s.streak + 1 : 1,
  };
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...FRESH_PROGRESS,
      theme: "dark",
      interfaceLang: "ru",
      setOnboardingField: (data) => set((s) => ({ ...s, ...data })),
      completeOnboarding: () => set({ onboarded: true }),
      addXp: (amount) => set((s) => ({ xp: s.xp + amount, ...withActivity(s) })),
      addMinutes: (amount) =>
        set((s) => {
          const today = dayKey();
          const base = s.minutesDate === today ? s.minutesToday : 0;
          return { minutesToday: base + amount, minutesDate: today, ...withActivity(s) };
        }),
      resetProgress: () => set({ ...FRESH_PROGRESS }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setInterfaceLang: (lang) => set({ interfaceLang: lang }),
    }),
    {
      name: "rusai-user",
      version: 2,
      // v1 shipped with demo numbers (12-day streak, 2450 XP, "Алекс") as
      // defaults; drop progress from that version so nobody inherits it.
      migrate: (persisted: any, version) =>
        version < 2
          ? { ...FRESH_PROGRESS, theme: persisted?.theme ?? "dark", interfaceLang: persisted?.interfaceLang ?? "ru" }
          : persisted,
    }
  )
);

/**
 * Streak and today's minutes as they should be SHOWN right now: a streak
 * whose last day is older than yesterday is broken, and yesterday's minutes
 * don't count for today.
 */
export function useDailyStats() {
  const streak = useUserStore((s) => s.streak);
  const lastActiveDate = useUserStore((s) => s.lastActiveDate);
  const minutesToday = useUserStore((s) => s.minutesToday);
  const minutesDate = useUserStore((s) => s.minutesDate);
  const today = dayKey();
  return {
    streak: lastActiveDate === today || lastActiveDate === yesterdayKey() ? streak : 0,
    minutesToday: minutesDate === today ? minutesToday : 0,
  };
}
