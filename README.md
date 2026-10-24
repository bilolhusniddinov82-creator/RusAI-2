# RusAI — AI-powered Russian learning platform

A real Next.js 15 + TypeScript + Tailwind app: landing page → onboarding →
placement test → dashboard → lesson engine with a persistent AI Tutor panel →
vocabulary → progress. State is managed with Zustand and persisted to
localStorage, so the whole demo works standalone.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. No API keys or database are required — the app
runs entirely in **Demo AI mode** out of the box (see below).

## What's fully wired

- Full navigation flow: landing → onboarding (name/level/goal/time) →
  placement test (scored, produces a level) → dashboard → lesson → vocabulary
  → listening → reading → writing → speaking → progress.
- **Real voice, no API key needed.** `lib/speech/tts.ts` wraps the browser's
  Web Speech API for text-to-speech (used on every pronunciation button, the
  AI Tutor's replies, and the dedicated Speaking page). `lib/speech/stt.ts`
  wraps browser speech recognition for real microphone input (the AI Tutor
  panel's mic button, the lesson's speaking step, and the full-page Speaking
  mode). Both work in Chrome/Edge out of the box; unsupported browsers (e.g.
  Firefox) get a visible fallback message instead of a silently broken mic.
- 32 Russian vocabulary words across all 8 categories from the brief
  (Everyday, Work, Travel, Food, Family, School, Technology, Business), with
  category filter tabs on the Vocabulary page and a "listen" button on every
  card and example sentence.
- The lesson engine (`app/learn/lesson/[id]`) has real steps — explanation,
  examples, vocabulary (with audio), a graded multiple-choice exercise, a
  real-microphone speaking step, a mini-test, and a results screen that
  awards XP.
- `/listening` — simulated audio player (play/pause/replay/slow-mode/
  transcript) with a graded comprehension question.
- `/reading` — a passage with clickable highlighted words (translation +
  audio pronunciation + example) and comprehension questions.
- `/writing` — a text editor that posts to `/api/ai/writing`, which flags
  common mistakes (word order, verb aspect, "кушать→есть") and shows a
  corrected version + scores, entirely offline/demo by default.
- `/speaking` — a voice-first conversation mode built around an animated,
  audio-reactive **voice orb** (`components/speaking/voice-orb.tsx`) instead
  of a text chat log — tap the orb to talk, like a real voice assistant. It
  reacts to your actual mic volume while listening (`lib/speech/mic-level.ts`,
  via the Web Audio API), pulses on its own while the AI is speaking, and
  shows one live caption line at a time rather than a scrolling chat feed.
  When the AI detects a grammar mistake it surfaces a distinct correction
  card (before → after + explanation) instead of burying it in text. A full
  transcript and a text-input fallback are both there, just tucked behind
  "История" / "Текстом" toggles so the voice-first flow stays the default.
  Ends with the same "get feedback" scoring as before.
- A persistent **AI Tutor panel** sits next to every lesson and is also
  reachable from the landing page. It calls a real API route
  (`/api/ai/chat`), which:
  - uses `DemoAIProvider` (`lib/ai/demo-provider.ts`) when no API key is set —
    pattern-matches common Russian grammar mistakes (word order, verb aspect,
    gender agreement) and gives a correction + explanation, or a natural
    follow-up question otherwise;
  - automatically switches to a real LLM call (Anthropic or OpenAI) the
    moment you set `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` in `.env.local` —
    see `lib/ai/provider.ts`. If that call fails for any reason it falls back
    to the demo provider instead of crashing.
- **Real dark/light mode.** The whole app's `slate-*` palette is bound to
  CSS variables that flip based on a `.dark` class on `<html>`
  (`app/globals.css` + `tailwind.config.ts`), so every existing
  `bg-slate-900`, `text-slate-400`, `border-slate-800`, etc. across every
  page renders correctly in both themes — no per-page rewrite needed. Toggle
  it from the sun/moon icon in the Sidebar or the landing navbar; the choice
  persists via the user store.
- **Real language switching (RU/UZ/EN)** for the app's UI chrome — sidebar
  navigation, the landing navbar/hero, and the dashboard greeting/plan/stats
  all read from `lib/i18n/dictionary.ts` via the `useT()` hook and switch
  instantly from the RU/UZ/EN pill switcher (Sidebar and landing navbar).
  Lesson/vocabulary/reading *content* stays in Russian on purpose — that's
  the language being taught — but the chrome around it is fully localized.
  Extending translations to the remaining pages (vocabulary, listening,
  writing, pricing, etc.) just means adding more keys to that same
  dictionary and swapping the hardcoded strings for `t("key")`.
- Vocabulary flashcards, XP/streak/level state, and lesson/vocab progress
  persist across reloads via Zustand + localStorage.
- Progress page renders real charts (Recharts radar + weekly bar chart).

## What's scaffolded, not wired

- `prisma/schema.prisma` models the full data layer (User, Lesson,
  Vocabulary, Conversation, Achievements, Subscription, etc.) but there's no
  live Postgres connection — the app currently runs on local/demo state, not
  this schema. To go further: set `DATABASE_URL` in `.env.local`, run
  `npx prisma migrate dev`, and replace the Zustand stores' demo data with
  real Prisma queries in the API routes.
- There's no real authentication (NextAuth/Auth.js) — "Войти" currently
  routes straight into onboarding, matching the brief's demo-mode
  requirement ("works even without API keys / accounts").
- Voice runs on the browser's built-in Web Speech API rather than a
  dedicated cloud STT/TTS vendor — genuinely functional, but quality and
  language coverage depend on the browser/OS voice pack. `lib/speech/` is
  the seam where you'd swap in a vendor (e.g. ElevenLabs, Whisper) later.

## Structure

```
app/            routes (App Router)
components/     shared UI, grouped by area (dashboard, ai, lesson, ...)
lib/ai/         provider abstraction — types.ts, demo-provider.ts, provider.ts
lib/lessons/    demo lesson/vocabulary/placement-test content
store/          Zustand stores (user, learning progress)
prisma/         schema for the real backend (not yet connected)
```
