import { create } from "zustand";

interface StudyState {
  isStudying: boolean;
  isPaused: boolean;
  mode: "focus" | "deep" | null;
  elapsedSeconds: number;
  currentTopicId: string | null;
  startSession: (mode: "focus" | "deep", topicId: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  resetSession: () => void;
  tick: () => void;
}

export const useStudyStore = create<StudyState>((set) => ({
  isStudying: false,
  isPaused: false,
  mode: null,
  elapsedSeconds: 0,
  currentTopicId: null,
  startSession: (mode, topicId) =>
    set({ isStudying: true, isPaused: false, mode, currentTopicId: topicId, elapsedSeconds: 0 }),
  pauseSession: () => set({ isPaused: true }),
  resumeSession: () => set({ isPaused: false }),
  endSession: () => set({ isStudying: false, isPaused: false, mode: null, currentTopicId: null }),
  resetSession: () =>
    set({ isStudying: false, isPaused: false, mode: null, currentTopicId: null, elapsedSeconds: 0 }),
  tick: () => set((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 })),
}));
