import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, radii } from "../lib/theme";
import type { Course } from "../store/useCourseStore";
import ZigzagPath from "./ZigzagPath";
import FlashcardModal from "./FlashcardModal";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const [flashcardVisible, setFlashcardVisible] = useState(false);

  // Current topic: first in_progress, then first locked, else "All complete"
  const currentTopic =
    course.topics.find((t) => t.status === "in_progress") ??
    course.topics.find((t) => t.status === "locked");
  const currentTopicLabel = currentTopic ? currentTopic.name : "All complete";

  // Nearest undefeated exam
  const undefeatedExams = course.exams.filter((e) => !e.defeated);
  let nearestExam: (typeof undefeatedExams)[number] | null = null;
  let daysUntilExam = 0;
  // Filter to future undefeated exams only
  const futureExams = undefeatedExams.filter(
    (e) => new Date(e.examDate).getTime() > Date.now()
  );
  if (futureExams.length > 0) {
    nearestExam = futureExams.reduce((closest, exam) => {
      const d = new Date(exam.examDate).getTime() - Date.now();
      const closestD = new Date(closest.examDate).getTime() - Date.now();
      return d < closestD ? exam : closest;
    });
    daysUntilExam = Math.ceil(
      (new Date(nearestExam.examDate).getTime() - Date.now()) / 86400000
    );
  }

  const isUrgent = nearestExam != null && daysUntilExam <= 7;

  // Readiness percentage
  const totalTopics = course.topics.length;
  const readinessPercent =
    totalTopics > 0
      ? Math.round(
          course.topics.reduce((sum, t) => sum + t.masteryScore, 0) /
            totalTopics
        )
      : 0;
  const readinessColor =
    readinessPercent >= 70 ? colors.success : colors.gold;

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: course.color },
      ]}
    >
      <View style={styles.row}>
        {/* Main content */}
        <View style={styles.mainContent}>
          {/* Header row */}
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.courseName}>{course.name}</Text>
              <Text style={styles.courseCode}>{course.code}</Text>
              <Text style={styles.currentTopic}>
                Currently: {currentTopicLabel}
              </Text>
            </View>

            {/* Exam badge */}
            {nearestExam != null && (
              <View
                style={[
                  styles.examBadge,
                  {
                    backgroundColor: isUrgent
                      ? "rgba(255,87,87,0.12)"
                      : "rgba(155,109,255,0.12)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.examBadgeText,
                    { color: isUrgent ? "#FF5757" : "#B99BFF" },
                  ]}
                >
                  {daysUntilExam} {daysUntilExam === 1 ? "day" : "days"}
                </Text>
              </View>
            )}
          </View>

          {/* Zigzag Path */}
          <ZigzagPath topics={course.topics} exams={course.exams} />

          {/* Readiness bar */}
          <View style={styles.readinessContainer}>
            <View style={styles.readinessLabelRow}>
              <Text style={styles.readinessLabel}>Readiness</Text>
              <Text
                style={[
                  styles.readinessPercent,
                  { color: readinessColor },
                ]}
              >
                {readinessPercent}%
              </Text>
            </View>
            <View style={styles.readinessTrack}>
              <View
                style={[
                  styles.readinessFill,
                  {
                    width: `${readinessPercent}%`,
                    backgroundColor: readinessColor,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Quick review button */}
        <TouchableOpacity
          style={[
            styles.quickReviewButton,
            {
              backgroundColor: course.color + "18",
              borderColor: course.color + "40",
            },
          ]}
          onPress={() => setFlashcardVisible(true)}
        >
          <Text style={styles.quickReviewIcon}>&#9889;</Text>
        </TouchableOpacity>
      </View>

      {/* Flashcard Modal */}
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
    borderRadius: radii.lg,
    borderLeftWidth: 4,
    padding: 20,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  mainContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
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
    fontWeight: "600",
    color: colors.primaryLight,
    marginTop: 4,
  },
  examBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.sm,
    marginLeft: 8,
  },
  examBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  readinessContainer: {
    marginTop: 12,
  },
  readinessLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  readinessLabel: {
    fontSize: 12,
    color: colors.text2,
  },
  readinessPercent: {
    fontSize: 14,
    fontWeight: "700",
  },
  readinessTrack: {
    height: 4,
    backgroundColor: colors.surface3,
    borderRadius: 2,
    overflow: "hidden",
  },
  readinessFill: {
    height: 4,
    borderRadius: 2,
  },
  quickReviewButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  quickReviewIcon: {
    fontSize: 20,
  },
});
