import { NextResponse } from "next/server";

// Speaking/writing feedback endpoint. Without a real speech/LLM provider
// configured this returns realistic simulated scores so the UI always has
// something meaningful to show (see MASTER BUILD PROMPT §22 demo-mode rule).
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const base = 70 + Math.floor(Math.random() * 20);
  return NextResponse.json({
    pronunciation: base + Math.floor(Math.random() * 8),
    grammar: base - Math.floor(Math.random() * 6),
    vocabulary: base + Math.floor(Math.random() * 10),
    fluency: base - Math.floor(Math.random() * 4),
    feedback:
      "Ты хорошо используешь прошедшее время. Попробуй использовать больше связующих слов, таких как «потом» и «поэтому».",
    text: body?.text ?? null,
  });
}
