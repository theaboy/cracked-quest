import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../lib/theme";
import { getCurrentTier } from "../../lib/xpUtils";
import { useXpStore } from "../../store/useXpStore";
import { useXpAnimation } from "../../hooks/useXpAnimation";
import { XpProgressBar } from "../../components/XpProgressBar";
import { XpAnimatedCounter } from "../../components/XpAnimatedCounter";
import { RankBadge } from "../../components/RankBadge";

export default function ProfileScreen() {
  const xpTotal    = useXpStore((s) => s.xpTotal);
  const streakDays = useXpStore((s) => s.streakDays);
  const tier = getCurrentTier(xpTotal);
  const { animatedXp, displayXp } = useXpAnimation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Username */}
        <Text style={styles.username}>DemoStudent</Text>
        <Text style={styles.university}>McGill University</Text>

        {/* Shield badge */}
        <View style={styles.badgeContainer}>
          <RankBadge tier={tier} variant="shield" />
        </View>

        {/* XP counter */}
        <View style={styles.counterContainer}>
          <XpAnimatedCounter displayXp={displayXp} size="full" />
        </View>

        {/* XP progress bar */}
        <View style={styles.barContainer}>
          <XpProgressBar animatedXp={animatedXp} size="full" />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Streak stat — Issue #12 */}
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Streak</Text>
          <Text style={styles.statValue}>
            {streakDays > 0 ? `🔥 ${streakDays} day streak` : "No streak yet"}
          </Text>
        </View>

        {/* Placeholder for leaderboard/stats — issue #5 */}
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Leaderboard & Stats (Issue #5)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingBottom: 48,
  },
  username: {
    color: colors.text1,
    fontWeight: "800",
    fontSize: 22,
    textAlign: "center",
    marginTop: 24,
    marginBottom: 4,
  },
  university: {
    color: colors.text3,
    fontSize: 12,
    textAlign: "center",
  },
  badgeContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  counterContainer: {
    marginTop: 24,
  },
  barContainer: {
    marginTop: 12,
    paddingHorizontal: 32,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
  },
  placeholderText: {
    color: colors.text3,
    fontSize: 14,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text1,
  },
});
