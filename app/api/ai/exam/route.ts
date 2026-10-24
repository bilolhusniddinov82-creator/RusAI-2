import { NextResponse } from "next/server";
import { scoreExam, levelFromScore, type ExamAnswer, type ExamResult } from "@/lib/speaking/exam-scoring";

// Speaking exam evaluation. Always computes the transcript-based heuristic
// score; when ANTHROPIC_API_KEY is set, asks the LLM to grade like a real
// examiner and merges its verdict on top. Any LLM failure falls back to the
// heuristic result so the exam never ends without a score.

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const answers: ExamAnswer[] = Array.isArray(body?.answers) ? body.answers : [];
  const base = scoreExam(answers);

  if (!process.env.ANTHROPIC_API_KEY || base.stats.totalWords === 0) {
    return NextResponse.json(base);
  }

  try {
    const transcript = answers
      .map((a, i) => `#${i} [Часть ${a.part}] Вопрос: ${a.question}\nОтвет (${a.seconds} с): ${a.text || "(молчание)"}`)
      .join("\n\n");

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY as string,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        system:
          "Ты — строгий, но доброжелательный экзаменатор устной части экзамена по русскому языку как иностранному. " +
          "Тебе дают расшифровку ответов (распознавание речи, без пунктуации). Оцени по четырём критериям от 0 до 100: " +
          "fluency (беглость и связность), lexical (словарный запас), grammar (грамматика), pronunciation (произношение — оценивай осторожно, по косвенным признакам). " +
          "Ответь ТОЛЬКО JSON без markdown: " +
          '{"scores":{"fluency":0,"lexical":0,"grammar":0,"pronunciation":0},"summary":"","strengths":[""],"improvements":[""],"notes":[{"index":0,"note":""}]}. ' +
          "improvements — конкретные ошибки из ответов с исправлением в виде «было → правильно». Пиши по-русски, коротко.",
        messages: [
          {
            role: "user",
            content: `Расшифровка:\n\n${transcript}\n\nЧёткость речи по уверенности распознавания (0–100): ${
              answers.some((a) => typeof a.confidence === "number") ? base.scores.pronunciation : "нет данных"
            }`,
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic API error ${res.status}`);
    const data = await res.json();
    const raw: string = data?.content?.find((b: any) => b.type === "text")?.text ?? "";
    const parsed = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));

    const s = parsed.scores ?? {};
    const pick = (k: keyof ExamResult["scores"]) =>
      typeof s[k] === "number" ? Math.max(0, Math.min(100, Math.round(s[k]))) : base.scores[k];
    const scores = {
      fluency: pick("fluency"),
      lexical: pick("lexical"),
      grammar: pick("grammar"),
      pronunciation: pick("pronunciation"),
    };
    const overall = Math.round((scores.fluency + scores.lexical + scores.grammar + scores.pronunciation) / 4);
    const notes: { index: number; note: string }[] = Array.isArray(parsed.notes) ? parsed.notes : [];

    const result: ExamResult = {
      ...base,
      scores,
      overall,
      level: levelFromScore(overall),
      summary: parsed.summary || base.summary,
      strengths: parsed.strengths?.length ? parsed.strengths : base.strengths,
      improvements: parsed.improvements?.length ? parsed.improvements : base.improvements,
      answers: base.answers.map((a, i) => ({ ...a, note: notes.find((n) => n.index === i)?.note || a.note })),
      source: "ai",
    };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(base);
  }
}
