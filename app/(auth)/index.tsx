import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video, ResizeMode } from "expo-av";
import { router } from "expo-router";
import { colors, radii } from "../../lib/theme";

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Upper content — branding + animated mascot */}
      <View style={styles.upper}>
        <Text style={styles.appName}>GetCracked</Text>
        <Text style={styles.tagline}>Study. Rank. Get Cracked.</Text>
        <View style={styles.videoWrap}>
          <Video
            source={require("../../assets/crack-animation.mp4")}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isLooping
            isMuted
          />
        </View>
      </View>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Bottom buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/(auth)/onboarding")}
        >
          <Text style={styles.primaryBtnText}>GET STARTED</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.whiteBtn}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.whiteBtnText}>I HAVE AN ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  upper: {
    alignItems: "center",
    paddingTop: 80,
  },
  videoWrap: {
    width: 320,
    height: 320,
    marginTop: 20,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  appName: {
    fontSize: 44,
    fontWeight: "800",
    color: colors.primaryLight,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  tagline: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.text2,
    marginTop: 8,
    textAlign: "center",
  },
  bottomButtons: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 18,
    alignItems: "center",
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  whiteBtn: {
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingVertical: 18,
    alignItems: "center",
  },
  whiteBtnText: {
    color: colors.bg,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
});
