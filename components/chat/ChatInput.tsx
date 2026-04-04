import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChatInputProps {
  onSend: (text: string) => void;
  onSurveyPress: () => void;
}

export default function ChatInput({ onSend, onSurveyPress }: ChatInputProps) {
  const [text, setText] = useState("");

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  }

  const hasText = text.trim().length > 0;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type a message..."
        placeholderTextColor="#5C5B6E"
        multiline
        maxLength={500}
        returnKeyType="default"
      />
      <TouchableOpacity
        onPress={onSurveyPress}
        style={styles.iconButton}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="bar-chart-outline" size={22} color="#9896AA" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSend}
        style={styles.iconButton}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        disabled={!hasText}
      >
        <Ionicons
          name="send"
          size={20}
          color={hasText ? "#8B5CF6" : "#5C5B6E"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141418",
    borderTopWidth: 1,
    borderTopColor: "#2E2E3E",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 32, // safe area padding
  },
  input: {
    flex: 1,
    backgroundColor: "#1C1C22",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: "#F0EFF8",
    fontSize: 15,
    maxHeight: 100,
  },
  iconButton: {
    padding: 8,
  },
});
