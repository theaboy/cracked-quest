import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCourseStore } from "../../../store/useCourseStore";
import { colors, radii, spacing } from "../../../lib/theme";

function statusLabel(s: "locked" | "in_progress" | "mastered") {
  return s === "mastered" ? "Mastered" : s === "in_progress" ? "In Progress" : "Locked";
}

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

export default function TopicDetailScreen() {
  const { courseId, topicId } = useLocalSearchParams<{ courseId: string; topicId: string }>();
  const router = useRouter();
  const courses = useCourseStore((s) => s.courses);
  const setTopicNotes = useCourseStore((s) => s.setTopicNotes);
  const course = courses.find((c) => c.id === courseId);
  const topic = course?.topics.find((t) => t.id === topicId);

  const [generatingNotes, setGeneratingNotes] = useState(false);
  const [generatingDiagram, setGeneratingDiagram] = useState(false);
  const [diagramText, setDiagramText] = useState<string | null>(null);

  if (!course || !topic) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Topic not found</Text>
          <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
            <Text style={styles.goHome}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const relevantExams = course.exams.filter((e) => e.topicIds.includes(topic.id));

  const masteryColor =
    topic.masteryScore >= 70
      ? colors.success
      : topic.masteryScore >= 40
      ? colors.gold
      : colors.danger;

  const statusBadgeStyle =
    topic.status === "mastered"
      ? styles.badgeMastered
      : topic.status === "in_progress"
      ? styles.badgeInProgress
      : styles.badgeLocked;

  const statusTextStyle =
    topic.status === "mastered"
      ? styles.badgeTextMastered
      : topic.status === "in_progress"
      ? styles.badgeTextInProgress
      : styles.badgeTextLocked;

  function handleGenerateNotes() {
    setGeneratingNotes(true);
    setTimeout(() => {
      const mock =
        `${topic!.name} is a foundational concept in ${course!.name}. ` +
        `Key ideas include the core definitions, mathematical formulations, and practical applications. ` +
        `Review worked examples and pay attention to edge cases that appear in ${course!.code} exam questions.`;
      setTopicNotes(courseId, topicId, mock);
      setGeneratingNotes(false);
    }, 1500);
  }

  function handleGenerateDiagram() {
    setGeneratingDiagram(true);
    setTimeout(() => {
      setDiagramText(
        `[Diagram] ${topic!.name}: Input \u2192 Feature Extraction \u2192 Model Layer \u2192 Output. ` +
        `Key decision boundaries are determined by learned parameters. ` +
        `See lecture slides \u00A73 for the visual representation.`
      );
      setGeneratingDiagram(false);
    }, 1500);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
        >
          <Text style={styles.backText}>{"← Back"}</Text>
        </TouchableOpacity>

        {/* Title row */}
        <View style={styles.titleRow}>
          <Text style={styles.topicName}>{topic.name}</Text>
          <View style={[styles.statusBadge, statusBadgeStyle]}>
            <Text style={[styles.statusBadgeText, statusTextStyle]}>
              {statusLabel(topic.status)}
            </Text>
          </View>
        </View>

        {/* Mastery score */}
        {topic.status !== "locked" && (
          <View style={styles.masteryRow}>
            <Text style={styles.masteryLabel}>Mastery</Text>
            <Text style={[styles.masteryValue, { color: masteryColor }]}>
              {topic.masteryScore}%
            </Text>
          </View>
        )}

        {/* Course row */}
        <View style={styles.courseRow}>
          <View style={[styles.courseDot, { backgroundColor: course.color }]} />
          <Text style={styles.courseText}>{course.code} — {course.name}</Text>
        </View>

        {/* Exam relevance */}
        {relevantExams.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ON THE EXAM</Text>
            {relevantExams.map((exam) => {
              const days = daysUntil(exam.examDate);
              return (
                <View key={exam.id} style={styles.examRow}>
                  <Text style={styles.examName}>{exam.name}</Text>
                  <Text style={styles.examDays}>
                    {days > 0 ? `in ${days} day${days === 1 ? "" : "s"}` : "past"}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.divider} />

        {/* Notes section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NOTES</Text>
          {topic.notes ? (
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{topic.notes}</Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No notes yet.</Text>
              <TouchableOpacity
                style={[styles.generateButton, generatingNotes && styles.generateButtonDisabled]}
                onPress={handleGenerateNotes}
                disabled={generatingNotes}
              >
                {generatingNotes ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.generateButtonText}>Generate Notes</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Diagram section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DIAGRAM</Text>
          {diagramText ? (
            <View style={styles.diagramCard}>
              <Text style={styles.diagramText}>{diagramText}</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.generateButtonSecondary, generatingDiagram && styles.generateButtonDisabled]}
              onPress={handleGenerateDiagram}
              disabled={generatingDiagram}
            >
              {generatingDiagram ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={styles.generateButtonSecondaryText}>Generate Diagram</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 48,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  notFoundTitle: {
    color: colors.text1,
    fontSize: 18,
    fontWeight: "700",
  },
  goHome: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },
  topicName: {
    color: colors.text1,
    fontSize: 22,
    fontWeight: "800",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    flexShrink: 0,
  },
  badgeMastered: {
    backgroundColor: "rgba(78,255,180,0.12)",
  },
  badgeInProgress: {
    backgroundColor: "rgba(155,109,255,0.12)",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  badgeLocked: {
    backgroundColor: colors.border,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  badgeTextMastered: {
    color: colors.success,
  },
  badgeTextInProgress: {
    color: colors.primary,
  },
  badgeTextLocked: {
    color: colors.text3,
  },
  masteryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  masteryLabel: {
    color: colors.text2,
    fontSize: 13,
  },
  masteryValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  courseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  courseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  courseText: {
    color: colors.text2,
    fontSize: 13,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    color: colors.text3,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  examRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  examName: {
    color: colors.text1,
    fontSize: 14,
    fontWeight: "600",
  },
  examDays: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 24,
  },
  notesCard: {
    backgroundColor: colors.surface2,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesText: {
    color: colors.text1,
    fontSize: 14,
    lineHeight: 22,
  },
  emptyState: {
    alignItems: "flex-start",
    gap: 12,
  },
  emptyStateText: {
    color: colors.text3,
    fontSize: 14,
  },
  generateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radii.sm,
    minWidth: 140,
    alignItems: "center",
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  generateButtonSecondary: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radii.sm,
    minWidth: 160,
    alignItems: "center",
  },
  generateButtonSecondaryText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  diagramCard: {
    backgroundColor: colors.surface2,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  diagramText: {
    color: colors.text2,
    fontSize: 13,
    lineHeight: 20,
  },
});
