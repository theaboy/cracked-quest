import { View, Image, StyleSheet } from "react-native";
import { getAvatarForLevel, getLevelColor, type LevelName } from "../lib/levelSystem";

interface LevelAvatarProps {
  level: LevelName | number;
  size?: number;
  showGlow?: boolean;
}

export function LevelAvatar({
  level,
  size = 40,
  showGlow = false,
}: LevelAvatarProps) {
  const accentColor = getLevelColor(level);
  const avatar = getAvatarForLevel(level);

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size },
        showGlow && {
          shadowColor: accentColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.7,
          shadowRadius: size * 0.35,
          elevation: 12,
        },
      ]}
    >
      <Image
        source={avatar}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
