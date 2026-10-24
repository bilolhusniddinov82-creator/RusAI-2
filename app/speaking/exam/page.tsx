"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Mic, Clock, SkipForward, Square, RotateCcw, MessageSquare, Sparkles,
  Volume2, ChevronDown, Check, AlertTriangle, Play,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ModeTabs } from "@/components/speaking/mode-tabs";
import { VoiceOrb, type OrbPhase } from "@/components/speaking/voice-orb";
import { ProgressRing } from "@/components/ui/progress-ring";
import { speak, stopSpeaking, primeSpeech, hasAnyVoice, hasRussianVoice } from "@/lib/speech/tts";
import { useSpeechRecognition } from "@/lib/speech/stt";
import { useMicLevel } from "@/lib/speech/mic-level";
import { EXAM_TIMING, EXAMINER_LINES, pickExamSet, type ExamSet } from "@/lib/speaking/exam-data";
import { CRITERION_LABELS, type ExamAnswer, type ExamResult, type CriterionScores } from "@/lib/speaking/exam-scoring";
import { useUserStore } from "@/store/user-store";
import { useLearningStore } from "@/store/learning-store";
import { cn } from "@/lib/utils";

type Stage = "intro" | "examiner" | "answering" | "prep" | "scoring" | "result";

interface Captured {
  text: string;
  seconds: number;
  confidence: number | null;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function fmt(sec: number) {
  const s = Math.max(0, Math.ceil(sec));
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

export default function SpeakingExamPage() {
  const addXp = useUserStore((s) => s.addXp);
  const addMinutes = useUserStore((s) => s.addMinutes);
  const setLessonProgress = useLearningStore((s) => s.setLessonProgress);
  const unlockAchievement = useLearningStore((s) => s.unlockAchievement);

  const [examSet, setExamSet] = useState<ExamSet | null>(null);
  const [stage, setStage] = useState<Stage>("intro");
  const [part, setPart] = useState<1 | 2 | 3>(1);
  const [qIndex, setQIndex] = useState(0);
  const [caption, setCaption] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeTotal, setTimeTotal] = useState(1);
  const [showCard, setShowCard] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [voiceWarning, setVoiceWarning] = useState<string | null>(null);
  const [openAnswer, setOpenAnswer] = useState<number | null>(null);

  const { listening, transcript, interim, start, stop, supported, error, confidence, lastHeardAt } =
    useSpeechRecognition({ continuous: true });
  const micLevel = useMicLevel(stage === "answering");

  // Mirror the recognizer's state into refs so the async exam runner always
  // reads current values instead of the ones captured when it started.
  const transcriptRef = useRef("");
  const interimRef = useRef("");
  const lastHeardRef = useRef(0);
  const confidenceRef = useRef<number | null>(null);
  const errorRef = useRef<string | null>(null);
  transcriptRef.current = transcript;
  interimRef.current = interim;
  lastHeardRef.current = lastHeardAt;
  confidenceRef.current = confidence;
  errorRef.current = error;

  const segmentsRef = useRef<string[]>([]);
  const confsRef = useRef<number[]>([]);
  const answerStartRef = useRef(0);
  const deadlineRef = useRef(0);
  const silenceMsRef = useRef(EXAM_TIMING.silenceMs);
  const answerResolver = useRef<((c: Captured) => void) | null>(null);
  const prepResolver = useRef<(() => void) | null>(null);
  const finishingRef = useRef(false);
  const abortedRef = useRef(false);
  const answersRef = useRef<ExamAnswer[]>([]);

  useEffect(() => {
    (async () => {
      const any = await hasAnyVoice();
      if (!any) {
        setVoiceWarning("В браузере нет голосов для озвучки — вопросы будут только текстом. Лучше всего работает Chrome.");
        return;
      }
      if (!(await hasRussianVoice())) setVoiceWarning("Русский голос не найден — экзаменатор будет говорить другим голосом.");
    })();
    return () => {
      abortedRef.current = true;
      stopSpeaking();
    };
  }, []);

  // ---- Answer capture -----------------------------------------------------

  function collectAnswer(): Captured {
    const text = [...segmentsRef.current, transcriptRef.current].join(" ").replace(/\s+/g, " ").trim();
    if (confidenceRef.current) confsRef.current.push(confidenceRef.current);
    const confs = confsRef.current;
    return {
      text,
      seconds: Math.round((Date.now() - answerStartRef.current) / 1000),
      confidence: confs.length ? confs.reduce((a, b) => a + b, 0) / confs.length : null,
    };
  }

  function finishAnswer() {
    if (!answerResolver.current || finishingRef.current) return;
    finishingRef.current = true;
    stop();
    // Chrome delivers the last final result shortly after stop(), so give it
    // a moment before reading the transcript.
    setTimeout(() => {
      const resolve = answerResolver.current;
      answerResolver.current = null;
      finishingRef.current = false;
      resolve?.(collectAnswer());
    }, 600);
  }

  function listenForAnswer(limitSec: number, silenceMs = EXAM_TIMING.silenceMs): Promise<Captured> {
    return new Promise((resolve) => {
      segmentsRef.current = [];
      confsRef.current = [];
      answerStartRef.current = Date.now();
      deadlineRef.current = Date.now() + limitSec * 1000;
      silenceMsRef.current = silenceMs;
      setTimeTotal(limitSec);
      setTimeLeft(limitSec);
      answerResolver.current = resolve;
      setStage("answering");
      start();
    });
  }

  // The browser ends recognition on its own after long pauses; while the
  // learner still has time, keep what was said and listen again.
  useEffect(() => {
    if (listening || !answerResolver.current || finishingRef.current) return;
    if (errorRef.current) {
      finishAnswer();
      return;
    }
    if (transcriptRef.current) segmentsRef.current.push(transcriptRef.current);
    if (confidenceRef.current) confsRef.current.push(confidenceRef.current);
    if (Date.now() < deadlineRef.current) {
      const id = setTimeout(() => answerResolver.current && !finishingRef.current && start(), 150);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  // Timer + silence detection, shared by answering and preparation.
  useEffect(() => {
    if (stage !== "answering" && stage !== "prep") return;
    const id = setInterval(() => {
      const left = (deadlineRef.current - Date.now()) / 1000;
      setTimeLeft(left);
      if (stage === "prep") {
        if (left <= 0) prepResolver.current?.();
        return;
      }
      if (left <= 0) return finishAnswer();
      const saidSomething =
        segmentsRef.current.length > 0 || !!transcriptRef.current || !!interimRef.current;
      if (saidSomething && !interimRef.current && Date.now() - lastHeardRef.current > silenceMsRef.current) {
        finishAnswer();
      }
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // ---- Examiner -----------------------------------------------------------

  async function say(text: string) {
    if (abortedRef.current) return;
    setStage("examiner");
    setCaption(text);
    const ok = await speak(text);
    // Without a working voice, leave the text on screen long enough to read.
    if (!ok) await delay(Math.min(6000, 1200 + text.length * 45));
  }

  function waitPrep(sec: number) {
    return new Promise<void>((resolve) => {
      deadlineRef.current = Date.now() + sec * 1000;
      setTimeTotal(sec);
      setTimeLeft(sec);
      prepResolver.current = () => {
        prepResolver.current = null;
        resolve();
      };
      setStage("prep");
    });
  }

  async function ask(p: 1 | 2 | 3, i: number, question: string, limit: number, silenceMs?: number) {
    if (abortedRef.current) return;
    setPart(p);
    setQIndex(i);
    await say(question);
    if (abortedRef.current) return;
    const captured = await listenForAnswer(limit, silenceMs);
    answersRef.current.push({ part: p, question, ...captured });
  }

  async function runExam() {
    primeSpeech();
    const set = pickExamSet();
    setExamSet(set);
    setResult(null);
    setShowCard(false);
    abortedRef.current = false;
    answersRef.current = [];

    await say(EXAMINER_LINES.welcome);
    await say(EXAMINER_LINES.part1Intro);
    for (let i = 0; i < set.part1.length; i++) {
      await ask(1, i, set.part1[i], EXAM_TIMING.part1Answer);
      if (i < set.part1.length - 1) await say(EXAMINER_LINES.acks[i % EXAMINER_LINES.acks.length]);
    }

    if (!abortedRef.current) {
      setPart(2);
      setQIndex(0);
      await say(EXAMINER_LINES.part2Intro);
      setShowCard(true);
      if (!abortedRef.current) await waitPrep(EXAM_TIMING.part2Prep);
      await say(EXAMINER_LINES.part2Start);
      if (!abortedRef.current) {
        // A monologue has natural thinking pauses, so allow longer silence.
        const captured = await listenForAnswer(EXAM_TIMING.part2Talk, 7000);
        answersRef.current.push({ part: 2, question: set.part2.topic, ...captured });
      }
      setShowCard(false);
    }

    if (!abortedRef.current) {
      await say(EXAMINER_LINES.part3Intro);
      for (let i = 0; i < set.part3.length; i++) {
        await ask(3, i, set.part3[i], EXAM_TIMING.part3Answer, 4500);
        if (i < set.part3.length - 1) await say(EXAMINER_LINES.acks[(i + 2) % EXAMINER_LINES.acks.length]);
      }
    }

    if (!abortedRef.current) await say(EXAMINER_LINES.finish);
    await evaluate();
  }

  async function evaluate() {
    setStage("scoring");
    setCaption("Анализирую ответы…");
    try {
      const res = await fetch("/api/ai/exam", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answers: answersRef.current }),
      });
      const data: ExamResult = await res.json();
      setResult(data);
      if (data.stats.totalWords > 0) {
        addXp(200);
        addMinutes(Math.round(answersRef.current.reduce((s, a) => s + a.seconds, 0) / 60));
        setLessonProgress("speaking-exam", 100);
        unlockAchievement("first-conversation");
      }
    } finally {
      setStage("result");
    }
  }

  // Ends the exam early but still grades whatever was answered.
  function endEarly() {
    abortedRef.current = true;
    stopSpeaking();
    prepResolver.current?.();
    if (answerResolver.current) finishAnswer();
  }

  // ---- UI -------------------------------------------------------------------

  const orbPhase: OrbPhase =
    stage === "examiner" ? "speaking" : stage === "answering" ? "listening" : stage === "scoring" ? "thinking" : "idle";
  const inExam = stage === "examiner" || stage === "answering" || stage === "prep";
  const totalQ = examSet ? { 1: examSet.part1.length, 2: 1, 3: examSet.part3.length }[part] : 0;
  const liveText = [...segmentsRef.current, transcript, interim].join(" ").trim();

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 py-6 sm:p-6 lg:p-8 animate-in">
        <div className="max-w-2xl mx-auto">
          <ModeTabs />

          {stage === "intro" && (
            <div className="animate-in">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  <Sparkles className="w-3 h-3" /> AI-экзаменатор
                </div>
                <h1 className="text-3xl font-bold font-display mb-3">Устный экзамен</h1>
                <p className="text-slate-400 max-w-md mx-auto">
                  Экзаменатор задаёт вопросы голосом, микрофон включается сам. Просто отвечай — когда замолчишь,
                  начнётся следующий вопрос.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                {[
                  { n: 1, title: "Интервью", desc: "4 вопроса о тебе", time: "~2 мин" },
                  { n: 2, title: "Монолог", desc: "Карточка + 1 мин подготовки", time: "~3 мин" },
                  { n: 3, title: "Дискуссия", desc: "3 вопроса по теме", time: "~3 мин" },
                ].map((p) => (
                  <div key={p.n} className="card p-4">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono font-bold text-sm flex items-center justify-center mb-3">
                      {p.n}
                    </div>
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{p.desc}</p>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {p.time}
                    </p>
                  </div>
                ))}
              </div>

              <div className="card p-4 mb-6 text-sm text-slate-300 space-y-1.5">
                <p className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Разреши доступ к микрофону и надень наушники.</p>
                <p className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Отвечай полными предложениями, приводи причины и примеры.</p>
                <p className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Оценка по 4 критериям: беглость, словарь, грамматика, произношение.</p>
              </div>

              {(voiceWarning || !supported) && (
                <p className="text-xs text-amber-400 mb-4 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {!supported ? "Распознавание речи не поддерживается этим браузером — открой страницу в Chrome или Edge." : voiceWarning}
                </p>
              )}

              <button
                onClick={runExam}
                disabled={!supported}
                className="group w-full py-4 rounded-2xl btn-primary font-semibold text-lg flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" /> Начать экзамен
              </button>
            </div>
          )}

          {(inExam || stage === "scoring") && (
            <div className="animate-in">
              {/* Part stepper */}
              <div className="flex items-center gap-2 mb-6">
                {([1, 2, 3] as const).map((p) => (
                  <div key={p} className="flex-1">
                    <div
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        p < part || stage === "scoring" ? "bg-emerald-500" : p === part ? "bg-gradient-to-r from-indigo-500 to-violet-500" : "bg-slate-800"
                      )}
                    />
                    <p className={cn("text-[11px] mt-1.5 font-medium", p === part ? "text-indigo-400" : "text-slate-500")}>
                      Часть {p}
                      {p === part && totalQ > 1 && stage !== "scoring" && (
                        <span className="text-slate-500 font-mono"> · {qIndex + 1}/{totalQ}</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="card rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center">
                <VoiceOrb phase={orbPhase} level={micLevel} speakingVariant={qIndex % 3} disabled />

                <p className="text-xs mt-4 text-slate-500 h-4 flex items-center gap-1.5">
                  {stage === "examiner" && <><Volume2 className="w-3.5 h-3.5" /> Экзаменатор говорит…</>}
                  {stage === "answering" && (
                    <><span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Твой ответ — говори</>
                  )}
                  {stage === "prep" && <>Подготовка — можешь делать заметки</>}
                  {stage === "scoring" && <>Экзаменатор оценивает…</>}
                </p>

                <p className="mt-4 text-lg sm:text-xl font-medium leading-relaxed min-h-[3.5rem] max-w-lg">{caption}</p>

                {showCard && examSet && (
                  <div className="mt-5 w-full text-left rounded-2xl border border-indigo-500/40 bg-indigo-500/5 p-5 animate-in">
                    <p className="text-xs uppercase tracking-wide text-indigo-400 mb-2 font-semibold">Карточка</p>
                    <p className="font-semibold mb-3">{examSet.part2.topic}</p>
                    <p className="text-xs text-slate-400 mb-1.5">Расскажите:</p>
                    <ul className="space-y-1 text-sm text-slate-300">
                      {examSet.part2.points.map((pt) => (
                        <li key={pt} className="flex gap-2"><span className="text-indigo-400">•</span>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {(stage === "answering" || stage === "prep") && (
                  <div className="w-full mt-6">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {stage === "prep" ? "Подготовка" : "Осталось"}</span>
                      <span className={cn(timeLeft <= 10 && "text-rose-400")}>{fmt(timeLeft)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-[width] duration-300 ease-linear",
                          stage === "prep" ? "bg-amber-500" : timeLeft <= 10 ? "bg-rose-500" : "bg-gradient-to-r from-indigo-500 to-violet-500"
                        )}
                        style={{ width: `${Math.max(0, (timeLeft / timeTotal) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {stage === "answering" && (
                  <div className="w-full mt-4 rounded-xl bg-slate-800/60 p-4 text-left min-h-[72px]">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1 flex items-center gap-1.5">
                      <Mic className="w-3 h-3" /> Ты говоришь
                    </p>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {liveText || <span className="text-slate-500">Слушаю…</span>}
                    </p>
                  </div>
                )}

                {error && stage === "answering" && <p className="mt-3 text-xs text-rose-400">🎙 {error}</p>}

                <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                  {stage === "answering" && (
                    <button onClick={finishAnswer} className="px-5 py-2.5 rounded-xl btn-primary text-sm font-medium flex items-center gap-2">
                      <Check className="w-4 h-4" /> Я закончил
                    </button>
                  )}
                  {stage === "prep" && (
                    <button onClick={() => prepResolver.current?.()} className="px-5 py-2.5 rounded-xl btn-primary text-sm font-medium flex items-center gap-2">
                      <SkipForward className="w-4 h-4" /> Я готов
                    </button>
                  )}
                  {inExam && (
                    <button onClick={endEarly} className="px-4 py-2.5 rounded-xl btn-ghost text-sm flex items-center gap-2">
                      <Square className="w-3.5 h-3.5" /> Завершить экзамен
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {stage === "result" && result && (
            <ResultView
              result={result}
              openAnswer={openAnswer}
              setOpenAnswer={setOpenAnswer}
              onRetry={() => {
                setStage("intro");
                setResult(null);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function ResultView({
  result,
  openAnswer,
  setOpenAnswer,
  onRetry,
}: {
  result: ExamResult;
  openAnswer: number | null;
  setOpenAnswer: (i: number | null) => void;
  onRetry: () => void;
}) {
  return (
    <div className="animate-in space-y-5">
      <div className="card rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ProgressRing pct={result.overall} size={120} />
          <div className="text-center sm:text-left">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Твой уровень говорения</p>
            <p className="text-5xl font-bold font-display text-gradient mb-2">{result.level}</p>
            <p className="text-sm text-slate-300 max-w-sm">{result.summary}</p>
            <p className="text-[11px] text-slate-500 mt-2">
              {result.source === "ai" ? "Оценено AI-экзаменатором" : "Оценка по расшифровке речи (демо-режим)"}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 mt-8">
          {(Object.keys(CRITERION_LABELS) as (keyof CriterionScores)[]).map((k) => (
            <div key={k}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-300">{CRITERION_LABELS[k]}</span>
                <span className="font-mono font-semibold">{result.scores[k]}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    result.scores[k] >= 70 ? "bg-emerald-500" : result.scores[k] >= 45 ? "bg-gradient-to-r from-indigo-500 to-violet-500" : "bg-amber-500"
                  )}
                  style={{ width: `${result.scores[k]}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6 text-center">
          <div className="rounded-xl bg-slate-800/60 p-3">
            <p className="text-lg font-bold font-mono">{result.stats.totalWords}</p>
            <p className="text-[11px] text-slate-400">слов сказано</p>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-3">
            <p className="text-lg font-bold font-mono">{result.stats.wpm}</p>
            <p className="text-[11px] text-slate-400">слов в минуту</p>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-3">
            <p className="text-lg font-bold font-mono">{result.stats.uniqueWords}</p>
            <p className="text-[11px] text-slate-400">разных слов</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="card p-5">
          <p className="text-sm font-semibold text-emerald-400 mb-3">Что получилось</p>
          <ul className="space-y-2 text-sm text-slate-300">
            {result.strengths.map((s) => (
              <li key={s} className="flex gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />{s}</li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <p className="text-sm font-semibold text-amber-400 mb-3">Что улучшить</p>
          <ul className="space-y-2 text-sm text-slate-300">
            {result.improvements.map((s) => (
              <li key={s} className="flex gap-2"><span className="text-amber-400 shrink-0">→</span>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card p-5">
        <p className="text-sm font-semibold mb-3">Твои ответы</p>
        <div className="space-y-2">
          {result.answers.map((a, i) => (
            <div key={i} className="rounded-xl border border-slate-800 bg-slate-800/30">
              <button
                onClick={() => setOpenAnswer(openAnswer === i ? null : i)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 shrink-0">Ч{a.part}</span>
                <span className="text-sm flex-1 min-w-0 truncate">{a.question}</span>
                <span className="text-[11px] text-slate-500 font-mono shrink-0">{a.words} сл.</span>
                <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform shrink-0", openAnswer === i && "rotate-180")} />
              </button>
              {openAnswer === i && (
                <div className="px-4 pb-4 animate-in">
                  <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => speak(a.question)} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" /> Вопрос
                    </button>
                    <span className="text-[11px] text-slate-500 font-mono">{a.seconds} с</span>
                  </div>
                  <p className="text-sm text-slate-300 rounded-lg bg-slate-900/60 p-3 mb-2 leading-relaxed">
                    {a.text || <span className="text-slate-500 italic">Нет ответа</span>}
                  </p>
                  <p className="text-xs text-slate-400">💡 {a.note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onRetry} className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" /> Пройти ещё раз
        </button>
        <Link href="/speaking" className="flex-1 py-3 rounded-xl btn-ghost font-medium flex items-center justify-center gap-2">
          <MessageSquare className="w-4 h-4" /> Свободный разговор
        </Link>
      </div>
    </div>
  );
}
