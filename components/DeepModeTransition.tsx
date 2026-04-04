import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { colors } from "../lib/theme";

interface Props {
  onComplete: () => void;
}

export default function DeepModeTransition({ onComplete }: Props) {
  const bubbleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    bubbleTimeout.current = setTimeout(() => {
      setShowBubble(true);
    }, 400);

    advanceTimeout.current = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      if (bubbleTimeout.current) clearTimeout(bubbleTimeout.current);
      if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
    };
  }, [onComplete]);

  return (
    <View style={styles.container}>
      {showBubble && (
        <View style={styles.bubbleWrapper}>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>Lock in</Text>
          </View>
          <View style={styles.spikeRow}>
            <View style={styles.spikeOuter} />
            <View style={styles.spikeInner} />
          </View>
        </View>
      )}

      <Video
        source={require("../assets/crack-deep-mode.mp4")}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping={false}
        isMuted
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  bubble: {
    backgroundColor: colors.surface2,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  spikeRow: {
    alignSelf: "center",
    position: "relative",
  },
  spikeOuter: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 14,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: colors.primary,
  },
  spikeInner: {
    position: "absolute",
    top: -1.5,
    left: 1.5,
    width: 0,
    height: 0,
    borderLeftWidth: 8.5,
    borderRightWidth: 8.5,
    borderTopWidth: 12.5,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: colors.surface2,
  },
  bubbleText: {
    color: colors.text1,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    textAlign: "center",
  },
  video: {
    width: 280,
    height: 280,
  },
});
