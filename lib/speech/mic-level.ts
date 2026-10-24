"use client";

import { useEffect, useRef, useState } from "react";

// Reads real microphone amplitude via the Web Audio API so the voice orb
// can react to actual volume while listening (separate from the
// SpeechRecognition stream, which doesn't expose audio levels).
export function useMicLevel(active: boolean) {
  const [level, setLevel] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setLevel(0);
      return;
    }

    let cancelled = false;
    let stream: MediaStream | null = null;
    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;

    navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new Ctx();
        const source = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.6;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);

        const loop = () => {
          if (!analyser) return;
          analyser.getByteFrequencyData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) sum += data[i];
          const avg = sum / data.length;
          setLevel(Math.min(1, avg / 90));
          rafRef.current = requestAnimationFrame(loop);
        };
        loop();
      })
      .catch(() => {
        // Mic unavailable/denied — orb falls back to its idle animation.
      });

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stream?.getTracks().forEach((t) => t.stop());
      audioCtx?.close().catch(() => {});
    };
  }, [active]);

  return level;
}
