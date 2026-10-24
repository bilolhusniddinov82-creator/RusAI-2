// Heuristic scoring for the speaking exam, used when no LLM key is
// configured (and as the base the LLM refines). Every number here is
// computed from what the learner actually said — speech rate, vocabulary
// variety, linking words, filler words and the recognizer's confidence —
// so the result changes with the answer instead of being random.

export interface ExamAnswer {
  part: 1 | 2 | 3;
  question: string;
  text: string;
  /** Seconds the learner spent answering. */
  seconds: number;
  /** Average speech-recognition confidence 0..1, if the browser reported it. */
  confidence: number | null;
}

export interface CriterionScores {
  fluency: number;
  lexical: number;
  grammar: number;
  pronunciation: number;
}

export interface AnswerReview {
  part: 1 | 2 | 3;
  question: string;
  text: string;
  words: number;
  seconds: number;
  note: string;
}

export interface ExamResult {
  scores: CriterionScores;
  overall: number;
  level: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  answers: AnswerReview[];
  stats: { totalWords: number; uniqueWords: number; wpm: number; fillers: number };
  source: "demo" | "ai";
}

export const CRITERION_LABELS: Record<keyof CriterionScores, string> = {
  fluency: "Беглость и связность",
  lexical: "Словарный запас",
  grammar: "Грамматика",
  pronunciation: "Произношение",
};

const FILLERS = ["ну", "э", "эм", "ээ", "ммм", "мм", "типа", "короче", "вот"];
const CONNECTORS = [
  "потому что", "поэтому", "но", "однако", "кроме того", "например", "во-первых",
  "во-вторых", "наконец", "потом", "затем", "хотя", "если", "когда", "чтобы",
  "который", "которая", "которые", "также", "тоже", "а ещё", "в общем", "по-моему",
  "мне кажется", "я думаю", "с одной стороны", "с другой стороны",
];
// Typical learner mistakes the recognizer still transcribes literally.
// (JS `\b` only knows Latin letters, so Cyrillic word edges use lookarounds.)
const ERROR_PATTERNS: { re: RegExp; tip: string }[] = [
  { re: /(?<![а-яё])хочу идти(?![а-яё])/i, tip: "«хочу идти» → «хочу пойти»: для одного действия в будущем нужен совершенный вид." },
  { re: /(?<![а-яё])кушать(?![а-яё])/i, tip: "Вместо «кушать» в нейтральной речи лучше говорить «есть»." },
  { re: /(?<![а-яё])я есть(?![а-яё])/i, tip: "В настоящем времени глагол «быть» опускается: не «я есть студент», а «я студент»." },
  { re: /(?<![а-яё])мне нравится (?:читать|играть|гулять) очень(?![а-яё])/i, tip: "«очень» ставится перед глаголом: «мне очень нравится…»." },
  { re: /(?<![а-яё])в (?:москва|ташкент|самарканд)(?![а-яё])/i, tip: "После «в» (где?) нужен предложный падеж: «в Москве», «в Ташкенте»." },
];

const MIN_WORDS: Record<1 | 2 | 3, number> = { 1: 8, 2: 60, 3: 20 };

function words(text: string) {
  return (text.toLowerCase().match(/[a-zа-яё-]+/gi) ?? []).filter((w) => w !== "-");
}

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

export function levelFromScore(score: number) {
  if (score >= 85) return "C1";
  if (score >= 72) return "B2";
  if (score >= 58) return "B1";
  if (score >= 42) return "A2";
  return "A1";
}

export function scoreExam(answers: ExamAnswer[]): ExamResult {
  const allText = answers.map((a) => a.text).join(" ");
  const toks = words(allText);
  const totalWords = toks.length;
  const totalSeconds = answers.reduce((s, a) => s + (a.text.trim() ? a.seconds : 0), 0);
  const wpm = totalSeconds > 0 ? Math.round(totalWords / (totalSeconds / 60)) : 0;
  const fillers = toks.filter((w) => FILLERS.includes(w)).length;
  const contentToks = toks.filter((w) => !FILLERS.includes(w));
  // Crude stemming (first 5 letters) so «город/города/городе» count once.
  const stems = new Set(contentToks.map((w) => w.slice(0, 5)));
  const uniqueWords = new Set(contentToks).size;
  const lower = ` ${allText.toLowerCase()} `;
  const connectorsUsed = CONNECTORS.filter((c) => lower.includes(` ${c} `) || lower.includes(` ${c},`));
  const errorsFound = ERROR_PATTERNS.filter((p) => p.re.test(allText));
  const answered = answers.filter((a) => words(a.text).length >= 3).length;
  const coverage = answers.length ? answered / answers.length : 0;

  if (totalWords === 0) {
    return {
      scores: { fluency: 0, lexical: 0, grammar: 0, pronunciation: 0 },
      overall: 0,
      level: "—",
      summary: "Мы не услышали ответов. Проверь микрофон и попробуй ещё раз.",
      strengths: [],
      improvements: ["Разреши доступ к микрофону и говори чуть громче."],
      answers: answers.map((a) => ({ ...a, words: 0, note: "Ответ не распознан." })),
      stats: { totalWords: 0, uniqueWords: 0, wpm: 0, fillers: 0 },
      source: "demo",
    };
  }

  // Fluency: speech rate (≈100 wpm is comfortable for a learner), fewer
  // fillers, and actually answering every question.
  const rateScore = Math.min(1, wpm / 100);
  const fillerPenalty = Math.min(0.3, (fillers / Math.max(1, totalWords)) * 3);
  const fluency = clamp((rateScore * 0.6 + coverage * 0.4 - fillerPenalty) * 100);

  // Lexical resource: variety relative to length (root type-token ratio),
  // plus longer, less basic words.
  const rttr = stems.size / Math.sqrt(Math.max(1, contentToks.length));
  const longRatio = contentToks.filter((w) => w.length >= 7).length / Math.max(1, contentToks.length);
  // Short samples always look varied, so variety only counts fully once
  // the learner has said enough.
  const lengthFactor = 0.6 + 0.4 * Math.min(1, contentToks.length / 150);
  const lexical = clamp((Math.min(1, rttr / 9) * 75 + Math.min(1, longRatio / 0.25) * 25) * lengthFactor);

  // Grammar: speech recognizers drop punctuation, so we look at structure we
  // can see — linking/subordinate words, varied tenses — minus known errors.
  const pastForms = toks.filter((w) => /(?:ла|ли|ло)$/.test(w) || /[аеиоуыя]л$/.test(w)).length;
  const futureForms = toks.filter((w) => ["буду", "будет", "будем", "будут", "будешь"].includes(w)).length;
  const tenseVariety = (pastForms > 0 ? 0.5 : 0) + (futureForms > 0 ? 0.5 : 0);
  const avgLen = totalWords / Math.max(1, answered);
  const grammar = clamp(
    Math.min(1, connectorsUsed.length / 6) * 45 + tenseVariety * 20 + Math.min(1, avgLen / 35) * 35 - errorsFound.length * 8
  );

  const confs = answers.map((a) => a.confidence).filter((c): c is number => typeof c === "number");
  const avgConf = confs.length ? confs.reduce((a, b) => a + b, 0) / confs.length : null;
  // 0.55 confidence ≈ hard to understand, 0.95 ≈ very clear.
  const pronunciation =
    avgConf !== null ? clamp(((avgConf - 0.55) / 0.4) * 100, 20, 98) : clamp(fluency * 0.5 + lexical * 0.3 + 20);

  const scores = { fluency, lexical, grammar, pronunciation };
  const overall = clamp((fluency + lexical + grammar + pronunciation) / 4);
  const level = levelFromScore(overall);

  const strengths: string[] = [];
  // Concrete mistakes first — they are the most actionable feedback.
  const improvements: string[] = errorsFound.map((e) => e.tip);
  if (coverage === 1) strengths.push("Ты ответил на все вопросы экзаменатора.");
  if (wpm >= 80) strengths.push(`Хороший темп речи — около ${wpm} слов в минуту.`);
  if (connectorsUsed.length >= 4) strengths.push(`Ты связываешь мысли: «${connectorsUsed.slice(0, 3).join("», «")}».`);
  if (lexical >= 65) strengths.push("Разнообразный словарный запас — мало повторов.");
  if (avgConf !== null && avgConf >= 0.85) strengths.push("Речь чёткая — её легко распознать.");

  if (wpm < 60) improvements.push("Говори дольше и без длинных пауз — старайся заполнить отведённое время.");
  if (fillers >= 3) improvements.push(`Слишком много слов-паразитов (${fillers}): «ну», «типа», «вот». Лучше сделать короткую паузу.`);
  if (connectorsUsed.length < 3)
    improvements.push("Используй связующие слова: «потому что», «поэтому», «например», «с одной стороны…».");
  if (lexical < 55) improvements.push("Старайся не повторять одни и те же слова — используй синонимы.");
  if (tenseVariety < 1) improvements.push("Покажи разные времена: расскажи, что было раньше и что будет в будущем.");
  if (avgConf !== null && avgConf < 0.75) improvements.push("Произноси слова чётче и медленнее — часть речи распознана неуверенно.");

  const reviews: AnswerReview[] = answers.map((a) => {
    const n = words(a.text).length;
    let note = "Хороший ответ.";
    if (n === 0) note = "Ответа не было — даже короткий ответ лучше молчания.";
    else if (n < MIN_WORDS[a.part])
      note =
        a.part === 2
          ? "Монолог слишком короткий — раскрой все пункты карточки."
          : "Слишком коротко. Добавь причину или пример: «…, потому что…».";
    else if (words(a.text).filter((w) => FILLERS.includes(w)).length >= 2) note = "Много слов-паразитов в этом ответе.";
    return { part: a.part, question: a.question, text: a.text, words: n, seconds: a.seconds, note };
  });

  const summary =
    overall >= 72
      ? "Отличный результат! Ты уверенно держишь разговор и раскрываешь темы."
      : overall >= 50
      ? "Хорошая база. Чтобы подняться выше, давай более длинные и связные ответы."
      : "Начало положено. Тренируйся отвечать полными предложениями и чаще говорить вслух.";

  return {
    scores,
    overall,
    level,
    summary,
    strengths: strengths.length ? strengths : ["Ты прошёл весь экзамен — это уже большой шаг."],
    improvements: improvements.slice(0, 5),
    answers: reviews,
    stats: { totalWords, uniqueWords, wpm, fillers },
    source: "demo",
  };
}
