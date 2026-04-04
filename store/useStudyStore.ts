import { create } from "zustand";

const DEEP_SESSION_DURATION = 2.5 * 60 * 60; // 2h30 in seconds
const BREAK_INTERVAL = 30 * 60; // 30 min in seconds
const BREAK_DURATION = 5 * 60; // 5 min in seconds

interface StudyState {
  isStudying: boolean;
  isPaused: boolean;
  mode: "focus" | "deep" | null;
  elapsedSeconds: number;
  currentTopicId: string | null;
  // Deep Mode specific
  deepSecondsLeft: number;
  nextBreakIn: number;
  isOnBreak: boolean;
  breakSecondsLeft: number;
  // Actions
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
  deepSecondsLeft: 0,
  nextBreakIn: 0,
  isOnBreak: false,
  breakSecondsLeft: 0,
  startSession: (mode, topicId) =>
    set({
      isStudying: true,
      isPaused: false,
      mode,
      currentTopicId: topicId,
      elapsedSeconds: 0,
      isOnBreak: false,
      breakSecondsLeft: 0,
      deepSecondsLeft: mode === "deep" ? DEEP_SESSION_DURATION : 0,
      nextBreakIn: mode === "deep" ? BREAK_INTERVAL : 0,
    }),
  pauseSession: () => set({ isPaused: true }),
  resumeSession: () => set({ isPaused: false }),
  endSession: () => set({ isStudying: false, isPaused: false, mode: null, currentTopicId: null }),
  resetSession: () =>
    set({
      isStudying: false, isPaused: false, mode: null, currentTopicId: null,
      elapsedSeconds: 0, isOnBreak: false, breakSecondsLeft: 0,
      deepSecondsLeft: 0, nextBreakIn: 0,
    }),
  tick: () =>
    set((s) => {
      if (s.mode === "deep") {
        const newDeep = s.deepSecondsLeft - 1;
        const newBreakIn = s.nextBreakIn - 1;
        // Session complete
        if (newDeep <= 0) {
          return { deepSecondsLeft: 0, nextBreakIn: 0, isStudying: false };
        }
        // Time for a break
        if (newBreakIn <= 0) {
          return {
            deepSecondsLeft: newDeep,
            nextBreakIn: 0,
            isOnBreak: true,
            isPaused: true,
            breakSecondsLeft: BREAK_DURATION,
            elapsedSeconds: s.elapsedSeconds + 1,
          };
        }
        return {
          deepSecondsLeft: newDeep,
          nextBreakIn: newBreakIn,
          elapsedSeconds: s.elapsedSeconds + 1,
        };
      }
      // Focus mode — count up
      return { elapsedSeconds: s.elapsedSeconds + 1 };
    }),
  startBreak: () => set({ isOnBreak: true, isPaused: true, breakSecondsLeft: BREAK_DURATION }),
  tickBreak: () =>
    set((s) => {
      const next = s.breakSecondsLeft - 1;
      if (next <= 0) {
        return { isOnBreak: false, breakSecondsLeft: 0 };
      }
      return { breakSecondsLeft: next };
    }),
  endBreak: () => set({ isOnBreak: false, breakSecondsLeft: 0, isPaused: false, nextBreakIn: BREAK_INTERVAL }),
}));
