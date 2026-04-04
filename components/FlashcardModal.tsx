import React, { useMemo, useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors, radii } from "../lib/theme";
import { QUESTION_BANK, QuizQuestion } from "../lib/questionBank";
import type { Topic } from "../store/useCourseStore";

interface FlashcardModalProps {
  visible: boolean;
  onClose: () => void;
  courseCode: string;
  topics: Topic[];
}

export default function FlashcardModal({
  visible,
  onClose,
  courseCode,
  topics,
}: FlashcardModalProps) {
  const [revealed, setRevealed] = useState(false);
  const [question, setQuestion] = useState<QuizQuestion | null>(null);

  const eligibleTopicIds = useMemo(
    () =>
      new Set(
        topics
          .filter((t) => t.status === "mastered" || t.status === "in_progress")
          .map((t) => t.id)
      ),
    [topics]
  );

  // Re-roll question every time modal opens
  useEffect(() => {
    if (visible) {
      const pool = QUESTION_BANK.filter((q) => eligibleTopicIds.has(q.topicId));
      if (pool.length > 0) {
        setQuestion(pool[Math.floor(Math.random() * pool.length)]);
      } else {
        setQuestion(null);
      }
      setRevealed(false);
    }
  }, [visible, eligibleTopicIds]);

  const topicName = question
    ? topics.find((t) => t.id === question.topicId)?.name ?? ""
    : "";

  const handleClose = () => {
    setRevealed(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {question ? (
            <>
              <Text style={styles.label}>
                {courseCode} {topicName ? `\u00B7 ${topicName}` : ""}
              </Text>

              <Text style={styles.question}>{question.question}</Text>

              <TouchableOpacity
                style={styles.answerArea}
                activeOpacity={0.8}
                onPress={() => setRevealed(true)}
                disabled={revealed}
              >
                {revealed ? (
                  <Text style={styles.answerRevealed}>
                    {question.options[question.correctIndex]}
                  </Text>
                ) : (
                  <View style={styles.hiddenAnswer}>
                    <Text style={styles.tapHint}>TAP TO REVEAL</Text>
                    <View style={styles.hiddenLines}>
                      <View style={styles.hiddenLine} />
                      <View style={[styles.hiddenLine, { width: "70%" }]} />
                      <View style={[styles.hiddenLine, { width: "85%" }]} />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No questions available yet</Text>
              <Text style={styles.emptySubtext}>
                Start studying to unlock review questions
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.doneButton} onPress={handleClose}>
            <Text style={styles.doneText}>DONE</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    borderRadius: radii.lg,
    padding: 24,
    width: "100%",
  },
  label: {
    fontSize: 10,
    textTransform: "uppercase",
    color: colors.text3,
    letterSpacing: 1,
    marginBottom: 12,
  },
  question: {
    fontSize: 16,
    color: colors.text1,
    fontWeight: "600",
    lineHeight: 24,
    marginBottom: 24,
  },
  answerArea: {
    backgroundColor: colors.surface3,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  hiddenAnswer: {
    alignItems: "center",
  },
  tapHint: {
    fontSize: 11,
    textTransform: "uppercase",
    color: colors.text3,
    letterSpacing: 1,
    fontWeight: "600",
    marginBottom: 12,
  },
  hiddenLines: {
    width: "100%",
    gap: 8,
  },
  hiddenLine: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    width: "100%",
  },
  answerRevealed: {
    fontSize: 15,
    color: colors.success,
    fontWeight: "600",
    lineHeight: 22,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text2,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.text3,
    marginTop: 6,
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 12,
    alignItems: "center",
  },
  doneText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});
