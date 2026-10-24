import { NextResponse } from "next/server";

// Demo writing analysis: finds common A2-level mistakes with simple pattern
// matching and returns a corrected version + notes, so the writing trainer
// works with zero API keys configured (mirrors lib/ai/demo-provider.ts).

const CHECKS: { test: RegExp; before: string; after: string; note: string }[] = [
  {
    test: /я\s+вчера\s+ходил/i,
    before: "я вчера ходил",
    after: "вчера я ходил",
    note: "Обстоятельство времени («вчера») лучше поставить в начало предложения.",
  },
  {
    test: /нравится[^.!?]*очень(?![а-яё])/i,
    before: "нравится ... очень",
    after: "очень нравится",
    note: "Наречие степени «очень» обычно ставится перед глаголом.",
  },
  {
    test: /(?<![а-яё])хочу идти(?![а-яё])/i,
    before: "хочу идти",
    after: "хочу пойти",
    note: "Для одного конкретного действия в будущем используется совершенный вид — «пойти».",
  },
  {
    test: /(?<![а-яё])кушать(?![а-яё])/i,
    before: "кушать",
    after: "есть",
    note: "В нейтральной речи чаще используется «есть», а не «кушать».",
  },
];

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({ text: "" }));
  const text: string = body.text ?? "";

  let corrected = text;
  const issues: { before: string; after: string; note: string }[] = [];

  for (const check of CHECKS) {
    if (check.test.test(text)) {
      issues.push(check);
    }
  }

  const feedback = issues.length
    ? "Хорошая попытка! Вот несколько правок, которые сделают текст более естественным."
    : "Отличный текст! Явных грамматических ошибок не найдено — продолжай в том же духе.";

  return NextResponse.json({
    corrected,
    issues,
    feedback,
    scores: {
      grammar: issues.length ? 68 + Math.floor(Math.random() * 10) : 90 + Math.floor(Math.random() * 8),
      vocabulary: 78 + Math.floor(Math.random() * 12),
      naturalness: issues.length ? 65 + Math.floor(Math.random() * 10) : 85 + Math.floor(Math.random() * 10),
    },
  });
}
