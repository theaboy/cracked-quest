import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors, radii } from "../lib/theme";
import { QUESTION_BANK, QuizQuestion } from "../lib/questionBank";

interface ExitGateModalProps {
  visible: boolean;
  topicId: string;
  daysUntilExam: number | null;
  onStay: () => void;
  onQuizCorrect: () => void;
  onPenaltyExit: () => void;
}

type Phase = "choose" | "quiz" | "wrong";

function pickRandomQuestion(topicId: string): QuizQuestion | null {
  const pool = QUESTION_BANK.filter((q) => q.topicId === topicId);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function ExitGateModal({
  visible,
  topicId,
  daysUntilExam,
  onStay,
  onQuizCorrect,
  onPenaltyExit,
}: ExitGateModalProps) {
  const [phase, setPhase] = useState<Phase>("choose");
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<"correct" | "wrong" | null>(
    null
  );

  const reset = useCallback(() => {
    setPhase("choose");
    setQuestion(null);
    setSelectedIndex(null);
    setAnswerResult(null);
  }, []);

  // Reset when modal opens or when onStay resets externally
  useEffect(() => {
    if (visible) {
      reset();
    }
  }, [visible, reset]);

  const loadQuestion = useCallback(() => {
    setQuestion(pickRandomQuestion(topicId));
    setSelectedIndex(null);
    setAnswerResult(null);
  }, [topicId]);

  const handleAnswerQuestion = () => {
    loadQuestion();
    setPhase("quiz");
  };

  const handleStay = () => {
    reset();
    onStay();
  };

  const handleSelectOption = (index: number) => {
    if (selectedIndex !== null) return; // already selected
    setSelectedIndex(index);

    const isCorrect = question !== null && index === question.correctIndex;
    setAnswerResult(isCorrect ? "correct" : "wrong");

    setTimeout(() => {
      if (isCorrect) {
        reset();
        onQuizCorrect();
      } else {
        setPhase("wrong");
        setSelectedIndex(null);
        setAnswerResult(null);
      }
    }, 800);
  };

  const handleTryAnother = () => {
    loadQuestion();
    setPhase("quiz");
  };

  // Build exam countdown text
  const examText =
    daysUntilExam !== null
      ? ` Your midterm is in ${daysUntilExam} ${daysUntilExam === 1 ? "day" : "days"}.`
      : "";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleStay}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* ── Choose Phase ─────────────────────────────────── */}
          {phase === "choose" && (
            <>
              <Text style={styles.title}>End Deep Mode?</Text>
              <Text style={styles.body}>
                {`-20 XP penalty.${examText}`}
              </Text>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleAnswerQuestion}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>
                  ANSWER A QUESTION INSTEAD
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleStay}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>STAY</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dangerButton}
                onPress={onPenaltyExit}
                activeOpacity={0.8}
              >
                <Text style={styles.dangerButtonText}>LEAVE (-20 XP)</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── Quiz Phase ───────────────────────────────────── */}
          {phase === "quiz" && question && (
            <>
              <Text style={styles.quizLabel}>
                ANSWER CORRECTLY FOR A 5-MIN BREAK
              </Text>
              <Text style={styles.questionText}>{question.question}</Text>

              {question.options.map((option, index) => {
                const isSelected = selectedIndex === index;
                const isCorrectAnswer = index === question.correctIndex;

                const optionStyles = [styles.optionButton as object];
                const textStyles = [styles.optionText as object];

                if (answerResult !== null && isSelected) {
                  if (answerResult === "correct") {
                    optionStyles.push(styles.optionCorrect);
                    textStyles.push({ color: colors.success });
                  } else {
                    optionStyles.push(styles.optionWrong);
                    textStyles.push({ color: colors.danger });
                  }
                }
                // Also highlight the correct answer when wrong was picked
                if (
                  answerResult === "wrong" &&
                  !isSelected &&
                  isCorrectAnswer
                ) {
                  optionStyles.push(styles.optionCorrect);
                }

                return (
                  <TouchableOpacity
                    key={index}
                    style={optionStyles}
                    onPress={() => handleSelectOption(index)}
                    activeOpacity={0.8}
                    disabled={selectedIndex !== null}
                  >
                    <Text style={textStyles}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          {/* ── Wrong Phase ──────────────────────────────────── */}
          {phase === "wrong" && (
            <>
              <Text style={styles.title}>Not quite!</Text>
              <Text style={styles.body}>
                {`Keep going, you've got this!${examText}`}
              </Text>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleTryAnother}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>
                  TRY ANOTHER QUESTION
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleStay}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>
                  BACK TO STUDYING
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dangerButton}
                onPress={onPenaltyExit}
                activeOpacity={0.8}
              >
                <Text style={styles.dangerButtonText}>LEAVE (-20 XP)</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: 24,
    width: "100%",
  },

  // ── Typography ──────────────────────────────────────────────
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text1,
    textAlign: "center",
    marginBottom: 12,
  },
  body: {
    fontSize: 14,
    color: colors.text2,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },

  // ── Choose / Wrong buttons ──────────────────────────────────
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  secondaryButton: {
    backgroundColor: colors.surface3,
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: colors.text1,
    fontWeight: "700",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: "center",
  },
  dangerButtonText: {
    color: colors.danger,
    fontWeight: "700",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  // ── Quiz phase ──────────────────────────────────────────────
  quizLabel: {
    fontSize: 11,
    color: colors.text3,
    textTransform: "uppercase",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text1,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: colors.surface3,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 14,
    color: colors.text1,
    lineHeight: 20,
  },
  optionCorrect: {
    borderColor: colors.success,
    backgroundColor: "rgba(78,255,180,0.1)",
  },
  optionWrong: {
    borderColor: colors.danger,
    backgroundColor: "rgba(255,87,87,0.1)",
  },
});
