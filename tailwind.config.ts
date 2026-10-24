import type { Config } from "tailwindcss";

function themeVar(name: string) {
  return `rgb(var(--${name}) / <alpha-value>)`;
}

function scale(prefix: string, shades: number[]) {
  return Object.fromEntries(shades.map((s) => [s, themeVar(`${prefix}-${s}`)]));
}

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        // Every bg-slate-*/text-slate-*/border-slate-* utility already used
        // across the app resolves through these variables, which flip
        // between light and dark in globals.css based on the `.dark` class.
        slate: scale("slate", [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        // The brand accent. Existing indigo/violet utilities are routed to it,
        // so the whole app re-themes from the variables in globals.css.
        indigo: scale("accent", [100, 200, 300, 400, 500, 600, 700]),
        violet: scale("accent2", [100, 200, 300, 400, 500, 600, 700]),
        accent: {
          DEFAULT: themeVar("accent-500"),
          fg: themeVar("accent-fg"),
        },
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
