import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../lib/theme";
import { getCurrentTier } from "../../lib/xpUtils";
import { useAuthStore } from "../../store/useAuthStore";
import { useXpStore } from "../../store/useXpStore";
import { useXpAnimation } from "../../hooks/useXpAnimation";
import { XpProgressBar } from "../../components/XpProgressBar";
import { XpAnimatedCounter } from "../../components/XpAnimatedCounter";
import { RankBadge } from "../../components/RankBadge";
import { ProfileAvatar } from "../../components/ProfileAvatar";
import { StreakCard } from "../../components/StreakCard";
import { LeaderboardList } from "../../components/LeaderboardList";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const xpTotal = useXpStore((s) => s.xpTotal);
  const tier = getCurrentTier(xpTotal);
  const { animatedXp, displayXp } = useXpAnimation();

  const username = user?.username ?? "DemoStudent";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <ProfileAvatar size={80} />
        </View>

        {/* Username */}
        <Text style={styles.username}>{username}</Text>
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

        {/* Streak Card */}
        <View style={styles.streakContainer}>
          <StreakCard />
        </View>

        {/* Leaderboard */}
        <View style={styles.leaderboardContainer}>
          <LeaderboardList currentUsername={username} />
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
  avatarContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  username: {
    color: colors.text1,
    fontWeight: "800",
    fontSize: 22,
    textAlign: "center",
    marginTop: 10,
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
  },
  streakContainer: {
    marginTop: 16,
    marginHorizontal: 20,
  },
  leaderboardContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
});
