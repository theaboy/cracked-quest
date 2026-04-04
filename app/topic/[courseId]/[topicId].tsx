import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import NotesWebView from "../../../components/NotesWebView";
import FlashcardModal from "../../../components/FlashcardModal";
import TopicFlashcardModal from "../../../components/TopicFlashcardModal";
import { useCourseStore } from "../../../store/useCourseStore";
import { buildCheatsheetHTML } from "../../../lib/cheatsheetTemplate";
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
  const setTopicKeyPoints = useCourseStore((s) => s.setTopicKeyPoints);
  const course = courses.find((c) => c.id === courseId);
  const topic = course?.topics.find((t) => t.id === topicId);

  const [generatingNotes, setGeneratingNotes] = useState(false);
  const [generatingFromSlides, setGeneratingFromSlides] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [generatingKeyPoints, setGeneratingKeyPoints] = useState(false);
  const [generatingFlashcards, setGeneratingFlashcards] = useState(false);
  const [flashcards, setFlashcards] = useState<{ front: string; back: string }[]>([]);
  const [flashcardModalVisible, setFlashcardModalVisible] = useState(false);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [downloadingCheatsheet, setDownloadingCheatsheet] = useState(false);

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
        `## ${topic!.name}\n\n` +
        `**Overview:** ${topic!.name} is a foundational concept in ${course!.name}.\n\n` +
        `### Key Ideas\n\n` +
        `- Core definitions and mathematical formulations\n` +
        `- Practical applications and worked examples\n` +
        `- Edge cases that appear in ${course!.code} exam questions\n\n` +
        `### Exam Tips 🎯\n\n` +
        `Review the lecture slides and problem sets. Focus on the derivations and be able to explain the intuition behind each formula.`;
      setTopicNotes(courseId, topicId, mock);
      setGeneratingNotes(false);
    }, 1500);
  }

  async function handleUploadSlides() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/vnd.ms-powerpoint",
               "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
        copyToCacheDirectory: false,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      setUploadedFileName(file.name);
    } catch {
      // picker dismissed
    }
  }

  function handleGenerateFromSlides() {
    if (!uploadedFileName) return;
    setGeneratingFromSlides(true);
    setTimeout(() => {
      const mock =
        `## ${topic!.name}\n\n` +
        `*Generated from: ${uploadedFileName}*\n\n` +
        `### Lecture Overview\n\n` +
        `Based on your uploaded slides, here are the key concepts covered:\n\n` +
        `- **Definitions:** Core terminology introduced in the slides\n` +
        `- **Derivations:** Step-by-step mathematical proofs from lecture\n` +
        `- **Examples:** Worked problems from the slide deck\n\n` +
        `### Key Formulas\n\n` +
        `\`\`\`\nSee the formula sheet extracted from your slides above.\n\`\`\`\n\n` +
        `### Exam Tips 🎯\n\n` +
        `Your professor emphasised the derivations on slides 12–18. Pay close attention to those for the ${course!.code} exam.`;
      setTopicNotes(courseId, topicId, mock);
      setGeneratingFromSlides(false);
      setUploadedFileName(null);
    }, 2000);
  }

  function handleGenerateKeyPoints() {
    setGeneratingKeyPoints(true);
    setTimeout(() => {
      const points = [
        `Core definition of ${topic!.name} and its mathematical formulation`,
        `Key assumptions required for standard results in ${course!.code}`,
        `Common exam patterns: derivations, edge cases, and worked examples`,
        `Relationship to adjacent topics covered in ${course!.name}`,
        `Pitfalls and misconceptions flagged in past ${course!.code} exams`,
      ];
      setTopicKeyPoints(courseId, topicId, points);
      setGeneratingKeyPoints(false);
    }, 1500);
  }

  function handleGenerateFlashcards() {
    setGeneratingFlashcards(true);
    setTimeout(() => {
      const cards = [
        {
          front: `Define: ${topic!.name}`,
          back: `A core concept in ${course!.code} — refer to your notes for the precise formal definition and examples.`,
        },
        {
          front: `What is the key formula or rule for ${topic!.name}?`,
          back: `See the mathematical formulation from lecture §2. Pay attention to edge cases and boundary conditions.`,
        },
        {
          front: `Name two exam-relevant edge cases for ${topic!.name}`,
          back: `1) Boundary / degenerate inputs  2) Cases where standard assumptions break down`,
        },
        {
          front: `How does ${topic!.name} relate to the rest of ${course!.name}?`,
          back: `It serves as a building block for subsequent modules — mastering this topic unlocks the next concepts in the course.`,
        },
      ];
      setFlashcards(cards);
      setGeneratingFlashcards(false);
      setFlashcardModalVisible(true);
    }, 2000);
  }

  async function handleDownloadCheatsheet() {
    setDownloadingCheatsheet(true);
    try {
      const html = buildCheatsheetHTML({
        topicName: topic!.name,
        courseCode: course!.code,
        courseName: course!.name,
        exams: relevantExams.map((e) => ({ name: e.name, examDate: e.examDate })),
        keyPoints: topic!.keyPoints ?? [],
        notes: topic!.notes ?? "",
      });
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: `${course!.code} — ${topic!.name} Cheat Sheet`,
      });
    } catch {
      // user cancelled share sheet or sharing unavailable
    } finally {
      setDownloadingCheatsheet(false);
    }
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
              <NotesWebView content={topic.notes} />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No notes yet.</Text>

              {/* Upload slides option */}
              <View style={styles.uploadCard}>
                <Text style={styles.uploadTitle}>Upload your slides or lecture notes</Text>
                <Text style={styles.uploadSubtitle}>PDF or PowerPoint — we'll generate structured notes from them</Text>

                {uploadedFileName ? (
                  <View style={styles.uploadedFileRow}>
                    <Text style={styles.uploadedFileName} numberOfLines={1}>{uploadedFileName}</Text>
                    <TouchableOpacity onPress={() => setUploadedFileName(null)}>
                      <Text style={styles.removeFile}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.uploadButton} onPress={handleUploadSlides}>
                    <Text style={styles.uploadButtonText}>Choose File</Text>
                  </TouchableOpacity>
                )}

                {uploadedFileName && (
                  <TouchableOpacity
                    style={[styles.generateButton, generatingFromSlides && styles.generateButtonDisabled]}
                    onPress={handleGenerateFromSlides}
                    disabled={generatingFromSlides}
                  >
                    {generatingFromSlides ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <Text style={styles.generateButtonText}>Generate from Slides</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>

              {/* AI generate option */}
              <Text style={styles.orText}>or</Text>
              <TouchableOpacity
                style={[styles.generateButtonSecondary, generatingNotes && styles.generateButtonDisabled]}
                onPress={handleGenerateNotes}
                disabled={generatingNotes}
              >
                {generatingNotes ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={styles.generateButtonSecondaryText}>Generate with AI</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Key Points section — only when notes exist */}
        {topic.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>KEY POINTS</Text>
            {topic.keyPoints && topic.keyPoints.length > 0 ? (
              <View style={styles.keyPointsCard}>
                {topic.keyPoints.map((point, idx) => (
                  <View key={idx} style={styles.keyPointRow}>
                    <Text style={styles.keyPointBullet}>▶</Text>
                    <Text style={styles.keyPointText}>{point}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.generateButtonSecondary, generatingKeyPoints && styles.generateButtonDisabled]}
                onPress={handleGenerateKeyPoints}
                disabled={generatingKeyPoints}
              >
                {generatingKeyPoints ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={styles.generateButtonSecondaryText}>Generate Key Points</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Tools section — only when notes exist */}
        {topic.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>TOOLS</Text>
            <View style={styles.toolsColumn}>
              <TouchableOpacity
                style={[styles.toolButton, downloadingCheatsheet && styles.generateButtonDisabled]}
                onPress={handleDownloadCheatsheet}
                disabled={downloadingCheatsheet}
              >
                {downloadingCheatsheet ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.toolButtonText}>Download Cheat Sheet</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.toolButton, generatingFlashcards && styles.generateButtonDisabled]}
                onPress={handleGenerateFlashcards}
                disabled={generatingFlashcards}
              >
                {generatingFlashcards ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.toolButtonText}>Generate Flashcards</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toolButtonSecondary}
                onPress={() => setQuizModalVisible(true)}
              >
                <Text style={styles.toolButtonSecondaryText}>Practice Quiz</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <TopicFlashcardModal
        visible={flashcardModalVisible}
        onClose={() => setFlashcardModalVisible(false)}
        flashcards={flashcards}
        topicName={topic.name}
        courseCode={course.code}
      />

      <FlashcardModal
        visible={quizModalVisible}
        onClose={() => setQuizModalVisible(false)}
        courseCode={course.code}
        topics={course.topics}
      />
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
  emptyState: {
    gap: 16,
  },
  emptyStateText: {
    color: colors.text3,
    fontSize: 14,
  },
  uploadCard: {
    backgroundColor: colors.surface2,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    padding: spacing.md,
    gap: 10,
  },
  uploadTitle: {
    color: colors.text1,
    fontSize: 14,
    fontWeight: "700",
  },
  uploadSubtitle: {
    color: colors.text3,
    fontSize: 12,
    lineHeight: 18,
  },
  uploadButton: {
    backgroundColor: colors.surface3,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.sm,
    alignSelf: "flex-start",
  },
  uploadButtonText: {
    color: colors.text2,
    fontSize: 13,
    fontWeight: "600",
  },
  uploadedFileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surface3,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  uploadedFileName: {
    color: colors.success,
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  removeFile: {
    color: colors.text3,
    fontSize: 14,
  },
  orText: {
    color: colors.text3,
    fontSize: 13,
    textAlign: "center",
  },
  generateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radii.sm,
    minWidth: 160,
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
  keyPointsCard: {
    backgroundColor: colors.surface2,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  keyPointRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  keyPointBullet: {
    color: colors.primary,
    fontSize: 11,
    lineHeight: 22,
  },
  keyPointText: {
    color: colors.text1,
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  toolsColumn: {
    gap: 12,
  },
  toolButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: radii.sm,
    alignItems: "center",
  },
  toolButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  toolButtonSecondary: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: radii.sm,
    alignItems: "center",
  },
  toolButtonSecondaryText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});
