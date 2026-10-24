"use client";

// Real browser text-to-speech (Web Speech API) — no API key needed.
// Includes workarounds for well-known Chrome bugs:
//  - speak() called immediately after cancel() can silently no-op, so we
//    wait a tick before speaking.
//  - Chrome auto-pauses long utterances after ~15s; we "kick" it with a
//    pause/resume heartbeat while speaking.
//  - speechSynthesis only reliably works after a user gesture on some
//    browsers, so we expose `primeSpeech()` to call from the first click.

let voicesReady: Promise<SpeechSynthesisVoice[]> | null = null;
let primed = false;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (voicesReady) return voicesReady;
  voicesReady = new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve([]);
      return;
    }
    const existing = window.speechSynthesis.getVoices();
    if (existing.length) {
      resolve(existing);
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };
    // Safety timeout in case the event never fires.
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
  });
  return voicesReady;
}

export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Call this once from a real click/tap handler (e.g. the first mic press)
// to "unlock" speech synthesis on browsers that require a user gesture
// before the first utterance will actually produce sound.
export function primeSpeech() {
  if (primed || !isSpeechSupported()) return;
  primed = true;
  try {
    const utter = new SpeechSynthesisUtterance("");
    utter.volume = 0;
    window.speechSynthesis.speak(utter);
  } catch {
    // ignore — best effort only
  }
}

export async function hasRussianVoice(): Promise<boolean> {
  const voices = await loadVoices();
  return voices.some((v) => v.lang.toLowerCase().startsWith("ru"));
}

export async function hasAnyVoice(): Promise<boolean> {
  const voices = await loadVoices();
  return voices.length > 0;
}

export async function speak(
  text: string,
  lang = "ru-RU",
  opts?: { onStart?: () => void }
): Promise<boolean> {
  if (!isSpeechSupported() || !text) return false;
  const synth = window.speechSynthesis;
  synth.cancel();

  const voices = await loadVoices();
  // Chrome bug: speak() called synchronously right after cancel() can be a
  // silent no-op. A short delay makes it reliable.
  await new Promise((r) => setTimeout(r, 60));

  // Some voices read emoji aloud ("машущая рука"), so speak only the words.
  const spoken = text.replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}️]/gu, "").trim();
  const utter = new SpeechSynthesisUtterance(spoken);
  utter.lang = lang;
  utter.rate = 0.92;
  utter.pitch = 1;
  utter.volume = 1;

  const match = voices.find((v) => v.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()));
  if (match) utter.voice = match;

  return new Promise<boolean>((resolve) => {
    // Chrome bug: long utterances silently stop after ~15s unless "kicked".
    let heartbeat: ReturnType<typeof setInterval> | null = null;
    utter.onstart = () => {
      opts?.onStart?.();
      heartbeat = setInterval(() => {
        if (!synth.speaking) {
          if (heartbeat) clearInterval(heartbeat);
          return;
        }
        synth.pause();
        synth.resume();
      }, 4000);
    };
    const finish = (ok: boolean) => {
      if (heartbeat) clearInterval(heartbeat);
      resolve(ok);
    };
    utter.onend = () => finish(true);
    utter.onerror = () => finish(false);

    synth.speak(utter);
  });
}

export function stopSpeaking() {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}
