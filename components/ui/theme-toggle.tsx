"use client";

import { Sun, Moon } from "lucide-react";
import { useUserStore } from "@/store/user-store";

export function ThemeToggle() {
  const theme = useUserStore((s) => s.theme);
  const toggleTheme = useUserStore((s) => s.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-transparent hover:border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
      aria-label="Переключить тему"
      title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
