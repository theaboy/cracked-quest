import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../lib/theme";

interface ProgressiveBlurProps {
  /** Height of the fade zone in pixels */
  height?: number;
  /** "top" fades the top edge, "bottom" fades the bottom edge */
  position?: "top" | "bottom";
  /** Background color to fade into (defaults to theme bg) */
  fadeColor?: string;
}

/**
 * Progressive fade overlay for scrollable content.
 * Uses a multi-stop LinearGradient for a smooth fade-to-background effect.
 * Works in Expo Go (no native modules required).
 */
export function ProgressiveBlur({
  height = 80,
  position = "bottom",
  fadeColor = colors.bg,
}: ProgressiveBlurProps) {
  const transparent = "transparent";

  // Multi-stop gradient for a smooth, natural fade (mimics progressive blur)
  const gradientColors =
    position === "bottom"
      ? [transparent, `${fadeColor}15`, `${fadeColor}40`, `${fadeColor}90`, `${fadeColor}CC`, fadeColor]
      : [fadeColor, `${fadeColor}CC`, `${fadeColor}90`, `${fadeColor}40`, `${fadeColor}15`, transparent];

  const locations =
    position === "bottom"
      ? [0, 0.15, 0.35, 0.6, 0.8, 1] as const
      : [0, 0.2, 0.4, 0.65, 0.85, 1] as const;

  return (
    <View
      style={[
        styles.container,
        { height },
        position === "top" ? styles.top : styles.bottom,
      ]}
      pointerEvents="none"
    >
      <LinearGradient
        colors={gradientColors as unknown as string[]}
        locations={[...locations]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: "hidden",
  },
  top: {
    top: 0,
  },
  bottom: {
    bottom: 0,
  },
});
