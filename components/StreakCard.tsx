import { View, Text, Image, StyleSheet } from "react-native";
import { colors } from "../lib/theme";
import { useXpStore } from "../store/useXpStore";

const BEST_STREAK = 12; // Hardcoded for demo — not tracked in store yet

export function StreakCard() {
  const streakDays = useXpStore((s) => s.streakDays);

  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <Image
          source={require("../assets/streak-flame.png")}
          style={styles.flameIcon}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.streakCount}>{streakDays}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.bestLabel}>BEST</Text>
        <Text style={styles.bestValue}>{BEST_STREAK} days</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  flameIcon: {
    width: 36,
    height: 36,
  },
  streakCount: {
    color: colors.gold,
    fontWeight: "900",
    fontSize: 24,
  },
  streakLabel: {
    color: colors.text2,
    fontSize: 12,
    fontWeight: "600",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  bestLabel: {
    color: colors.text3,
    fontSize: 11,
    fontWeight: "600",
  },
  bestValue: {
    color: colors.text2,
    fontWeight: "700",
    fontSize: 16,
  },
});
