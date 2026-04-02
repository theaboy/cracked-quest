import { create } from "zustand";

type RankTier = "Student" | "Grinder" | "Scholar" | "Veteran" | "Elite" | "Legend";

interface XpState {
  xpTotal: number;
  rankTier: RankTier;
  streakDays: number;
  setXp: (xp: number) => void;
  setRank: (tier: RankTier) => void;
  setStreak: (days: number) => void;
}

export const useXpStore = create<XpState>((set) => ({
  xpTotal: 0,
  rankTier: "Student",
  streakDays: 0,
  setXp: (xp) => set({ xpTotal: xp }),
  setRank: (tier) => set({ rankTier: tier }),
  setStreak: (days) => set({ streakDays: days }),
}));
