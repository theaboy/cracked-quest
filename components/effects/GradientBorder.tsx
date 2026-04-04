// components/effects/GradientBorder.tsx

import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../lib/theme";

interface GradientBorderProps {
  children: React.ReactNode;
  gradientColors?: string[];
  borderWidth?: number;
  borderRadius?: number;
}

export function GradientBorder({
  children,
  gradientColors = [colors.gold, colors.primary, colors.primaryDark],
  borderWidth = 2,
  borderRadius = 12,
}: GradientBorderProps) {
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.gradientContainer,
        { borderRadius, padding: borderWidth },
      ]}
    >
      <View
        style={[
          styles.innerContainer,
          {
            borderRadius: borderRadius - borderWidth,
            backgroundColor: colors.surface,
          },
        ]}
      >
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    overflow: "hidden",
  },
  innerContainer: {
    overflow: "hidden",
  },
});
