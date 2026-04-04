import { create } from "zustand";

interface StudyState {
  isStudying: boolean;
  isPaused: boolean;
  mode: "focus" | "deep" | null;
  elapsedSeconds: number;
  currentTopicId: string | null;
  isOnBreak: boolean;
  breakSecondsLeft: number;
  startSession: (mode: "focus" | "deep", topicId: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  resetSession: () => void;
  tick: () => void;
  startBreak: () => void;
  tickBreak: () => void;
  endBreak: () => void;
}

export const useStudyStore = create<StudyState>((set) => ({
  isStudying: false,
  isPaused: false,
  mode: null,
  elapsedSeconds: 0,
  currentTopicId: null,
  isOnBreak: false,
  breakSecondsLeft: 0,
  startSession: (mode, topicId) =>
    set({ isStudying: true, isPaused: false, mode, currentTopicId: topicId, elapsedSeconds: 0, isOnBreak: false, breakSecondsLeft: 0 }),
  pauseSession: () => set({ isPaused: true }),
  resumeSession: () => set({ isPaused: false }),
  endSession: () => set({ isStudying: false, isPaused: false, mode: null, currentTopicId: null }),
  resetSession: () =>
    set({ isStudying: false, isPaused: false, mode: null, currentTopicId: null, elapsedSeconds: 0, isOnBreak: false, breakSecondsLeft: 0 }),
  tick: () => set((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 })),
  startBreak: () => set({ isOnBreak: true, isPaused: true, breakSecondsLeft: 300 }),
  tickBreak: () =>
    set((s) => {
      const next = s.breakSecondsLeft - 1;
      if (next <= 0) {
        return { isOnBreak: false, breakSecondsLeft: 0 };
      }
      return { breakSecondsLeft: next };
    }),
  endBreak: () => set({ isOnBreak: false, breakSecondsLeft: 0, isPaused: false }),
}));
