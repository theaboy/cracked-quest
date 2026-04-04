import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  Animated,
} from "react-native";
import { useStudyStore } from "../../store/useStudyStore";
import { useXpStore } from "../../store/useXpStore";
import { useAuthStore } from "../../store/useAuthStore";
import { supabase } from "../../lib/supabase";
import {
  getRandomQuestion,
  getExamCountdown,
  type QuizQuestion,
} from "../../lib/questionBank";
import DeepModeTransition from "../../components/DeepModeTransition";
import DeepModeOverlay from "../../components/DeepModeOverlay";
import ExitGateModal from "../../components/ExitGateModal";

const MOCK_TOPICS = [
  { id: "t1", name: "Linear Regression", course: "COMP 551" },
  { id: "t2", name: "Neural Networks", course: "COMP 551" },
  { id: "t3", name: "Sorting Algorithms", course: "COMP 251" },
  { id: "t4", name: "Dynamic Programming", course: "COMP 251" },
];

function formatTime(totalSeconds: number): string {
  const mm = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const ss = (totalSeconds % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function StudyScreen() {
  const [view, setView] = useState<"setup" | "active" | "summary">("setup");
  const [selectedTopicId, setSelectedTopicId] = useState(MOCK_TOPICS[0].id);
  const [selectedMode, setSelectedMode] = useState<"focus" | "deep">("focus");
  const [summaryXp, setSummaryXp] = useState(0);
  const [summaryDuration, setSummaryDuration] = useState(0);

  // --- Deep Mode state ---
  const [deepPhase, setDeepPhase] = useState<null | "transition" | "active">(null);
  const [exitGateVisible, setExitGateVisible] = useState(false);

  // --- Quiz state ---
  const [quizVisible, setQuizVisible] = useState(false);
  const [quizPhase, setQuizPhase] = useState<"question" | "correct" | "wrong">("question");
  const [activeQuestion, setActiveQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const xpToastScale = useRef(new Animated.Value(0.5)).current;
  const answerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    isStudying, isPaused, elapsedSeconds, mode,
    isOnBreak, breakSecondsLeft,
    startSession, pauseSession, resumeSession, tick,
    startBreak, tickBreak, endBreak,
  } = useStudyStore();

  useEffect(() => {
    if (!isStudying || isPaused) return;
    const id = setInterval(() => tick(), 1000);
    return () => clearInterval(id);
  }, [isStudying, isPaused, tick]);

  useEffect(() => {
    if (quizPhase === "correct") {
      xpToastScale.setValue(0.5);
      Animated.spring(xpToastScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 120,
        friction: 7,
      }).start();
    }
  }, [quizPhase]);

  // --- Break timer (Deep Mode) ---
  useEffect(() => {
    if (!isOnBreak) return;
    const id = setInterval(() => tickBreak(), 1000);
    return () => clearInterval(id);
  }, [isOnBreak, tickBreak]);

  // When break ends naturally, resume session
  useEffect(() => {
    if (!isOnBreak && breakSecondsLeft === 0 && isStudying && isPaused && mode === "deep") {
      endBreak();
    }
  }, [isOnBreak, breakSecondsLeft, isStudying, isPaused, mode, endBreak]);

  function handleStartSession() {
    if (selectedMode === "deep") {
      setDeepPhase("transition");
      setView("active");
      return;
    }
    startSession(selectedMode, selectedTopicId);
    setView("active");
  }

  function handleTransitionComplete() {
    setDeepPhase("active");
    startSession("deep", selectedTopicId);
  }

  async function handleEndSession() {
    const { elapsedSeconds: elapsed, endSession, currentTopicId, mode: currentMode } =
      useStudyStore.getState();

    // Deep Mode: show exit gate instead of ending directly
    if (currentMode === "deep") {
      setExitGateVisible(true);
      return;
    }

    const userId = useAuthStore.getState().user?.id ?? "mock-user-id";
    endSession();

    setSummaryDuration(elapsed);
    setView("summary");

    try {
      const { data, error } = await supabase?.functions.invoke("award_xp", {
        body: {
          userId,
          topicId: currentTopicId ?? "unknown",
          mode: currentMode ?? "focus",
          durationSeconds: elapsed,
        },
      }) ?? {};

      const xpEarned = data?.xpEarned ?? 0;
      setSummaryXp(xpEarned);
      if (data?.newXpTotal != null) {
        useXpStore.getState().setXp(data.newXpTotal);
      }
      if (error) console.warn("award_xp error:", error);
    } catch (err) {
      console.warn("award_xp call failed (expected in dev):", err);
      setSummaryXp(0);
    }
  }

  function handleDismissSummary() {
    useStudyStore.getState().resetSession();
    setDeepPhase(null);
    setView("setup");
    setSummaryXp(0);
    setSummaryDuration(0);
  }

  // --- Exit Gate handlers (Deep Mode) ---
  function handleExitStay() {
    setExitGateVisible(false);
    resumeSession();
  }

  function handleExitQuizCorrect() {
    setExitGateVisible(false);
    startBreak();
  }

  async function handleExitPenalty() {
    setExitGateVisible(false);
    useXpStore.getState().addXp(-20);

    const { elapsedSeconds: elapsed, endSession, currentTopicId } =
      useStudyStore.getState();
    const userId = useAuthStore.getState().user?.id ?? "mock-user-id";
    endSession();

    setSummaryDuration(elapsed);
    setDeepPhase(null);
    setView("summary");

    try {
      const { data, error } = await supabase?.functions.invoke("award_xp", {
        body: {
          userId,
          topicId: currentTopicId ?? "unknown",
          mode: "deep",
          durationSeconds: elapsed,
        },
      }) ?? {};

      const xpEarned = data?.xpEarned ?? 0;
      setSummaryXp(xpEarned);
      if (data?.newXpTotal != null) {
        useXpStore.getState().setXp(data.newXpTotal);
      }
      if (error) console.warn("award_xp error:", error);
    } catch (err) {
      console.warn("award_xp call failed (expected in dev):", err);
      setSummaryXp(0);
    }
  }

  function handleOpenQuiz() {
    const { currentTopicId } = useStudyStore.getState();
    if (!currentTopicId) return;
    const question = getRandomQuestion(currentTopicId);
    if (!question) return;
    pauseSession();
    setActiveQuestion(question);
    setSelectedAnswerIndex(null);
    setQuizPhase("question");
    setQuizVisible(true);
  }

  function handleSelectAnswer(index: number) {
    if (selectedAnswerIndex !== null || activeQuestion === null) return;
    setSelectedAnswerIndex(index);
    const isCorrect = index === activeQuestion.correctIndex;
    answerTimeoutRef.current = setTimeout(() => {
      if (isCorrect) {
        // TODO: Wire through award_xp Edge Function (source: 'quiz') before production
        useXpStore.getState().addXp(10);
        setQuizPhase("correct");
      } else {
        setQuizPhase("wrong");
      }
    }, 700);
  }

  function handleDismissQuiz() {
    if (answerTimeoutRef.current) clearTimeout(answerTimeoutRef.current);
    setQuizVisible(false);
    setActiveQuestion(null);
    setSelectedAnswerIndex(null);
    setQuizPhase("question");
    resumeSession();
  }

  const selectedTopic = MOCK_TOPICS.find((t) => t.id === selectedTopicId);

  return (
    <SafeAreaView style={styles.container}>
      {/* ── SETUP VIEW ── */}
      {view === "setup" && (
        <ScrollView contentContainerStyle={styles.setupContent}>
          <Text style={styles.screenTitle}>Study Mode</Text>

          <Text style={styles.sectionLabel}>SELECT TOPIC</Text>
          <View>
            {MOCK_TOPICS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.topicItem,
                  item.id === selectedTopicId && styles.topicItemSelected,
                ]}
                onPress={() => setSelectedTopicId(item.id)}
              >
                <Text style={styles.topicCourse}>{item.course}</Text>
                <Text style={styles.topicName}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>MODE</Text>
          <View style={styles.modeRow}>
            <TouchableOpacity
              style={[styles.modeButton, selectedMode === "focus" && styles.modeButtonSelected]}
              onPress={() => setSelectedMode("focus")}
            >
              <Text style={[styles.modeButtonText, selectedMode === "focus" && styles.modeButtonTextSelected]}>
                Focus
              </Text>
              <Text style={[styles.modeDesc, selectedMode === "focus" && styles.modeDescSelected]}>
                Standard session
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, selectedMode === "deep" && styles.modeButtonSelected]}
              onPress={() => setSelectedMode("deep")}
            >
              <Text style={[styles.modeButtonText, selectedMode === "deep" && styles.modeButtonTextSelected]}>
                Deep
              </Text>
              <Text style={[styles.modeDesc, selectedMode === "deep" && styles.modeDescSelected]}>
                Deep work
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={handleStartSession}>
            <Text style={styles.startButtonText}>Start Session</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ── DEEP MODE TRANSITION ── */}
      {view === "active" && deepPhase === "transition" && (
        <DeepModeTransition onComplete={handleTransitionComplete} />
      )}

      {/* ── ACTIVE TIMER VIEW ── */}
      {(view === "active" || view === "summary") && deepPhase !== "transition" && (
        <View style={styles.activeContent}>
          <Text style={styles.modeLabel}>
            {selectedMode.toUpperCase()} MODE
          </Text>
          <Text style={styles.topicLabel}>{selectedTopic?.name}</Text>

          <Text style={styles.timerDisplay}>{formatTime(elapsedSeconds)}</Text>

          <View style={styles.timerButtons}>
            <TouchableOpacity
              style={styles.pauseButton}
              onPress={isPaused ? resumeSession : pauseSession}
              disabled={quizVisible}
            >
              <Text style={styles.pauseButtonText}>{isPaused ? "Resume" : "Pause"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.endButton} onPress={handleEndSession} disabled={quizVisible}>
              <Text style={styles.endButtonText}>End Session</Text>
            </TouchableOpacity>
          </View>

          {view === "active" && (
            <TouchableOpacity style={styles.quizCheckpointButton} onPress={handleOpenQuiz}>
              <Text style={styles.quizCheckpointButtonText}>Quiz Checkpoint</Text>
            </TouchableOpacity>
          )}

          {/* Deep Mode overlay (absoluteFill, renders on top) */}
          {deepPhase === "active" && view === "active" && (
            <DeepModeOverlay
              elapsedSeconds={elapsedSeconds}
              isOnBreak={isOnBreak}
              breakSecondsLeft={breakSecondsLeft}
            />
          )}
        </View>
      )}

      {/* ── QUIZ CHECKPOINT MODAL ── */}
      <Modal
        visible={quizVisible}
        transparent
        animationType="fade"
        onRequestClose={handleDismissQuiz}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.quizModalCard}>

            {/* phase: question */}
            {quizPhase === "question" && activeQuestion !== null && (
              <>
                <Text style={styles.quizLabel}>QUIZ CHECKPOINT</Text>
                <Text style={styles.quizQuestion}>{activeQuestion.question}</Text>
                <View style={styles.quizOptions}>
                  {activeQuestion.options.map((option, index) => (
                    <TouchableOpacity
                      key={`${activeQuestion.id}-${index}`}
                      style={[
                        styles.quizOptionButton,
                        selectedAnswerIndex !== null && index === activeQuestion.correctIndex && styles.quizOptionCorrect,
                        selectedAnswerIndex !== null && index === selectedAnswerIndex && index !== activeQuestion.correctIndex && styles.quizOptionWrong,
                        selectedAnswerIndex !== null && index !== activeQuestion.correctIndex && index !== selectedAnswerIndex && styles.quizOptionDimmed,
                      ]}
                      onPress={() => handleSelectAnswer(index)}
                      disabled={selectedAnswerIndex !== null}
                    >
                      <Text style={styles.quizOptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* phase: correct */}
            {quizPhase === "correct" && (
              <>
                <Text style={styles.quizResultTitle}>CORRECT!</Text>
                <Animated.Text
                  style={[styles.quizXpToast, { transform: [{ scale: xpToastScale }] }]}
                >
                  +10 XP
                </Animated.Text>
                <Text style={styles.quizResultSub}>Keep it up!</Text>
                <TouchableOpacity style={styles.dismissButton} onPress={handleDismissQuiz}>
                  <Text style={styles.dismissButtonText}>Continue Studying</Text>
                </TouchableOpacity>
              </>
            )}

            {/* phase: wrong */}
            {quizPhase === "wrong" && activeQuestion !== null && (
              <>
                <Text style={styles.quizResultWrongTitle}>Not quite.</Text>
                <Text style={styles.quizResultSub}>
                  {"Correct answer:\n"}
                  <Text style={styles.quizCorrectAnswerText}>
                    {activeQuestion.options[activeQuestion.correctIndex]}
                  </Text>
                </Text>
                <Text style={styles.quizExamCountdown}>
                  {getExamCountdown(activeQuestion.topicId)}
                </Text>
                <Text style={styles.quizEncouragement}>
                  Review this concept — you've got time.
                </Text>
                <TouchableOpacity style={styles.dismissButton} onPress={handleDismissQuiz}>
                  <Text style={styles.dismissButtonText}>Keep Studying</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </View>
      </Modal>

      {/* ── SUMMARY MODAL ── */}
      <Modal visible={view === "summary"} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Session Complete!</Text>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Time Studied</Text>
              <Text style={styles.statValue}>{formatTime(summaryDuration)}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>XP Earned</Text>
              <Text style={[styles.statValue, styles.xpValue]}>+{summaryXp} XP</Text>
            </View>

            {summaryXp === 0 && (
              <Text style={styles.xpHint}>Study 20+ min to earn XP next time</Text>
            )}

            <TouchableOpacity style={styles.dismissButton} onPress={handleDismissSummary}>
              <Text style={styles.dismissButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── EXIT GATE MODAL (Deep Mode) ── */}
      <ExitGateModal
        visible={exitGateVisible}
        topicId={useStudyStore.getState().currentTopicId ?? "unknown"}
        daysUntilExam={null}
        onStay={handleExitStay}
        onQuizCorrect={handleExitQuizCorrect}
        onPenaltyExit={handleExitPenalty}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f23",
  },
  setupContent: {
    padding: 24,
    paddingBottom: 48,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6b7280",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  topicItem: {
    backgroundColor: "#1e1e3a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  topicItemSelected: {
    borderColor: "#7c3aed",
  },
  topicCourse: {
    fontSize: 11,
    fontWeight: "600",
    color: "#7c3aed",
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  topicName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  modeRow: {
    flexDirection: "row",
    gap: 12,
  },
  modeButton: {
    flex: 1,
    backgroundColor: "#1e1e3a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  modeButtonSelected: {
    borderColor: "#7c3aed",
    backgroundColor: "#2d1f5e",
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#9ca3af",
    marginBottom: 2,
  },
  modeButtonTextSelected: {
    color: "#ffffff",
  },
  modeDesc: {
    fontSize: 12,
    color: "#6b7280",
  },
  modeDescSelected: {
    color: "#a78bfa",
  },
  startButton: {
    backgroundColor: "#7c3aed",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 32,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#ffffff",
  },
  activeContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modeLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7c3aed",
    letterSpacing: 2,
    marginBottom: 8,
  },
  topicLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9ca3af",
    marginBottom: 48,
  },
  timerDisplay: {
    fontSize: 72,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 4,
    fontVariant: ["tabular-nums"],
    marginBottom: 56,
  },
  timerButtons: {
    flexDirection: "row",
    gap: 16,
  },
  pauseButton: {
    backgroundColor: "#374151",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  pauseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  endButton: {
    backgroundColor: "#dc2626",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  endButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
  },
  modalCard: {
    backgroundColor: "#1e1e3a",
    borderRadius: 20,
    margin: 24,
    padding: 32,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 28,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 15,
    color: "#9ca3af",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  xpValue: {
    color: "#fbbf24",
  },
  xpHint: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  dismissButton: {
    backgroundColor: "#7c3aed",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },

  // ── Quiz trigger button ──────────────────────────────────────────────────
  quizCheckpointButton: {
    marginTop: 28,
    borderWidth: 2,
    borderColor: "#7c3aed",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: "transparent",
  },
  quizCheckpointButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#a78bfa",
    letterSpacing: 0.5,
  },

  // ── Quiz modal ───────────────────────────────────────────────────────────
  quizModalCard: {
    backgroundColor: "#1e1e3a",
    borderRadius: 20,
    margin: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: "#7c3aed",
  },
  quizLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7c3aed",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 16,
  },
  quizQuestion: {
    fontSize: 17,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  quizOptions: {
    gap: 10,
  },
  quizOptionButton: {
    backgroundColor: "#2d2d4e",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#4b5563",
  },
  quizOptionText: {
    fontSize: 15,
    color: "#d1d5db",
    textAlign: "center",
  },
  quizOptionCorrect: {
    backgroundColor: "#065f46",
    borderColor: "#10b981",
  },
  quizOptionWrong: {
    backgroundColor: "#7f1d1d",
    borderColor: "#ef4444",
  },
  quizOptionDimmed: {
    opacity: 0.4,
  },
  quizResultTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#10b981",
    textAlign: "center",
    marginBottom: 8,
  },
  quizXpToast: {
    fontSize: 42,
    fontWeight: "900",
    color: "#fbbf24",
    textAlign: "center",
    marginBottom: 8,
  },
  quizResultSub: {
    fontSize: 15,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  quizResultWrongTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#f87171",
    textAlign: "center",
    marginBottom: 12,
  },
  quizCorrectAnswerText: {
    color: "#10b981",
    fontWeight: "700",
  },
  quizExamCountdown: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fbbf24",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 4,
  },
  quizEncouragement: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
});
