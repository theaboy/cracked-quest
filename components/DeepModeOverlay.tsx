import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../lib/theme";

interface DeepModeOverlayProps {
  deepSecondsLeft: number;
  nextBreakIn: number;
  isOnBreak: boolean;
  breakSecondsLeft: number;
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
    <View style={styles.container} pointerEvents="none">
      {/* Vignette bars */}
      <View style={styles.vignetteTop} />
      <View style={styles.vignetteBottom} />
      <View style={styles.vignetteLeft} />
      <View style={styles.vignetteRight} />

      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="lock-closed" size={16} color={colors.primaryLight} />
        <Text style={styles.headerText}>DEEP MODE</Text>
      </View>

      {/* Main countdown timer — 2:30:00 */}
      <Animated.Text
        style={[
          styles.mainTimer,
          { shadowRadius: glowAnim },
        ]}
      >
        {formatTime(deepSecondsLeft)}
      </Animated.Text>

      {/* Break / Next break timer */}
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
    top: 0, left: 0, right: 0,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  vignetteBottom: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  vignetteLeft: {
    position: "absolute",
    top: 0, bottom: 0, left: 0,
    width: 40,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  vignetteRight: {
    position: "absolute",
    top: 0, bottom: 0, right: 0,
    width: 40,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  header: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
});
