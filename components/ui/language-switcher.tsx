"use client";

import { useUserStore } from "@/store/user-store";
import { LOCALES } from "@/lib/i18n/dictionary";

export function LanguageSwitcher() {
  const lang = useUserStore((s) => s.interfaceLang);
  const setLang = useUserStore((s) => s.setInterfaceLang);

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-slate-700 bg-slate-900/60 p-0.5">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all ${
            lang === l.code
              ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-accent-fg shadow-sm shadow-indigo-500/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
