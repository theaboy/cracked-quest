import { create } from "zustand";

interface XpState {
  xpTotal: number;
  streakDays: number;
  lastStudyDate: string | null;
  setXp: (xp: number) => void;
  setStreak: (days: number) => void;
  setLastStudyDate: (date: string) => void;
  addXp: (amount: number) => void;
}

export const useXpStore = create<XpState>((set) => ({
  xpTotal: 0,
  streakDays: 0,
  lastStudyDate: null,
  setXp: (xp) => set({ xpTotal: xp }),
  setStreak: (days) => set({ streakDays: days }),
  setLastStudyDate: (date) => set({ lastStudyDate: date }),
  // TODO: Replace with server-side award_xp Edge Function call (source: 'quiz') before production
  addXp: (amount) => set((s) => ({ xpTotal: s.xpTotal + amount })),
}));
