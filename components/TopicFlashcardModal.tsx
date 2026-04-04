import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors, radii } from "../lib/theme";

interface Flashcard {
  front: string;
  back: string;
}

interface TopicFlashcardModalProps {
  visible: boolean;
  onClose: () => void;
  flashcards: Flashcard[];
  topicName: string;
  courseCode: string;
}

export default function TopicFlashcardModal({
  visible,
  onClose,
  flashcards,
  topicName,
  courseCode,
}: TopicFlashcardModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(0);
      setRevealed(false);
    }
  }, [visible]);

  const card = flashcards[currentIndex];
  const isLast = currentIndex === flashcards.length - 1;

  const handleNext = () => {
    setCurrentIndex((i) => i + 1);
    setRevealed(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {flashcards.length > 0 && card ? (
            <>
              <Text style={styles.label}>
                {courseCode} &middot; {topicName}{"  "}
                Card {currentIndex + 1} / {flashcards.length}
              </Text>

              <TouchableOpacity
                style={styles.answerArea}
                activeOpacity={0.8}
                onPress={() => !revealed && setRevealed(true)}
                disabled={revealed}
              >
                <Text style={[styles.frontText, revealed && styles.frontTextDimmed]}>
                  {card.front}
                </Text>

                {revealed ? (
                  <Text style={styles.backText}>{card.back}</Text>
                ) : (
                  <View style={styles.hiddenAnswer}>
                    <Text style={styles.tapHint}>TAP TO REVEAL BACK</Text>
                    <View style={styles.hiddenLines}>
                      <View style={styles.hiddenLine} />
                      <View style={[styles.hiddenLine, { width: "70%" }]} />
                      <View style={[styles.hiddenLine, { width: "85%" }]} />
                    </View>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.buttonRow}>
                {!revealed && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={() => setRevealed(true)}
                  >
                    <Text style={styles.primaryButtonText}>Reveal</Text>
                  </TouchableOpacity>
                )}
                {revealed && !isLast && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={handleNext}
                  >
                    <Text style={styles.primaryButtonText}>Next →</Text>
                  </TouchableOpacity>
                )}
                {revealed && isLast && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={onClose}
                  >
                    <Text style={styles.primaryButtonText}>Finish</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.actionButton, styles.doneButton]}
                  onPress={onClose}
                >
                  <Text style={styles.doneText}>DONE</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No flashcards generated yet</Text>
              <Text style={styles.emptySubtext}>
                Tap "Generate Flashcards" to create cards from your notes
              </Text>
            </View>
          )}

          {flashcards.length === 0 && (
            <TouchableOpacity style={styles.doneButton} onPress={onClose}>
              <Text style={styles.doneText}>DONE</Text>
            </TouchableOpacity>
          )}
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
  answerArea: {
    backgroundColor: colors.surface3,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    gap: 12,
  },
  frontText: {
    fontSize: 16,
    color: colors.text1,
    fontWeight: "600",
    lineHeight: 24,
  },
  frontTextDimmed: {
    fontSize: 13,
    color: colors.text2,
    fontWeight: "400",
  },
  backText: {
    fontSize: 15,
    color: colors.success,
    fontWeight: "600",
    lineHeight: 22,
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
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: radii.pill,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
  doneButton: {
    flex: 1,
    borderRadius: radii.pill,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  doneText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.8,
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
    textAlign: "center",
  },
});
