import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../lib/theme";

interface DeepModeOverlayProps {
  elapsedSeconds: number;
  isOnBreak: boolean;
  breakSecondsLeft: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function DeepModeOverlay({
  elapsedSeconds,
  isOnBreak,
  breakSecondsLeft,
}: DeepModeOverlayProps) {
  const glowAnim = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 20,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 8,
          duration: 1000,
          useNativeDriver: false,
        }),
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
        <Ionicons name="lock-closed" size={16} color="#B99BFF" />
        <Text style={styles.headerText}>DEEP MODE</Text>
      </View>

      {/* Timer */}
      <Animated.Text
        style={[
          styles.timer,
          {
            shadowRadius: glowAnim,
          },
        ]}
      >
        {formatTime(elapsedSeconds)}
      </Animated.Text>

      {/* Break timer */}
      {isOnBreak && (
        <View style={styles.breakContainer}>
          <Text style={styles.breakLabel}>BREAK</Text>
          <Text style={styles.breakTime}>{formatTime(breakSecondsLeft)}</Text>
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
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontSize: 13,
    color: "#B99BFF",
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  timer: {
    fontSize: 72,
    fontWeight: "800",
    color: colors.text1,
    shadowColor: "#9B6DFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
  },
  breakContainer: {
    alignItems: "center",
    marginTop: 12,
  },
  breakLabel: {
    fontSize: 11,
    color: "#F5C842",
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  breakTime: {
    fontSize: 28,
    color: "#F5C842",
    fontWeight: "700",
  },
});
