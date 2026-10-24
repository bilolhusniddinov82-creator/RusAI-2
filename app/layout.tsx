import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeSync } from "@/components/theme-sync";

// Manrope: friendly but grown-up geometric sans with full Cyrillic — used
// everywhere, from body text to headings and the numbers on stat cards.
const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "RusAI — Русский язык. Умнее. Быстрее. Увереннее.",
  description: "AI-платформа для изучения русского языка.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // className="dark" is just the no-JS/first-paint default (matches the
    // store's default theme). ThemeSync corrects it on mount to whatever
    // the user actually has saved (light/dark), and on every toggle after.
    <html lang="ru" className="dark">
      <body
        className={`${sans.variable} font-body bg-slate-950 text-slate-100 antialiased`}
      >
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
