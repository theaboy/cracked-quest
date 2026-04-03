import { View, Text, StyleSheet } from "react-native";
import { colors } from "../lib/theme";

interface Props {
  text: string;
}

export default function ChatBubble({ text }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{text}</Text>
      </View>
      {/* Spike on bottom-right pointing down toward mascot's head */}
      <View style={styles.spikeRow}>
        <View style={styles.spikeOuter} />
        <View style={styles.spikeInner} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "center",
    marginBottom: 0,
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
    marginRight: 0,
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
  text: {
    color: colors.text1,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    textAlign: "center",
  },
});
