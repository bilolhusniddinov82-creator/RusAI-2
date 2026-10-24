import { AIContext, AIProvider, ChatMessage } from "./types";
import { DemoAIProvider } from "./demo-provider";

// Provider abstraction: swap in a real LLM by setting ANTHROPIC_API_KEY or
// OPENAI_API_KEY in the environment. With no keys set, RusAI runs entirely
// on DemoAIProvider and never crashes.

export function getAIProvider(): AIProvider {
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;

  if (!hasAnthropicKey && !hasOpenAIKey) {
    return new DemoAIProvider();
  }

  return {
    async chat(messages: ChatMessage[], context: AIContext) {
      try {
        if (hasAnthropicKey) {
          const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-api-key": process.env.ANTHROPIC_API_KEY as string,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-6",
              max_tokens: 400,
              system: `Ты — дружелюбный AI-репетитор русского языка. Уровень ученика: ${context.level}. Мягко исправляй ошибки, объясняй кратко и задавай follow-up вопрос, чтобы продолжить разговор. Если ученик пишет не по-русски (например, по-узбекски или по-английски латиницей), переведи его фразу на русский и предложи повторить её по-русски.`,
              messages: messages.map((m) => ({ role: m.role, content: m.content })),
            }),
          });
          if (!res.ok) throw new Error(`Anthropic API error ${res.status}`);
          const data = await res.json();
          const text =
            data?.content?.find((b: any) => b.type === "text")?.text ??
            "Извини, не удалось получить ответ.";
          return { reply: text };
        }

        // OpenAI-compatible fallback path.
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `Ты — дружелюбный AI-репетитор русского языка. Уровень ученика: ${context.level}.`,
              },
              ...messages,
            ],
          }),
        });
        if (!res.ok) throw new Error(`OpenAI API error ${res.status}`);
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content ?? "Извини, не удалось получить ответ.";
        return { reply: text };
      } catch (err) {
        // Never let a missing/invalid key or network error break the lesson —
        // fall back to the demo provider transparently.
        return new DemoAIProvider().chat(messages, context);
      }
    },
  };
}
