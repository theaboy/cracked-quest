# Tab Navigation & Home Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the tab bar with Ionicons pill-style active state, and the home screen with course cards, zigzag topic paths, XP progress bar, and quick review flashcard modal.

**Architecture:** Custom tab bar component replaces Expo Router's default. Home screen reads from `useCourseStore`, `useXpStore`, `useAuthStore`. Flashcard modal reuses existing `questionBank.ts`. All components use `StyleSheet.create()` with `lib/theme.ts` colors.

**Tech Stack:** React Native, Expo Router Tabs, Ionicons (`@expo/vector-icons`), Zustand stores, existing question bank

---

### Task 1: XpProgressBar Component

**Files:**
- Create: `components/XpProgressBar.tsx`

- [ ] **Step 1: Create XpProgressBar component**

```tsx
// components/XpProgressBar.tsx
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../lib/theme";

const TIER_THRESHOLDS: { tier: string; xp: number }[] = [
  { tier: "Student", xp: 0 },
  { tier: "Grinder", xp: 500 },
  { tier: "Scholar", xp: 1500 },
  { tier: "Veteran", xp: 3500 },
  { tier: "Elite", xp: 7000 },
  { tier: "Legend", xp: 12000 },
];

interface Props {
  xpTotal: number;
  rankTier: string;
}

export default function XpProgressBar({ xpTotal, rankTier }: Props) {
  const currentIndex = TIER_THRESHOLDS.findIndex((t) => t.tier === rankTier);
  const nextTier = TIER_THRESHOLDS[currentIndex + 1];
  const currentThreshold = TIER_THRESHOLDS[currentIndex]?.xp ?? 0;
  const nextThreshold = nextTier?.xp ?? currentThreshold;
  const progress =
    nextThreshold > currentThreshold
      ? ((xpTotal - currentThreshold) / (nextThreshold - currentThreshold)) * 100
      : 100;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{rankTier.toUpperCase()}</Text>
        {nextTier && (
          <Text style={styles.label}>
            {nextTier.tier.toUpperCase()} at {nextTier.xp.toLocaleString()} XP
          </Text>
        )}
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(progress, 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    color: colors.text3,
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
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/XpProgressBar.tsx
git commit -m "feat: add XpProgressBar component with tier thresholds"
```

---

### Task 2: ZigzagPath Component

**Files:**
- Create: `components/ZigzagPath.tsx`

- [ ] **Step 1: Create ZigzagPath component**

```tsx
// components/ZigzagPath.tsx
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../lib/theme";
import { Topic, Exam } from "../store/useCourseStore";

interface Props {
  topics: Topic[];
  exams: Exam[];
}

function getNodeStyle(status: Topic["status"]) {
  switch (status) {
    case "mastered":
      return { bg: colors.success, border: colors.success, textColor: colors.bg };
    case "in_progress":
      return { bg: "rgba(155,109,255,0.1)", border: colors.primary, textColor: colors.primaryLight };
    case "locked":
      return { bg: "transparent", border: colors.border, textColor: colors.text3 };
  }
}

function getConnectorColor(nextStatus: Topic["status"]) {
  switch (nextStatus) {
    case "mastered": return colors.success;
    case "in_progress": return colors.primary;
    case "locked": return colors.border;
  }
}

export default function ZigzagPath({ topics, exams }: Props) {
  const hasExam = exams.length > 0 && !exams[0].defeated;

  return (
    <View style={styles.container}>
      {topics.map((topic, i) => {
        const nodeStyle = getNodeStyle(topic.status);
        const isUp = i % 2 === 0;
        const isActive = topic.status === "in_progress";
        const showConnector = i < topics.length - 1 || hasExam;
        const nextStatus = i < topics.length - 1 ? topics[i + 1].status : "locked";

        return (
          <View key={topic.id} style={styles.nodeGroup}>
            {/* Connector before this node (except first) */}
            {i > 0 && (
              <View
                style={[
                  styles.connector,
                  {
                    backgroundColor: getConnectorColor(topic.status),
                    transform: [{ rotate: isUp ? "-25deg" : "25deg" }],
                  },
                ]}
              />
            )}
            <View
              style={[
                styles.node,
                {
                  marginTop: isUp ? -16 : 16,
                  backgroundColor: topic.status === "mastered" ? nodeStyle.bg : nodeStyle.bg,
                  borderColor: nodeStyle.border,
                  borderWidth: topic.status === "mastered" ? 0 : 2,
                },
                isActive && styles.activeGlow,
              ]}
            >
              <Text style={[styles.nodeText, { color: nodeStyle.textColor }]}>
                {topic.status === "mastered" ? "✓" : i + 1}
              </Text>
            </View>
          </View>
        );
      })}

      {/* Boss node */}
      {hasExam && (
        <View style={styles.nodeGroup}>
          <View
            style={[
              styles.connector,
              {
                backgroundColor: colors.border,
                transform: [{ rotate: topics.length % 2 === 0 ? "-25deg" : "25deg" }],
              },
            ]}
          />
          <View
            style={[
              styles.bossNode,
              { marginTop: topics.length % 2 === 0 ? -16 : 16 },
            ]}
          >
            <Text style={styles.bossText}>👹</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 70,
    marginVertical: 10,
  },
  nodeGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  connector: {
    width: 12,
    height: 2,
  },
  node: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  activeGlow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  nodeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  bossNode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.danger,
    backgroundColor: "rgba(255,87,87,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  bossText: {
    fontSize: 13,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/ZigzagPath.tsx
git commit -m "feat: add ZigzagPath component with mastered/active/locked/boss states"
```

---

### Task 3: FlashcardModal Component

**Files:**
- Create: `components/FlashcardModal.tsx`

- [ ] **Step 1: Create FlashcardModal component**

```tsx
// components/FlashcardModal.tsx
import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { colors, radii } from "../lib/theme";
import { QUESTION_BANK } from "../lib/questionBank";
import { Topic } from "../store/useCourseStore";

interface Props {
  visible: boolean;
  onClose: () => void;
  courseCode: string;
  topics: Topic[];
}

export default function FlashcardModal({ visible, onClose, courseCode, topics }: Props) {
  const [revealed, setRevealed] = useState(false);

  // Get eligible topic IDs (mastered or in_progress)
  const eligibleIds = topics
    .filter((t) => t.status === "mastered" || t.status === "in_progress")
    .map((t) => t.id);

  // Find a random question from eligible topics
  const eligible = QUESTION_BANK.filter((q) => eligibleIds.includes(q.topicId));
  const question = eligible.length > 0 ? eligible[Math.floor(Math.random() * eligible.length)] : null;

  const topicName = question ? topics.find((t) => t.id === question.topicId)?.name ?? "" : "";
  const answer = question ? question.options[question.correctIndex] : "";

  const handleClose = () => {
    setRevealed(false);
    onClose();
  };

  if (!question) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose}>
        <TouchableOpacity style={styles.card} activeOpacity={1}>
          <Text style={styles.topicLabel}>
            {courseCode} · {topicName.toUpperCase()}
          </Text>
          <Text style={styles.questionText}>{question.question}</Text>

          <TouchableOpacity
            style={styles.answerArea}
            onPress={() => setRevealed(true)}
            activeOpacity={0.8}
          >
            {!revealed && <Text style={styles.revealLabel}>TAP TO REVEAL</Text>}
            <Text style={[styles.answerText, !revealed && styles.blurred]}>
              {answer}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <Text style={styles.closeBtnText}>DONE</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    width: "100%",
  },
  topicLabel: {
    fontSize: 10,
    color: colors.text3,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 12,
  },
  questionText: {
    fontSize: 16,
    color: colors.text1,
    fontWeight: "600",
    lineHeight: 24,
    marginBottom: 20,
  },
  answerArea: {
    backgroundColor: colors.surface3,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  revealLabel: {
    fontSize: 11,
    color: colors.text3,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  answerText: {
    fontSize: 14,
    color: colors.text2,
    lineHeight: 20,
  },
  blurred: {
    opacity: 0.15,
  },
  closeBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: "center",
  },
  closeBtnText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/FlashcardModal.tsx
git commit -m "feat: add FlashcardModal with tap-to-reveal from question bank"
```

---

### Task 4: CourseCard Component

**Files:**
- Create: `components/CourseCard.tsx`

- [ ] **Step 1: Create CourseCard component**

```tsx
// components/CourseCard.tsx
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, radii } from "../lib/theme";
import { Course } from "../store/useCourseStore";
import ZigzagPath from "./ZigzagPath";
import FlashcardModal from "./FlashcardModal";

interface Props {
  course: Course;
}

function getReadinessScore(course: Course): number {
  const eligible = course.topics.filter(
    (t) => t.status === "mastered" || t.status === "in_progress"
  );
  if (eligible.length === 0) return 0;
  return Math.round(
    eligible.reduce((sum, t) => sum + t.masteryScore, 0) / course.topics.length
  );
}

function getCurrentTopic(course: Course): string {
  const inProgress = course.topics.find((t) => t.status === "in_progress");
  if (inProgress) return inProgress.name;
  const locked = course.topics.find((t) => t.status === "locked");
  return locked?.name ?? "All complete";
}

function getDaysUntilExam(course: Course): number | null {
  if (course.exams.length === 0) return null;
  const nearest = course.exams
    .filter((e) => !e.defeated)
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())[0];
  if (!nearest) return null;
  return Math.max(1, Math.ceil((new Date(nearest.examDate).getTime() - Date.now()) / 86400000));
}

export default function CourseCard({ course }: Props) {
  const [flashcardVisible, setFlashcardVisible] = useState(false);
  const readiness = getReadinessScore(course);
  const currentTopic = getCurrentTopic(course);
  const daysUntil = getDaysUntilExam(course);
  const isUrgent = daysUntil !== null && daysUntil <= 7;

  return (
    <View style={[styles.card, { borderLeftColor: course.color }]}>
      <View style={styles.row}>
        <View style={styles.mainContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.courseName}>{course.name}</Text>
              <Text style={styles.courseCode}>{course.code}</Text>
              <Text style={styles.currentTopic}>Currently: {currentTopic}</Text>
            </View>
            {daysUntil && (
              <View style={[styles.examBadge, isUrgent ? styles.examUrgent : styles.examNormal]}>
                <Text style={[styles.examText, { color: isUrgent ? colors.danger : colors.primaryLight }]}>
                  {daysUntil} days
                </Text>
              </View>
            )}
          </View>

          {/* Zigzag path */}
          <ZigzagPath topics={course.topics} exams={course.exams} />

          {/* Readiness bar */}
          <View style={styles.readinessRow}>
            <Text style={styles.readinessLabel}>Readiness</Text>
            <Text style={[styles.readinessValue, { color: readiness >= 70 ? colors.success : colors.gold }]}>
              {readiness}%
            </Text>
          </View>
          <View style={styles.readinessTrack}>
            <View
              style={[
                styles.readinessFill,
                {
                  width: `${readiness}%`,
                  backgroundColor: readiness >= 70 ? colors.success : colors.gold,
                },
              ]}
            />
          </View>
        </View>

        {/* Quick review button */}
        <TouchableOpacity
          style={[styles.quickReview, { borderColor: course.color + "40", backgroundColor: course.color + "18" }]}
          onPress={() => setFlashcardVisible(true)}
        >
          <Text style={[styles.quickReviewIcon, { color: course.color }]}>⚡</Text>
        </TouchableOpacity>
      </View>

      <FlashcardModal
        visible={flashcardVisible}
        onClose={() => setFlashcardVisible(false)}
        courseCode={course.code}
        topics={course.topics}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    borderLeftWidth: 4,
    padding: 20,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  mainContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  courseName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text1,
  },
  courseCode: {
    fontSize: 12,
    color: colors.text3,
    marginTop: 2,
  },
  currentTopic: {
    fontSize: 12,
    color: colors.primaryLight,
    fontWeight: "600",
    marginTop: 4,
  },
  examBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  examUrgent: {
    backgroundColor: "rgba(255,87,87,0.12)",
  },
  examNormal: {
    backgroundColor: "rgba(155,109,255,0.12)",
  },
  examText: {
    fontSize: 11,
    fontWeight: "600",
  },
  readinessRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  readinessLabel: {
    fontSize: 12,
    color: colors.text2,
  },
  readinessValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  readinessTrack: {
    height: 4,
    backgroundColor: colors.surface3,
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 4,
  },
  readinessFill: {
    height: "100%",
    borderRadius: 2,
  },
  quickReview: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  quickReviewIcon: {
    fontSize: 20,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/CourseCard.tsx
git commit -m "feat: add CourseCard with zigzag path, readiness bar, and flashcard trigger"
```

---

### Task 5: Tab Bar Redesign

**Files:**
- Modify: `app/(tabs)/_layout.tsx`

- [ ] **Step 1: Rewrite tab layout with custom tab bar**

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../lib/theme";

type IoniconsName = keyof typeof Ionicons.glyphMap;

const TAB_CONFIG: { name: string; label: string; iconActive: IoniconsName; iconInactive: IoniconsName }[] = [
  { name: "index", label: "MAP", iconActive: "map", iconInactive: "map-outline" },
  { name: "study", label: "STUDY", iconActive: "timer", iconInactive: "timer-outline" },
  { name: "quests", label: "QUESTS", iconActive: "flag", iconInactive: "flag-outline" },
  { name: "commons", label: "COMMONS", iconActive: "grid", iconInactive: "grid-outline" },
  { name: "profile", label: "RANK", iconActive: "trophy", iconInactive: "trophy-outline" },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      {TAB_CONFIG.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.tabItem, focused && styles.tabItemActive]}>
                <Ionicons
                  name={focused ? tab.iconActive : tab.iconInactive}
                  size={20}
                  color={focused ? colors.primaryLight : colors.text3}
                />
                {focused && <Text style={styles.tabLabel}>{tab.label}</Text>}
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tabItemActive: {
    backgroundColor: "rgba(155,109,255,0.15)",
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primaryLight,
    letterSpacing: 0.5,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/\(tabs\)/_layout.tsx
git commit -m "feat: redesign tab bar with Ionicons and pill active state"
```

---

### Task 6: Home Screen

**Files:**
- Rewrite: `app/(tabs)/index.tsx`

- [ ] **Step 1: Rewrite home screen**

```tsx
// app/(tabs)/index.tsx
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { colors, radii } from "../../lib/theme";
import { useAuthStore } from "../../store/useAuthStore";
import { useCourseStore } from "../../store/useCourseStore";
import { useXpStore } from "../../store/useXpStore";
import XpProgressBar from "../../components/XpProgressBar";
import CourseCard from "../../components/CourseCard";

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const courses = useCourseStore((s) => s.courses);
  const { xpTotal, rankTier, streakDays } = useXpStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeLabel}>WELCOME BACK</Text>
            <Text style={styles.username}>{user?.username || "Student"}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.xpRow}>
              <Text style={styles.xpCount}>{xpTotal.toLocaleString()} XP</Text>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{rankTier}</Text>
              </View>
            </View>
            {streakDays > 0 && (
              <Text style={styles.streakText}>🔥 {streakDays} day streak</Text>
            )}
          </View>
        </View>

        {/* XP Progress Bar */}
        <XpProgressBar xpTotal={xpTotal} rankTier={rankTier} />

        {/* Course Cards */}
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}

        {/* Empty state */}
        {courses.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No courses yet</Text>
            <Text style={styles.emptySubtext}>Complete onboarding to add your courses</Text>
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => router.push("/(tabs)/study")}
        >
          <Text style={styles.ctaBtnText}>START STUDYING</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    padding: 20,
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
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  username: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text1,
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  xpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
  },
  rankText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.primaryLight,
  },
  streakText: {
    fontSize: 12,
    color: colors.text3,
    marginTop: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text2,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text3,
    marginTop: 6,
  },
  ctaBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
  },
  ctaBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Test in Expo Go**

Run: `npx expo start`
- Use demo mode login
- Verify: header shows "DemoStudent", 1,240 XP, Grinder badge, 5 day streak
- Verify: XP bar shows progress toward Scholar (1,500)
- Verify: 2 course cards with zigzag paths and correct topic states
- Verify: tap ⚡ opens flashcard modal
- Verify: tab bar shows 5 icons with pill highlight on active tab
- Verify: "START STUDYING" navigates to Study tab

- [ ] **Step 4: Commit**

```bash
git add app/\(tabs\)/index.tsx
git commit -m "feat: build home screen with course cards, XP bar, and zigzag topic paths"
```
