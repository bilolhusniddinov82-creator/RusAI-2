import { create } from "zustand";
import { persist } from "zustand/middleware";

export type VocabStatus = "known" | "unknown" | "repeat";

export interface LevelTestAttempt {
  /** When the last attempt finished (ms since epoch). */
  at: number;
  score: number;
  passed: boolean;
}

interface LearningState {
  vocabStatus: Record<string, VocabStatus>;
  lessonProgress: Record<string, number>;
  achievements: string[];
  unlockedVocabBatch: number;
  /** Last level-up exam attempt, keyed by the level being tested (e.g. "A2"). */
  levelTests: Record<string, LevelTestAttempt>;
  setVocabStatus: (word: string, status: VocabStatus) => void;
  setLessonProgress: (lessonId: string, pct: number) => void;
  unlockAchievement: (id: string) => void;
  unlockVocabBatch: (batch: number) => void;
  recordLevelTest: (level: string, attempt: LevelTestAttempt) => void;
  /** Clears all learning history — used when a new learner signs up. */
  resetAll: () => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set) => ({
      vocabStatus: {},
      lessonProgress: {},
      achievements: [],
      unlockedVocabBatch: 1,
      levelTests: {},
      setVocabStatus: (word, status) =>
        set((s) => ({ vocabStatus: { ...s.vocabStatus, [word]: status } })),
      setLessonProgress: (lessonId, pct) =>
        set((s) => ({
          lessonProgress: { ...s.lessonProgress, [lessonId]: pct },
        })),
      unlockAchievement: (id) =>
        set((s) =>
          s.achievements.includes(id)
            ? s
            : { achievements: [...s.achievements, id] }
        ),
      unlockVocabBatch: (batch) =>
        set((s) => (s.unlockedVocabBatch >= batch ? s : { unlockedVocabBatch: batch })),
      recordLevelTest: (level, attempt) =>
        set((s) => ({ levelTests: { ...s.levelTests, [level]: attempt } })),
      resetAll: () =>
        set({ vocabStatus: {}, lessonProgress: {}, achievements: [], unlockedVocabBatch: 1, levelTests: {} }),
    }),
    {
      name: "rusai-learning",
      version: 2,
      // v1 pre-filled achievements nobody had earned, and its progress belonged
      // to the demo user that the user store also drops — start clean.
      migrate: (persisted: any, version) =>
        version < 2
          ? { vocabStatus: {}, lessonProgress: {}, achievements: [], unlockedVocabBatch: 1, levelTests: {} }
          : persisted,
    }
  )
);
