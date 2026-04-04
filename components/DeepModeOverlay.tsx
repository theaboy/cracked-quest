import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii } from "../lib/theme";

interface DeepModeOverlayProps {
  deepSecondsLeft: number;
  nextBreakIn: number;
  isOnBreak: boolean;
  breakSecondsLeft: number;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onEndSession: () => void;
}

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function DeepModeOverlay({
  deepSecondsLeft,
  nextBreakIn,
  isOnBreak,
  breakSecondsLeft,
  isPaused,
  onPause,
  onResume,
  onEndSession,
}: DeepModeOverlayProps) {
  const glowAnim = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 20, duration: 1000, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 8, duration: 1000, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [glowAnim]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="lock-closed" size={16} color={colors.primaryLight} />
        <Text style={styles.headerText}>DEEP MODE</Text>
      </View>

      {/* Center content */}
      <View style={styles.center}>
        <Animated.Text style={[styles.mainTimer, { shadowRadius: glowAnim }]}>
          {formatTime(deepSecondsLeft)}
        </Animated.Text>

        {isOnBreak ? (
          <View style={styles.subTimerWrap}>
            <Text style={styles.breakLabel}>BREAK</Text>
            <Text style={styles.breakTimer}>{formatTime(breakSecondsLeft)}</Text>
          </View>
        ) : (
          <View style={styles.subTimerWrap}>
            <Text style={styles.nextBreakLabel}>NEXT BREAK IN</Text>
            <Text style={styles.nextBreakTimer}>{formatTime(nextBreakIn)}</Text>
          </View>
        )}
      </View>

      {/* Buttons at bottom */}
      <View style={styles.buttonsWrap}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.pauseButton} onPress={isPaused ? onResume : onPause}>
            <Text style={styles.pauseButtonText}>{isPaused ? "Resume" : "Pause"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.endButton} onPress={onEndSession}>
            <Text style={styles.endButtonText}>End Session</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingTop: 70,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 13,
    color: colors.primaryLight,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  mainTimer: {
    fontSize: 64,
    fontWeight: "800",
    color: colors.text1,
    letterSpacing: -2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
  },
  subTimerWrap: {
    alignItems: "center",
    marginTop: 20,
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
  nextBreakLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.text3,
    letterSpacing: 1,
  },
  nextBreakTimer: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.text2,
    marginTop: 4,
  },
  buttonsWrap: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  pauseButton: {
    flex: 1,
    backgroundColor: colors.surface3,
    borderRadius: radii.md,
    paddingVertical: 16,
    alignItems: "center",
  },
  pauseButtonText: {
    color: colors.text1,
    fontSize: 16,
    fontWeight: "700",
  },
  endButton: {
    flex: 1,
    backgroundColor: colors.danger,
    borderRadius: radii.md,
    paddingVertical: 16,
    alignItems: "center",
  },
  endButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
