import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, radii } from "../../lib/theme";
import { getCurrentTier } from "../../lib/xpUtils";
import { useAuthStore } from "../../store/useAuthStore";
import { useCourseStore } from "../../store/useCourseStore";
import { useXpStore } from "../../store/useXpStore";
import { useXpAnimation } from "../../hooks/useXpAnimation";
import { XpProgressBar } from "../../components/XpProgressBar";
import { XpAnimatedCounter } from "../../components/XpAnimatedCounter";
import { RankBadge } from "../../components/RankBadge";
import CourseCard from "../../components/CourseCard";

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const courses = useCourseStore((s) => s.courses);
  const xpTotal = useXpStore((s) => s.xpTotal);
  const streakDays = useXpStore((s) => s.streakDays);

  const currentTier = getCurrentTier(xpTotal);
  const { animatedXp, displayXp } = useXpAnimation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeLabel}>WELCOME BACK</Text>
            <Text style={styles.username}>
              {user?.username ?? "Student"}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.xpRow}>
              <XpProgressBar animatedXp={animatedXp} size="compact" />
              <XpAnimatedCounter displayXp={displayXp} size="compact" />
            </View>
            <RankBadge tier={currentTier} variant="pill" />
            {streakDays > 0 && (
              <Text style={styles.streakText}>
                {"\uD83D\uDD25"} {streakDays} day streak
              </Text>
            )}
          </View>
        </View>

        {/* Course Cards */}
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No courses yet</Text>
            <Text style={styles.emptySubtitle}>
              Complete onboarding to add your courses
            </Text>
          </View>
        )}

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.85}
          onPress={() => router.push("/(tabs)/study")}
        >
          <Text style={styles.ctaButtonText}>START STUDYING</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  welcomeLabel: {
    fontSize: 11,
    color: colors.text3,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: "600",
  },
  username: {
    fontSize: 24,
    color: colors.text1,
    fontWeight: "800",
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  xpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  streakText: {
    fontSize: 12,
    color: colors.text3,
    marginTop: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text2,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text3,
    marginTop: 8,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 20,
  },
  ctaButtonText: {
    color: colors.text1,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});
