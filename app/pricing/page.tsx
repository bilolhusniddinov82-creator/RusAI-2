import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const PLANS = [
  { name: "Free", price: "$0", period: "", desc: "Для знакомства с платформой", features: ["Ежедневные уроки", "Базовые слова", "Ограниченный AI"] },
  { name: "Pro", price: "$9.99", period: "/мес", desc: "Для быстрого прогресса", highlight: true, features: ["Безлимитные уроки", "AI Tutor без ограничений", "Голосовые разговоры", "Анализ речи", "Расширенная аналитика"] },
  { name: "Pro Yearly", price: "$79", period: "/год", desc: "Максимальная выгода", badge: "Экономия 33%", features: ["Всё из Pro", "Оплата за год", "Лучшая цена"] },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={28} />
          <span className="font-bold font-display">RusAI</span>
        </Link>
        <Link href="/" className="text-sm text-slate-400 hover:text-slate-100 flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> На главную
        </Link>
      </nav>

      <div className="px-4 sm:px-6 py-12 sm:py-16 max-w-5xl mx-auto animate-in">
        <div className="text-center mb-12 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 font-display">Тарифы</h1>
          <p className="text-slate-400">Начни бесплатно — переходи на Pro, когда будешь готов.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl p-6 flex flex-col transition-all duration-200 hover:-translate-y-1 ${
                p.highlight
                  ? "border-2 border-indigo-500 bg-gradient-to-b from-indigo-500/15 to-violet-500/5 shadow-2xl shadow-indigo-500/20 md:scale-105"
                  : "card"
              }`}
            >
              {p.badge && (
                <span className="absolute -top-3 left-5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500 text-white shadow">
                  {p.badge}
                </span>
              )}
              {p.highlight && (
                <span className="absolute -top-3 right-5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-accent-fg shadow">
                  Популярный
                </span>
              )}
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{p.desc}</p>
              <p className="mb-6">
                <span className="text-4xl font-bold font-mono">{p.price}</span>
                <span className="text-slate-400 text-sm">{p.period}</span>
              </p>
              <ul className="space-y-2.5 text-sm text-slate-300 mb-8 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/onboarding"
                className={`block text-center py-3 rounded-xl font-medium ${p.highlight ? "btn-primary" : "btn-ghost"}`}
              >
                Выбрать
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
