export type RankTier = "Student" | "Grinder" | "Scholar" | "Veteran" | "Elite" | "Legend";

export interface TierInfo {
  name: RankTier;
  threshold: number;
  color: string;
  icon: string;
}

export const RANK_TIERS: TierInfo[] = [
  { name: "Student",  threshold: 0,     color: "#9896AA", icon: "🎓" },
  { name: "Grinder",  threshold: 500,   color: "#9B6DFF", icon: "⚔" },
  { name: "Scholar",  threshold: 1500,  color: "#4EFFB4", icon: "📚" },
  { name: "Veteran",  threshold: 3500,  color: "#F5C842", icon: "🛡" },
  { name: "Elite",    threshold: 7000,  color: "#FF5757", icon: "👑" },
  { name: "Legend",    threshold: 12000, color: "#F5C842", icon: "⭐" },
];

export function getCurrentTier(xp: number): TierInfo {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (xp >= RANK_TIERS[i].threshold) {
      return RANK_TIERS[i];
    }
  }
  return RANK_TIERS[0];
}

export function getNextTier(xp: number): TierInfo | null {
  const current = getCurrentTier(xp);
  const currentIndex = RANK_TIERS.indexOf(current);
  if (currentIndex >= RANK_TIERS.length - 1) return null;
  return RANK_TIERS[currentIndex + 1];
}

export function getTierProgress(xp: number): number {
  const current = getCurrentTier(xp);
  const next = getNextTier(xp);
  if (!next) return 1;
  const range = next.threshold - current.threshold;
  const progress = xp - current.threshold;
  return Math.min(progress / range, 1);
}

export function getTierColor(xp: number): string {
  return getCurrentTier(xp).color;
}
