import { View, Image, StyleSheet } from "react-native";
import { colors } from "../lib/theme";

interface ProfileAvatarProps {
  size?: number;
}

export function ProfileAvatar({ size = 80 }: ProfileAvatarProps) {
  const borderRadius = size / 2;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
        },
      ]}
    >
      <Image
        source={require("../assets/crack-mascot.png")}
        style={{
          width: size - 6,
          height: size - 6,
          borderRadius: (size - 6) / 2,
        }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2.5,
    borderColor: colors.primary,
    backgroundColor: colors.surface2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
