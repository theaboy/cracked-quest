# Deep Mode UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a visually distinct Deep Mode study experience with a transition animation, vignette overlay, pulsing timer, and exit gate (quiz + penalty escape).

**Architecture:** Deep Mode reuses the existing study timer and quiz mechanics but wraps them in new visual components. A transition screen plays first, then the active session shows a vignette overlay. Ending the session shows an exit gate modal instead of immediately ending. The store gets `isOnBreak` and `breakSecondsLeft` state for the break timer.

**Tech Stack:** React Native Animated API, expo-av (Video), existing ChatBubble component, Ionicons, useStudyStore

---

### Task 1: Update useStudyStore with break state

**Files:**
- Modify: `store/useStudyStore.ts`

- [ ] **Step 1: Add break state and actions to the store**

```tsx
// store/useStudyStore.ts
import { create } from "zustand";

interface StudyState {
  isStudying: boolean;
  isPaused: boolean;
  mode: "focus" | "deep" | null;
  elapsedSeconds: number;
  currentTopicId: string | null;
  isOnBreak: boolean;
  breakSecondsLeft: number;
  startSession: (mode: "focus" | "deep", topicId: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  resetSession: () => void;
  tick: () => void;
  startBreak: () => void;
  tickBreak: () => void;
  endBreak: () => void;
}

export const useStudyStore = create<StudyState>((set) => ({
  isStudying: false,
  isPaused: false,
  mode: null,
  elapsedSeconds: 0,
  currentTopicId: null,
  isOnBreak: false,
  breakSecondsLeft: 0,
  startSession: (mode, topicId) =>
    set({ isStudying: true, isPaused: false, mode, currentTopicId: topicId, elapsedSeconds: 0, isOnBreak: false, breakSecondsLeft: 0 }),
  pauseSession: () => set({ isPaused: true }),
  resumeSession: () => set({ isPaused: false }),
  endSession: () => set({ isStudying: false, isPaused: false, mode: null, currentTopicId: null }),
  resetSession: () =>
    set({ isStudying: false, isPaused: false, mode: null, currentTopicId: null, elapsedSeconds: 0, isOnBreak: false, breakSecondsLeft: 0 }),
  tick: () => set((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 })),
  startBreak: () => set({ isOnBreak: true, isPaused: true, breakSecondsLeft: 300 }),
  tickBreak: () =>
    set((s) => {
      if (s.breakSecondsLeft <= 1) {
        return { isOnBreak: false, breakSecondsLeft: 0 };
      }
      return { breakSecondsLeft: s.breakSecondsLeft - 1 };
    }),
  endBreak: () => set({ isOnBreak: false, breakSecondsLeft: 0, isPaused: false }),
}));
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add store/useStudyStore.ts
git commit -m "feat: add break timer state to useStudyStore for Deep Mode"
```

---

### Task 2: Deep Mode Transition Screen

**Files:**
- Create: `components/DeepModeTransition.tsx`

- [ ] **Step 1: Create transition component**

This component shows for ~3 seconds when Deep Mode starts: black background, Crack video playing, "Lock in" ChatBubble on top.

```tsx
// components/DeepModeTransition.tsx
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { colors } from "../lib/theme";

interface Props {
  onComplete: () => void;
}

export default function DeepModeTransition({ onComplete }: Props) {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    // Show bubble after a short delay
    const bubbleTimer = setTimeout(() => setShowBubble(true), 400);
    // Auto-advance after 3 seconds
    const advanceTimer = setTimeout(() => onComplete(), 3000);
    return () => {
      clearTimeout(bubbleTimer);
      clearTimeout(advanceTimer);
    };
  }, [onComplete]);

  return (
    <View style={styles.container}>
      {/* Speech bubble */}
      {showBubble && (
        <View style={styles.bubbleWrap}>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>Lock in</Text>
          </View>
          <View style={styles.spikeWrap}>
            <View style={styles.spikeOuter} />
            <View style={styles.spikeInner} />
          </View>
        </View>
      )}

      {/* Video */}
      <Video
        source={require("../assets/crack-deep-mode.mp4")}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping={false}
        isMuted
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleWrap: {
    alignItems: "center",
    marginBottom: -8,
    zIndex: 10,
  },
  bubble: {
    backgroundColor: colors.surface2,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  bubbleText: {
    color: colors.text1,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  spikeWrap: {
    alignSelf: "center",
    position: "relative",
  },
  spikeOuter: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 14,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: colors.primary,
  },
  spikeInner: {
    position: "absolute",
    top: -1.5,
    left: 1.5,
    width: 0,
    height: 0,
    borderLeftWidth: 8.5,
    borderRightWidth: 8.5,
    borderTopWidth: 12.5,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: colors.surface2,
  },
  video: {
    width: 280,
    height: 280,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/DeepModeTransition.tsx
git commit -m "feat: add Deep Mode transition screen with video and Lock in bubble"
```

---

### Task 3: Deep Mode Overlay (Vignette + Pulsing Timer)

**Files:**
- Create: `components/DeepModeOverlay.tsx`

- [ ] **Step 1: Create overlay component**

This wraps the active timer view when in Deep Mode. It adds a vignette border, lock icon header, and pulsing glow on the timer.

```tsx
// components/DeepModeOverlay.tsx
import { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../lib/theme";

interface Props {
  elapsedSeconds: number;
  isOnBreak: boolean;
  breakSecondsLeft: number;
}

function formatTime(totalSeconds: number): string {
  const mm = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const ss = (totalSeconds % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function DeepModeOverlay({ elapsedSeconds, isOnBreak, breakSecondsLeft }: Props) {
  const glowAnim = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 20, duration: 1000, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 8, duration: 1000, useNativeDriver: false }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View style={styles.container}>
      {/* Vignette edges */}
      <View style={styles.vignetteTop} />
      <View style={styles.vignetteBottom} />
      <View style={styles.vignetteLeft} />
      <View style={styles.vignetteRight} />

      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="lock-closed" size={16} color={colors.primaryLight} />
        <Text style={styles.headerText}>DEEP MODE</Text>
      </View>

      {/* Timer with pulsing glow */}
      <View style={styles.timerWrap}>
        <Animated.Text
          style={[
            styles.timer,
            {
              textShadowColor: colors.primary,
              textShadowRadius: glowAnim,
            },
          ]}
        >
          {formatTime(elapsedSeconds)}
        </Animated.Text>
      </View>

      {/* Break timer */}
      {isOnBreak && (
        <View style={styles.breakWrap}>
          <Text style={styles.breakLabel}>BREAK</Text>
          <Text style={styles.breakTimer}>{formatTime(breakSecondsLeft)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  vignetteTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  vignetteBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  vignetteLeft: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 40,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  vignetteRight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: 40,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  header: {
    position: "absolute",
    top: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    color: colors.primaryLight,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  timerWrap: {
    alignItems: "center",
  },
  timer: {
    fontSize: 72,
    fontWeight: "800",
    color: colors.text1,
    letterSpacing: -2,
    textShadowOffset: { width: 0, height: 0 },
  },
  breakWrap: {
    marginTop: 20,
    alignItems: "center",
  },
  breakLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.gold,
    letterSpacing: 1.5,
  },
  breakTimer: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.gold,
    marginTop: 4,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/DeepModeOverlay.tsx
git commit -m "feat: add DeepModeOverlay with vignette, lock header, pulsing timer"
```

---

### Task 4: Exit Gate Modal

**Files:**
- Create: `components/ExitGateModal.tsx`

- [ ] **Step 1: Create exit gate modal**

Shows two paths: quiz gate (answer to earn break) or penalty escape (-20 XP).

```tsx
// components/ExitGateModal.tsx
import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { colors, radii } from "../lib/theme";
import { QUESTION_BANK, QuizQuestion } from "../lib/questionBank";

interface Props {
  visible: boolean;
  topicId: string;
  daysUntilExam: number | null;
  onStay: () => void;
  onQuizCorrect: () => void;
  onPenaltyExit: () => void;
}

export default function ExitGateModal({
  visible,
  topicId,
  daysUntilExam,
  onStay,
  onQuizCorrect,
  onPenaltyExit,
}: Props) {
  const [phase, setPhase] = useState<"choose" | "quiz" | "wrong">("choose");
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const loadQuestion = () => {
    const pool = QUESTION_BANK.filter((q) => q.topicId === topicId);
    if (pool.length === 0) return;
    setQuestion(pool[Math.floor(Math.random() * pool.length)]);
    setSelectedIndex(null);
    setPhase("quiz");
  };

  const handleAnswer = (index: number) => {
    if (selectedIndex !== null || !question) return;
    setSelectedIndex(index);
    setTimeout(() => {
      if (index === question.correctIndex) {
        setPhase("choose");
        setQuestion(null);
        setSelectedIndex(null);
        onQuizCorrect();
      } else {
        setPhase("wrong");
      }
    }, 800);
  };

  const handleClose = () => {
    setPhase("choose");
    setQuestion(null);
    setSelectedIndex(null);
    onStay();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Choose phase */}
          {phase === "choose" && (
            <>
              <Text style={styles.title}>End Deep Mode?</Text>
              <Text style={styles.body}>
                -20 XP penalty.{daysUntilExam ? ` Your midterm is in ${daysUntilExam} ${daysUntilExam === 1 ? "day" : "days"}.` : ""}
              </Text>

              <TouchableOpacity style={styles.quizButton} onPress={loadQuestion}>
                <Text style={styles.quizButtonText}>ANSWER A QUESTION INSTEAD</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.stayButton} onPress={handleClose}>
                <Text style={styles.stayButtonText}>STAY</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.leaveButton} onPress={onPenaltyExit}>
                <Text style={styles.leaveButtonText}>LEAVE (-20 XP)</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Quiz phase */}
          {phase === "quiz" && question && (
            <>
              <Text style={styles.quizLabel}>Answer correctly for a 5-min break</Text>
              <Text style={styles.questionText}>{question.question}</Text>
              {question.options.map((opt, i) => {
                const isSelected = selectedIndex === i;
                const isCorrect = i === question.correctIndex;
                const showResult = selectedIndex !== null;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.optionButton,
                      showResult && isSelected && isCorrect && styles.optionCorrect,
                      showResult && isSelected && !isCorrect && styles.optionWrong,
                    ]}
                    onPress={() => handleAnswer(i)}
                    disabled={selectedIndex !== null}
                  >
                    <Text style={[
                      styles.optionText,
                      showResult && isSelected && isCorrect && { color: colors.success },
                      showResult && isSelected && !isCorrect && { color: colors.danger },
                    ]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          {/* Wrong answer phase */}
          {phase === "wrong" && (
            <>
              <Text style={styles.title}>Not quite!</Text>
              <Text style={styles.body}>
                Keep going — you've got this.{daysUntilExam ? ` Midterm in ${daysUntilExam} ${daysUntilExam === 1 ? "day" : "days"}.` : ""}
              </Text>

              <TouchableOpacity style={styles.quizButton} onPress={loadQuestion}>
                <Text style={styles.quizButtonText}>TRY ANOTHER QUESTION</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.stayButton} onPress={handleClose}>
                <Text style={styles.stayButtonText}>BACK TO STUDYING</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.leaveButton} onPress={onPenaltyExit}>
                <Text style={styles.leaveButtonText}>LEAVE (-20 XP)</Text>
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
    borderRadius: radii.lg,
    padding: 24,
    width: "100%",
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text1,
    textAlign: "center",
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: colors.text2,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  quizButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 10,
  },
  quizButtonText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  stayButton: {
    backgroundColor: colors.surface3,
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  stayButtonText: {
    color: colors.text1,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  leaveButton: {
    borderWidth: 1.5,
    borderColor: colors.danger,
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: "center",
  },
  leaveButtonText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  quizLabel: {
    fontSize: 11,
    color: colors.text3,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    color: colors.text1,
    fontWeight: "600",
    lineHeight: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: colors.surface3,
    borderRadius: radii.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionCorrect: {
    borderColor: colors.success,
    backgroundColor: "rgba(78,255,180,0.1)",
  },
  optionWrong: {
    borderColor: colors.danger,
    backgroundColor: "rgba(255,87,87,0.1)",
  },
  optionText: {
    fontSize: 14,
    color: colors.text1,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/ExitGateModal.tsx
git commit -m "feat: add ExitGateModal with quiz gate and penalty escape"
```

---

### Task 5: Integrate Deep Mode into Study Screen

**Files:**
- Modify: `app/(tabs)/study.tsx`

- [ ] **Step 1: Add Deep Mode integration to the study screen**

This is the integration task. The study screen needs:
1. A `deepPhase` state: `null | "transition" | "active"` — controls whether to show the transition or the active overlay
2. When `selectedMode === "deep"` and user starts: set `deepPhase = "transition"` instead of going straight to active timer
3. When transition completes (3s): set `deepPhase = "active"`, start the timer
4. When Deep Mode active: render `DeepModeOverlay` on top of the timer view
5. When "End Session" tapped in Deep Mode: show `ExitGateModal` instead of ending
6. Handle quiz correct (start break), penalty exit (deduct 20 XP, end session), stay (dismiss modal)
7. Break timer: tick down from 300s, show "Break over" when done

The study screen is large (~400+ lines). The subagent should read the current `app/(tabs)/study.tsx` file first to understand the existing structure, then:

- Add imports: `DeepModeTransition`, `DeepModeOverlay`, `ExitGateModal`
- Add state: `deepPhase`, `exitGateVisible`
- Modify `handleStartSession`: if deep mode, set `deepPhase = "transition"` instead of going to active view immediately
- Add `handleTransitionComplete`: set `deepPhase = "active"`, call `startSession`
- Modify `handleEndSession`: if deep mode, show exit gate instead of ending
- Add `handleQuizCorrect`: call `startBreak()` from store, dismiss exit gate, show toast "5 min break earned!"
- Add `handlePenaltyExit`: deduct 20 XP (`addXp(-20)`), end session, go to summary
- Add break timer `useEffect`: when `isOnBreak`, tick break every 1s
- Render `DeepModeTransition` when `deepPhase === "transition"`
- Render `DeepModeOverlay` when `deepPhase === "active"` and mode is deep
- Render `ExitGateModal` controlled by `exitGateVisible`
- Calculate `daysUntilExam` from the current topic's course for the exit gate

Focus Mode should remain completely unchanged.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Test in Expo Go**

- Select Deep Mode → Start → transition video plays with "Lock in" bubble → after 3s timer appears with vignette + pulsing glow + lock icon
- Tap End Session → exit gate modal (not direct end)
- Tap "Answer a question" → quiz appears → correct → "5 min break earned!" + break timer
- Wrong answer → encouragement + try again / leave options
- Tap "Leave (-20 XP)" → session ends, -20 XP
- Tap "Stay" → modal dismisses, session continues
- Select Focus Mode → everything works as before (no vignette, no exit gate)

- [ ] **Step 4: Commit**

```bash
git add app/\(tabs\)/study.tsx
git commit -m "feat: integrate Deep Mode transition, overlay, and exit gate into study screen"
```
