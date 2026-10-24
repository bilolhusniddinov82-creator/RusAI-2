"use client";

import { useEffect, useMemo, useState } from "react";
import { Volume2, Search, Shuffle, ChevronLeft, ChevronRight, Eye, EyeOff, X } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { VOCAB_WORDS, VOCAB_CATEGORIES, VOCAB_LEVELS, type VocabLevel, type VocabWord } from "@/lib/lessons/vocab-data";
import { useLearningStore, type VocabStatus } from "@/store/learning-store";
import { speak } from "@/lib/speech/tts";
import { cn } from "@/lib/utils";

const LEVEL_STYLES: Record<VocabLevel, string> = {
  A1: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  A2: "bg-sky-500/10 text-sky-400 border-sky-500/30",
  B1: "bg-violet-500/10 text-violet-400 border-violet-500/30",
};

// Deterministic shuffle so a "Перемешать" press reorders the deck once
// without reshuffling on every render.
function shuffled<T>(items: T[], seed: number) {
  const out = [...items];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Highlights the studied word inside its example sentence. Russian words
// change their endings, so match on the stem (word minus its last letters).
function HighlightedExample({ word, sentence }: { word: VocabWord; sentence: string }) {
  const base = word.word.replace(/\s*\(.*?\)/, "").toLowerCase().replace(/ё/g, "е");
  const first = base.split(" ")[0];
  const stem = first.length > 4 ? first.slice(0, first.length - 2) : first;
  const normalized = sentence.toLowerCase().replace(/ё/g, "е");
  const start = stem.length >= 3 ? normalized.indexOf(stem) : -1;
  if (start < 0) return <>{sentence}</>;
  let end = start + stem.length;
  while (end < sentence.length && /[а-яё-]/i.test(sentence[end])) end++;
  return (
    <>
      {sentence.slice(0, start)}
      <span className="text-indigo-400 font-semibold">{sentence.slice(start, end)}</span>
      {sentence.slice(end)}
    </>
  );
}

export default function VocabularyPage() {
  const [category, setCategory] = useState<string>("All");
  const [level, setLevel] = useState<VocabLevel | "All">("All");
  const [query, setQuery] = useState("");
  const [hideKnown, setHideKnown] = useState(true);
  const [seed, setSeed] = useState(0);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const setVocabStatus = useLearningStore((s) => s.setVocabStatus);
  const vocabStatus = useLearningStore((s) => s.vocabStatus);

  const knownCount = VOCAB_WORDS.filter((w) => vocabStatus[w.word] === "known").length;

  const deck = useMemo(() => {
    const q = query.trim().toLowerCase();
    let words = VOCAB_WORDS.filter(
      (w) =>
        (category === "All" || w.category === category) &&
        (level === "All" || w.level === level) &&
        (!q || w.word.toLowerCase().includes(q) || w.translation.toLowerCase().includes(q))
    );
    // Words still to learn come first; "repeat" ones before brand-new ones.
    if (hideKnown && !q) words = words.filter((w) => vocabStatus[w.word] !== "known");
    const order = (w: VocabWord) => (vocabStatus[w.word] === "repeat" ? 0 : vocabStatus[w.word] === "unknown" ? 1 : 2);
    words = [...words].sort((a, b) => order(a) - order(b) || a.batch - b.batch);
    return seed ? shuffled(words, seed) : words;
    // vocabStatus is read only when filters change, so marking a word
    // doesn't reorder the deck under the learner's cursor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, level, query, hideKnown, seed]);

  const word = deck.length ? deck[index % deck.length] : null;
  const categoryTotal = (cat: string) =>
    VOCAB_WORDS.filter((w) => (cat === "All" || w.category === cat) && (level === "All" || w.level === level)).length;

  function resetPosition() {
    setIndex(0);
    setFlipped(false);
  }

  function go(delta: number) {
    if (!deck.length) return;
    setFlipped(false);
    setIndex((i) => (i + delta + deck.length) % deck.length);
  }

  function mark(status: VocabStatus) {
    if (!word) return;
    setVocabStatus(word.word, status);
    go(1);
  }

  // Keyboard: space flips, ← → navigate, 1/2/3 mark the card.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "1") mark("unknown");
      else if (e.key === "2") mark("repeat");
      else if (e.key === "3") mark("known");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 py-6 sm:p-6 lg:p-8 animate-in flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <div className="flex items-end justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold font-display">Слова</h1>
              <p className="text-xs text-slate-400 mt-0.5">{VOCAB_WORDS.length} слов с примерами · уровни A1–B1</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Изучено: <span className="text-emerald-400 font-semibold">{knownCount}</span> / {VOCAB_WORDS.length}
            </span>
          </div>

          <div className="h-1.5 w-full bg-slate-800 rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${(knownCount / VOCAB_WORDS.length) * 100}%` }}
            />
          </div>

          {/* Search + level + options */}
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  resetPosition();
                }}
                placeholder="Найти слово или перевод…"
                className="input py-2 pl-9 pr-8 text-sm"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    resetPosition();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  aria-label="Очистить"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex gap-1.5">
              {(["All", ...VOCAB_LEVELS] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLevel(l);
                    resetPosition();
                  }}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs font-semibold border transition-colors",
                    level === l ? "border-indigo-500 bg-indigo-500/10 text-indigo-400" : "border-slate-700 text-slate-400 hover:border-slate-500"
                  )}
                >
                  {l === "All" ? "Все" : l}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {["All", ...VOCAB_CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  resetPosition();
                }}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border font-medium transition-colors",
                  category === cat
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                    : "border-slate-700 text-slate-400 hover:border-slate-500"
                )}
              >
                {cat === "All" ? "Все" : cat}
                <span className="ml-1 opacity-60 font-mono">{categoryTotal(cat)}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
            <span className="font-mono">{deck.length ? `${(index % deck.length) + 1} / ${deck.length}` : "0 / 0"}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setHideKnown((h) => !h);
                  resetPosition();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors"
              >
                {hideKnown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {hideKnown ? "Изученные скрыты" : "Показаны все"}
              </button>
              <button
                onClick={() => {
                  setSeed(Date.now() % 233280 || 1);
                  resetPosition();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" /> Перемешать
              </button>
            </div>
          </div>

          {word ? (
            <>
              <div
                onClick={() => setFlipped((f) => !f)}
                className="card card-hover p-6 sm:p-8 cursor-pointer select-none min-h-[300px] flex flex-col justify-center animate-in"
                key={`${word.word}-${word.category}-${flipped}`}
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-[11px] uppercase tracking-wide text-slate-500">{word.category}</span>
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border", LEVEL_STYLES[word.level])}>{word.level}</span>
                  {vocabStatus[word.word] && (
                    <span className="text-[10px] text-slate-500">
                      · {vocabStatus[word.word] === "known" ? "знаю" : vocabStatus[word.word] === "repeat" ? "повторить" : "не знаю"}
                    </span>
                  )}
                </div>

                {!flipped ? (
                  <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-semibold mb-2 font-display">{word.word}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(word.word);
                      }}
                      className="mx-auto flex items-center justify-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      <Volume2 className="w-4 h-4" /> [{word.pronunciation}]
                    </button>

                    {/* Example sentence right under the word */}
                    <div className="mt-6 mx-auto max-w-md rounded-xl bg-slate-800/50 border border-slate-800 px-4 py-3 flex items-start gap-3 text-left">
                      <p className="flex-1 text-base leading-relaxed text-slate-200">
                        <HighlightedExample word={word} sentence={word.example} />
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(word.example);
                        }}
                        className="shrink-0 p-1 -m-1 text-indigo-400 hover:text-indigo-300"
                        aria-label="Прослушать пример"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs mt-5 text-slate-500">Нажми на карточку, чтобы открыть перевод</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-slate-400 mb-1">{word.word}</p>
                    <p className="text-3xl font-semibold mb-6 font-display text-gradient">{word.translation}</p>
                    <div className="mx-auto max-w-md rounded-xl bg-slate-800/50 border border-slate-800 px-4 py-3 text-left space-y-1.5">
                      <p className="text-sm leading-relaxed text-slate-200">
                        <HighlightedExample word={word} sentence={word.example} />
                      </p>
                      <p className="text-sm leading-relaxed text-slate-400 italic">{word.exampleTranslation}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => go(-1)}
                  className="p-3 rounded-xl btn-ghost shrink-0"
                  aria-label="Предыдущее слово"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-3 gap-2 flex-1">
                  <button onClick={() => mark("unknown")} className="py-3 rounded-xl text-sm font-medium border border-rose-500/30 bg-rose-500/5 text-rose-400 hover:bg-rose-500/15 hover:border-rose-500 transition-all active:scale-95">
                    Не знаю
                  </button>
                  <button onClick={() => mark("repeat")} className="py-3 rounded-xl text-sm font-medium border border-amber-500/30 bg-amber-500/5 text-amber-400 hover:bg-amber-500/15 hover:border-amber-500 transition-all active:scale-95">
                    Повторить
                  </button>
                  <button onClick={() => mark("known")} className="py-3 rounded-xl text-sm font-medium border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-500 transition-all active:scale-95">
                    Знаю
                  </button>
                </div>
                <button
                  onClick={() => go(1)}
                  className="p-3 rounded-xl btn-ghost shrink-0"
                  aria-label="Следующее слово"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <p className="hidden sm:block text-center text-[11px] text-slate-500 mt-3">
                Пробел — перевернуть · ← → — листать · 1 / 2 / 3 — не знаю / повторить / знаю
              </p>
            </>
          ) : (
            <div className="card p-10 text-center">
              <p className="text-lg font-semibold mb-1">{query ? "Ничего не найдено" : "Все слова здесь изучены! 🎉"}</p>
              <p className="text-sm text-slate-400 mb-4">
                {query ? "Попробуй другое слово или сбрось фильтры." : "Выбери другую категорию или уровень."}
              </p>
              {hideKnown && !query && (
                <button onClick={() => setHideKnown(false)} className="px-4 py-2 rounded-xl btn-ghost text-sm">
                  Повторить изученные
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
