import { View, Text, StyleSheet } from "react-native";
import { colors } from "../lib/theme";

interface XpAnimatedCounterProps {
  displayXp: number;
  size: "compact" | "full";
}

export function XpAnimatedCounter({ displayXp, size }: XpAnimatedCounterProps) {
  const formatted = displayXp.toLocaleString();

  if (size === "compact") {
    return (
      <Text style={styles.compactText}>{formatted} XP</Text>
    );
  }

  return (
    <View style={styles.fullContainer}>
      <Text style={styles.fullNumber}>{formatted}</Text>
      <Text style={styles.fullLabel}>XP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  compactText: {
    color: colors.gold,
    fontWeight: "700",
    fontSize: 13,
    fontVariant: ["tabular-nums"],
  },
  fullContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  fullNumber: {
    color: colors.gold,
    fontWeight: "900",
    fontSize: 32,
    fontVariant: ["tabular-nums"],
  },
  fullLabel: {
    color: colors.gold,
    fontWeight: "700",
    fontSize: 18,
    marginLeft: 6,
  },
});
