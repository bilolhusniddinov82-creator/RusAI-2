"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";

export type OrbPhase = "idle" | "listening" | "thinking" | "speaking" | "correct" | "incorrect";

const PALETTE: Record<OrbPhase, [string, string]> = {
  idle: ["#3ECF5E", "#22B8F0"],
  listening: ["#f59e0b", "#fb923c"],
  thinking: ["#64748b", "#94a3b8"],
  speaking: ["#B57BFF", "#22B8F0"],
  correct: ["#3b82f6", "#22d3ee"],
  incorrect: ["#ef4444", "#f43f5e"],
};

interface VoiceOrbProps {
  phase: OrbPhase;
  level?: number; // 0..1 real mic amplitude, used while listening
  /** 0, 1, or 2 — picks a different movement pattern each turn while speaking. */
  speakingVariant?: number;
  onTap?: () => void;
  disabled?: boolean;
}

// A friendly pill-shaped mascot with blinking eyes, instead of a plain
// waveform orb — it wiggles while "talking" and its eyes blink on their own.
export function VoiceOrb({ phase, level = 0, speakingVariant = 0, onTap, disabled }: VoiceOrbProps) {
  const [pulse, setPulse] = useState(0);
  const [mouthOpen, setMouthOpen] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "speaking") {
      setPulse(0);
      return;
    }
    const start = performance.now();
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      let v = 0;
      if (speakingVariant === 0) {
        v = 0.5 + 0.3 * Math.sin(t * 6) + 0.25 * Math.sin(t * 13 + 1);
      } else if (speakingVariant === 1) {
        v = 0.45 + 0.35 * Math.sin(t * 14) + 0.3 * Math.sin(t * 27 + 2) + 0.15 * Math.sin(t * 41);
      } else {
        v = 0.55 + 0.4 * Math.sin(t * 3.2);
      }
      setPulse(Math.max(0, Math.min(1, v)));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, speakingVariant]);

  // The mouth gets its OWN irregular motion (a smoothed random walk),
  // separate from the body's pulse — real talking mouths open different
  // amounts each syllable, not one smooth up-down wave. Occasional near-zero
  // dips read as consonant closures.
  useEffect(() => {
    if (phase !== "speaking") {
      setMouthOpen(0);
      return;
    }
    let current = 0.3;
    const id = setInterval(() => {
      const closureChance = Math.random() < 0.18;
      const target = closureChance ? Math.random() * 0.15 : 0.35 + Math.random() * 0.65;
      current = current * 0.45 + target * 0.55;
      setMouthOpen(Math.max(0, Math.min(1, current)));
    }, 110);
    return () => clearInterval(id);
  }, [phase]);

  const isFeedback = phase === "correct" || phase === "incorrect";
  const [c1, c2] = PALETTE[phase];

  // Squash-and-stretch on the body per phase — this is the "kimirlash"
  // (wiggle) while speaking, and a gentle jelly-reaction to real mic volume
  // while listening.
  let scaleX = 1;
  let scaleY = 1;
  if (phase === "listening") {
    scaleY = 1 + level * 0.3;
    scaleX = 1 - level * 0.1;
  } else if (phase === "speaking") {
    scaleY = 1 + pulse * 0.24;
    scaleX = 1 - pulse * 0.09;
  } else if (isFeedback) {
    scaleY = 1.12;
    scaleX = 1.12;
  }

  // The mouth opens and closes in time with the AI's own speech only — it
  // must stay still while the *user* is talking (listening phase), since
  // the mascot isn't the one speaking then. Width narrows as it opens (more
  // "O" shaped) so it doesn't read as a single flat up-down bar.
  const mouthScaleY = phase === "speaking" ? 0.45 + mouthOpen * 2.1 : 0.45;
  const mouthScaleX = phase === "speaking" ? 1.15 - mouthOpen * 0.5 : 1;

  return (
    <button
      onClick={onTap}
      disabled={disabled}
      aria-label="Голосовой ввод"
      className="relative w-56 h-36 mx-auto flex items-center justify-center disabled:cursor-default"
    >
      <div
        key={`glow-${phase}`}
        className="absolute inset-0 rounded-full blur-2xl opacity-50"
        style={{
          background: `radial-gradient(ellipse, ${c1}, transparent 70%)`,
          animation: isFeedback ? "mascot-flash 1.3s ease-out" : phase === "idle" ? "mascot-breathe 3.5s ease-in-out infinite" : undefined,
        }}
      />
      <div
        className="relative w-44 h-24 rounded-full flex flex-col items-center justify-center gap-2.5 shadow-xl border border-white/10"
        style={{
          background: `linear-gradient(135deg, ${c1}, ${c2})`,
          transform: `scale(${scaleX}, ${scaleY})`,
          transition: "transform 90ms linear, background 300ms ease",
          animation: phase === "thinking" ? "mascot-think-bob 1.8s ease-in-out infinite" : undefined,
        }}
      >
        {isFeedback ? (
          phase === "correct" ? (
            <Check className="w-9 h-9 text-white" />
          ) : (
            <X className="w-9 h-9 text-white" />
          )
        ) : (
          <>
            <div className="flex items-center gap-6">
              <span
                className="block w-3.5 h-5 rounded-full bg-[#0b1020]"
                style={{ animation: "mascot-blink 4.2s ease-in-out infinite" }}
              />
              <span
                className="block w-3.5 h-5 rounded-full bg-[#0b1020]"
                style={{ animation: "mascot-blink 4.2s ease-in-out infinite" }}
              />
            </div>
            <span
              className="block w-7 h-2.5 rounded-full bg-[#0b1020]"
              style={{
                transform: `scale(${mouthScaleX}, ${mouthScaleY})`,
                transformOrigin: "center",
                transition: "transform 90ms ease-out",
              }}
            />
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes mascot-blink {
          0%, 92%, 100% { transform: scaleY(1); }
          96% { transform: scaleY(0.1); }
        }
        @keyframes mascot-breathe {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.65; }
        }
        @keyframes mascot-think-bob {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.02); }
        }
        @keyframes mascot-flash {
          0% { transform: scale(1); opacity: 0.85; }
          40% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1.1); opacity: 0.55; }
        }
      `}</style>
    </button>
  );
}
