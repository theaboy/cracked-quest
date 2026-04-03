import { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, radii } from "../../lib/theme";
import { getCurrentTier } from "../../lib/xpUtils";
import { useAuthStore } from "../../store/useAuthStore";
import { useCourseStore } from "../../store/useCourseStore";
import { useXpStore } from "../../store/useXpStore";
import { XpProgressBar } from "../../components/XpProgressBar";
import CourseCard from "../../components/CourseCard";

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const courses = useCourseStore((s) => s.courses);
  const xpTotal = useXpStore((s) => s.xpTotal);
  const streakDays = useXpStore((s) => s.streakDays);

  const currentTier = getCurrentTier(xpTotal);

  const animatedXp = useRef(new Animated.Value(xpTotal)).current;

  useEffect(() => {
    Animated.timing(animatedXp, {
      toValue: xpTotal,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [xpTotal]);

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
            <Text style={styles.xpCount}>
              {xpTotal.toLocaleString()} XP
            </Text>
            <View style={styles.rankBadge}>
              <Text style={styles.rankBadgeText}>{currentTier.name}</Text>
            </View>
            {streakDays > 0 && (
              <Text style={styles.streakText}>
                {"\uD83D\uDD25"} {streakDays} day streak
              </Text>
            )}
          </View>
        </View>

        {/* XP Progress Bar */}
        <View style={styles.xpBarContainer}>
          <XpProgressBar animatedXp={animatedXp} size="full" />
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
  },
  xpCount: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.gold,
  },
  rankBadge: {
    backgroundColor: "rgba(155,109,255,0.15)",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  rankBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.primaryLight,
  },
  streakText: {
    fontSize: 12,
    color: colors.text3,
    marginTop: 4,
  },
  xpBarContainer: {
    marginBottom: 20,
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
