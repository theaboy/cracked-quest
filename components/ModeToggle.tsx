import { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolateColor,
} from "react-native-reanimated";
import { colors } from "../lib/theme";

interface ModeToggleProps {
  value: "focus" | "deep";
  onChange: (mode: "focus" | "deep") => void;
}

const TRACK_WIDTH = 260;
const TRACK_HEIGHT = 56;
const KNOB_SIZE = 44;
const KNOB_MARGIN = 6;
const SLIDE_DISTANCE = TRACK_WIDTH - KNOB_SIZE - KNOB_MARGIN * 2;

export function ModeToggle({ value, onChange }: ModeToggleProps) {
  const progress = useSharedValue(value === "deep" ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value === "deep" ? 1 : 0, {
      duration: 400,
      easing: Easing.inOut(Easing.ease),
    });
  }, [value, progress]);

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * SLIDE_DISTANCE }],
  }));

  const knobGradientStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.primary, colors.gold]
    );
    return { backgroundColor };
  });

  const trackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.surface3, colors.surface2]
    );
    return { backgroundColor };
  });

  const focusTextStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value * 0.5,
  }));

  const deepTextStyle = useAnimatedStyle(() => ({
    opacity: 0.5 + progress.value * 0.5,
  }));

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onChange(value === "focus" ? "deep" : "focus")}
      >
        <Animated.View style={[styles.track, trackStyle]}>
          {/* Labels */}
          <View style={styles.labelsRow}>
            <Animated.Text style={[styles.label, focusTextStyle]}>
              FOCUS
            </Animated.Text>
            <Animated.Text style={[styles.label, deepTextStyle]}>
              DEEP
            </Animated.Text>
          </View>

          {/* Knob */}
          <Animated.View style={[styles.knob, knobStyle]}>
            <Animated.View style={[styles.knobInner, knobGradientStyle]}>
              <View style={styles.knobHighlight} />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>

      {/* Description below */}
      <Text style={styles.description}>
        {value === "focus" ? "Standard timed session" : "Locked-in deep work mode"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: KNOB_SIZE / 2 + KNOB_MARGIN + 8,
    position: "absolute",
    width: "100%",
  },
  label: {
    color: colors.text1,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  knob: {
    position: "absolute",
    left: KNOB_MARGIN,
    width: KNOB_SIZE,
    height: KNOB_SIZE,
  },
  knobInner: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  knobHighlight: {
    width: KNOB_SIZE * 0.5,
    height: KNOB_SIZE * 0.5,
    borderRadius: KNOB_SIZE * 0.25,
    backgroundColor: "rgba(255,255,255,0.25)",
    position: "absolute",
    top: 4,
    left: 6,
  },
  description: {
    color: colors.text3,
    fontSize: 12,
    marginTop: 10,
  },
});
