import { NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai/provider";
import type { ChatMessage } from "@/lib/ai/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages ?? [];
    const provider = getAIProvider();
    const result = await provider.chat(messages, {
      level: body.level ?? "A2",
      topic: body.topic,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { reply: "Что-то пошло не так. Попробуй ещё раз." },
      { status: 200 }
    );
  }
}
