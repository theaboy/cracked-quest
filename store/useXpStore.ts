import { create } from "zustand";

interface XpState {
  xpTotal: number;
  streakDays: number;
  setXp: (xp: number) => void;
  setStreak: (days: number) => void;
  addXp: (amount: number) => void;
}

export const useXpStore = create<XpState>((set) => ({
  xpTotal: 0,
  streakDays: 0,
  setXp: (xp) => set({ xpTotal: xp }),
  setStreak: (days) => set({ streakDays: days }),
  // TODO: Replace with server-side award_xp Edge Function call (source: 'quiz') before production
  addXp: (amount) => set((s) => ({ xpTotal: s.xpTotal + amount })),
}));
