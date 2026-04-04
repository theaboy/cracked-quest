import { useEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { colors } from "../lib/theme";

// Video is 3.04s at 24fps
const VIDEO_DURATION_MS = 3040;
const BUBBLE_DELAY_MS = Math.round(VIDEO_DURATION_MS / 4); // 1/4 of video
const PAUSE_AFTER_VIDEO_MS = 1500; // pause on last frame before advancing

interface Props {
  onComplete: () => void;
}

export default function DeepModeTransition({ onComplete }: Props) {
  const [showBubble, setShowBubble] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const bubbleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePlaybackStatus = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    // Video started playing — swap from image to video
    if (status.isPlaying && !videoPlaying) {
      setVideoPlaying(true);

      // Show bubble at 1/4 of video duration
      bubbleTimeout.current = setTimeout(() => setShowBubble(true), BUBBLE_DELAY_MS);
    }

    // Video finished — pause on last frame, then advance
    if (status.didJustFinish && !videoEnded) {
      setVideoEnded(true);
      advanceTimeout.current = setTimeout(() => onComplete(), PAUSE_AFTER_VIDEO_MS);
    }
  };

  useEffect(() => {
    return () => {
      if (bubbleTimeout.current) clearTimeout(bubbleTimeout.current);
      if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Mascot area — fixed position, never moves */}
      <View style={styles.mascotArea}>
        {/* Speech bubble — absolutely positioned above mascot */}
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
        {/* Static first frame — always visible as base layer */}
        <Image
          source={require("../assets/crack-deep-mode-frame.png")}
          style={styles.mascotImage}
          resizeMode="contain"
        />

        {/* Video — overlays the image seamlessly when playing */}
        <Video
          source={require("../assets/crack-deep-mode.mp4")}
          style={[styles.videoOverlay, !videoPlaying && styles.hidden]}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping={false}
          isMuted
          onPlaybackStatusUpdate={handlePlaybackStatus}
        />
      </View>
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
    position: "absolute",
    top: -60,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  bubble: {
    backgroundColor: colors.surface2,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  bubbleText: {
    color: colors.text1,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
    textAlign: "center",
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
  mascotArea: {
    width: 280,
    height: 280,
  },
  mascotImage: {
    width: 280,
    height: 280,
    position: "absolute",
  },
  videoOverlay: {
    width: 280,
    height: 280,
    position: "absolute",
  },
  hidden: {
    opacity: 0,
  },
});
