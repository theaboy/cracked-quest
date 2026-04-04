// components/effects/GlowBorder.tsx

import { useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { colors } from "../../lib/theme";

interface GlowBorderProps {
  children: React.ReactNode;
  color?: string;
  intensity?: number;
  borderRadius?: number;
}

export function GlowBorder({
  children,
  color = colors.primary,
  intensity = 0.6,
  borderRadius = 12,
}: GlowBorderProps) {
  const glowOpacity = useSharedValue(intensity * 0.3);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withTiming(intensity, {
        duration: 1500,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, [intensity, glowOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    shadowOpacity: glowOpacity.value,
  }));

  const glowStyle: ViewStyle = {
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16,
    elevation: 8,
    borderRadius,
  };

  return (
    <Animated.View style={[styles.wrapper, glowStyle, animatedStyle]}>
      <View style={[styles.inner, { borderRadius }]}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: "visible",
  },
  inner: {
    overflow: "hidden",
  },
});
