// components/XpProgressBar.tsx

import { View, Text, Animated, StyleSheet } from "react-native";
import { colors } from "../lib/theme";
import { getCurrentTier, getNextTier, getTierColor } from "../lib/xpUtils";
import { useXpStore } from "../store/useXpStore";

interface XpProgressBarProps {
  animatedXp: Animated.Value;
  size: "compact" | "full";
}

export function XpProgressBar({ animatedXp, size }: XpProgressBarProps) {
  const xpTotal = useXpStore((s) => s.xpTotal);
  const currentTier = getCurrentTier(xpTotal);
  const nextTier = getNextTier(xpTotal);
  const tierColor = getTierColor(xpTotal);

  const rangeStart = currentTier.threshold;
  const rangeEnd = nextTier ? nextTier.threshold : currentTier.threshold + 1;

  const animatedWidth = animatedXp.interpolate({
    inputRange: [rangeStart, rangeEnd],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  const barHeight = size === "compact" ? 6 : 10;
  const barRadius = barHeight / 2;

  return (
    <View>
      <View
        style={[
          styles.barBackground,
          {
            height: barHeight,
            borderRadius: barRadius,
            width: size === "compact" ? 90 : "100%",
          },
        ]}
      >
        <Animated.View
          style={[
            styles.barFill,
            {
              height: barHeight,
              borderRadius: barRadius,
              backgroundColor: tierColor,
              width: animatedWidth,
            },
          ]}
        />
      </View>
      {size === "full" && nextTier && (
        <View style={styles.labelRow}>
          <Text style={styles.tierLabel}>
            {currentTier.name} — {currentTier.threshold.toLocaleString()} XP
          </Text>
          <Text style={styles.tierLabel}>
            {nextTier.name} — {nextTier.threshold.toLocaleString()} XP
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  barBackground: {
    backgroundColor: colors.surface2,
    overflow: "hidden",
  },
  barFill: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  tierLabel: {
    fontSize: 11,
    color: colors.text3,
  },
});
