import { ImageSourcePropType } from "react-native";

export type LevelName = "Student" | "Grinder" | "Scholar" | "Veteran" | "Elite" | "Legend";

export interface LevelInfo {
  name: LevelName;
  rank: number;
  minXp: number;
  accentColor: string;
  icon: string;
}

export const LEVELS: LevelInfo[] = [
  { name: "Student",  rank: 1, minXp: 0,     accentColor: "#A8A29E", icon: "🎓" },
  { name: "Grinder",  rank: 2, minXp: 500,   accentColor: "#F59E0B", icon: "🔥" },
  { name: "Scholar",  rank: 3, minXp: 1500,  accentColor: "#8B5CF6", icon: "📚" },
  { name: "Veteran",  rank: 4, minXp: 3500,  accentColor: "#06B6D4", icon: "🛡" },
  { name: "Elite",    rank: 5, minXp: 7000,  accentColor: "#10B981", icon: "👑" },
  { name: "Legend",   rank: 6, minXp: 12000, accentColor: "#EAB308", icon: "⭐" },
];

const avatarImages: Record<Lowercase<LevelName>, ImageSourcePropType> = {
  student: require("../assets/avatars/student.png"),
  grinder: require("../assets/avatars/grinder.png"),
  scholar: require("../assets/avatars/scholar.png"),
  veteran: require("../assets/avatars/veteran.png"),
  elite: require("../assets/avatars/elite.png"),
  legend: require("../assets/avatars/legend.png"),
};

function resolveLevelInfo(level: LevelName | number): LevelInfo {
  if (typeof level === "number") {
    const clamped = Math.max(1, Math.min(level, LEVELS.length));
    return LEVELS[clamped - 1];
  }
  return LEVELS.find((l) => l.name === level) ?? LEVELS[0];
}

export function getAvatarForLevel(level: LevelName | number): ImageSourcePropType {
  const info = resolveLevelInfo(level);
  return avatarImages[info.name.toLowerCase() as Lowercase<LevelName>];
}

export function getLevelColor(level: LevelName | number): string {
  return resolveLevelInfo(level).accentColor;
}

export function getLevelInfo(level: LevelName | number): LevelInfo {
  return resolveLevelInfo(level);
}
