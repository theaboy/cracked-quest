import { create } from "zustand";

interface StudyState {
  isStudying: boolean;
  mode: "focus" | "deep" | null;
  elapsedSeconds: number;
  currentTopicId: string | null;
  startSession: (mode: "focus" | "deep", topicId: string) => void;
  endSession: () => void;
  tick: () => void;
}

export const useStudyStore = create<StudyState>((set) => ({
  isStudying: false,
  mode: null,
  elapsedSeconds: 0,
  currentTopicId: null,
  startSession: (mode, topicId) =>
    set({ isStudying: true, mode, currentTopicId: topicId, elapsedSeconds: 0 }),
  endSession: () =>
    set({ isStudying: false, mode: null, currentTopicId: null, elapsedSeconds: 0 }),
  tick: () => set((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 })),
}));
