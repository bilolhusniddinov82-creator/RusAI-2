// Vocabulary set built from the plain-text sources in ./vocab/part-*.ts.
// Every word has a real example sentence and its Uzbek translation.
// pronunciation is a practical Latin transliteration in Uzbek spelling
// (ж → j, х → x, ч → ch) — the accurate source is the TTS "listen" button.
import { PART_1 } from "./vocab/part-1";
import { PART_2 } from "./vocab/part-2";
import { PART_3 } from "./vocab/part-3";
import { PART_4 } from "./vocab/part-4";

export type VocabLevel = "A1" | "A2" | "B1";

export interface VocabWord {
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  exampleTranslation: string;
  category: string;
  level: VocabLevel;
  /** 1 = A1, 2 = A2, 3 = B1 — kept numeric for sorting and progress. */
  batch: number;
}

export const VOCAB_CATEGORIES = [
  "Travel",
  "Work",
  "Everyday",
  "Food",
  "Family",
  "School",
  "Technology",
  "Business",
  "Nature",
  "Health",
  "Emotions",
  "Time",
  "Numbers",
  "Colors",
  "Clothing",
  "Home",
  "Sports",
] as const;

export const VOCAB_LEVELS: VocabLevel[] = ["A1", "A2", "B1"];

// Inside each category the source lists words from easiest to hardest:
// the first entries are A1, the next ones A2, the rest B1.
const LEVEL_SPLITS = { A1: 22, A2: 42 };

const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j", з: "z", и: "i",
  й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
  у: "u", ф: "f", х: "x", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "i", ь: "",
  э: "e", ю: "yu", я: "ya",
};
const VOWELS = "аеёиоуыэюя";

export function transliterate(text: string) {
  const lower = text.toLowerCase();
  let out = "";
  for (let i = 0; i < lower.length; i++) {
    const ch = lower[i];
    const prev = lower[i - 1];
    // "е" sounds like "ye" at the start of a word and after vowels / ъ / ь.
    if (ch === "е" && (!prev || !/[а-яё]/.test(prev) || VOWELS.includes(prev) || prev === "ъ" || prev === "ь")) {
      out += "ye";
    } else {
      out += TRANSLIT[ch] ?? ch;
    }
  }
  return out;
}

function parse(sources: Record<string, string>[]): VocabWord[] {
  const seen = new Set<string>();
  const words: VocabWord[] = [];
  for (const source of sources) {
    for (const [category, block] of Object.entries(source)) {
      let index = 0;
      for (const line of block.split("\n")) {
        const parts = line.split("|").map((p) => p.trim());
        if (parts.length !== 4 || parts.some((p) => !p)) continue;
        const [word, translation, example, exampleTranslation] = parts;
        const level: VocabLevel = index < LEVEL_SPLITS.A1 ? "A1" : index < LEVEL_SPLITS.A2 ? "A2" : "B1";
        index++;
        // The same word can appear in two categories; keep the first one —
        // unless it has a different meaning there (e.g. «Зарядка»: charger / exercises).
        const key = `${word.toLowerCase()}|${translation.toLowerCase()}`;
        if (seen.has(key)) continue;
        seen.add(key);
        words.push({
          word,
          translation,
          pronunciation: transliterate(word.replace(/\s*\(.*?\)\s*/g, "")),
          example,
          exampleTranslation,
          category,
          level,
          batch: VOCAB_LEVELS.indexOf(level) + 1,
        });
      }
    }
  }
  return words;
}

export const VOCAB_WORDS: VocabWord[] = parse([PART_1, PART_2, PART_3, PART_4]);

export const VOCAB_BATCH_SIZE: Record<number, number> = VOCAB_WORDS.reduce((acc, w) => {
  acc[w.batch] = (acc[w.batch] ?? 0) + 1;
  return acc;
}, {} as Record<number, number>);

export const TOTAL_BATCHES = VOCAB_LEVELS.length;
