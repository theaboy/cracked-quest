import { View, Text, StyleSheet } from "react-native";
import { colors } from "../lib/theme";

const TIERS = [
  { name: "Student", threshold: 0 },
  { name: "Grinder", threshold: 500 },
  { name: "Scholar", threshold: 1500 },
  { name: "Veteran", threshold: 3500 },
  { name: "Elite", threshold: 7000 },
  { name: "Legend", threshold: 12000 },
] as const;

type TierName = (typeof TIERS)[number]["name"];

interface Props {
  xpTotal: number;
  rankTier: TierName;
}

function getTierIndex(tier: TierName): number {
  return TIERS.findIndex((t) => t.name === tier);
}

export default function XpProgressBar({ xpTotal, rankTier }: Props) {
  const currentIndex = getTierIndex(rankTier);
  const isMaxTier = currentIndex >= TIERS.length - 1;

  const currentThreshold = TIERS[currentIndex].threshold;
  const nextTier = isMaxTier ? null : TIERS[currentIndex + 1];
  const nextThreshold = nextTier ? nextTier.threshold : currentThreshold;

  const range = nextThreshold - currentThreshold;
  const progress = range > 0 ? Math.min((xpTotal - currentThreshold) / range, 1) : 1;
  const progressPercent = Math.max(progress, 0) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.labelText}>{rankTier.toUpperCase()}</Text>
        {nextTier ? (
          <Text style={styles.labelText}>
            {nextTier.name.toUpperCase()} at {nextThreshold.toLocaleString()} XP
          </Text>
        ) : (
          <Text style={styles.labelText}>MAX RANK</Text>
        )}
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progressPercent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelText: {
    color: colors.text3,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  track: {
    height: 6,
    backgroundColor: colors.surface3,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
});
