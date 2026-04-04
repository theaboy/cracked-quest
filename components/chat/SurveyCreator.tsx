import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SurveyCreatorProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (question: string, options: string[]) => void;
}

export default function SurveyCreator({
  visible,
  onClose,
  onSubmit,
}: SurveyCreatorProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);

  function resetForm() {
    setQuestion("");
    setOptions(["", ""]);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit() {
    const filtered = options.filter((o) => o.trim());
    onSubmit(question.trim(), filtered);
    resetForm();
    onClose();
  }

  function handleAddOption() {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  }

  function handleRemoveOption(index: number) {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  }

  function handleOptionChange(index: number, value: string) {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  }

  const nonEmptyOptions = options.filter((o) => o.trim()).length;
  const canSubmit = question.trim().length > 0 && nonEmptyOptions >= 2;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Create Poll</Text>

            {/* Question */}
            <Text style={styles.label}>QUESTION</Text>
            <TextInput
              style={styles.input}
              value={question}
              onChangeText={setQuestion}
              placeholder="Ask something..."
              placeholderTextColor="#6b7280"
            />

            {/* Options */}
            <Text style={[styles.label, { marginTop: 20 }]}>OPTIONS</Text>
            {options.map((opt, index) => (
              <View key={index} style={styles.optionRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={opt}
                  onChangeText={(val) => handleOptionChange(index, val)}
                  placeholder={`Option ${index + 1}`}
                  placeholderTextColor="#6b7280"
                />
                {options.length > 2 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveOption(index)}
                  >
                    <Ionicons name="close-circle" size={22} color="#9896AA" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {options.length < 5 && (
              <TouchableOpacity
                style={styles.addOptionButton}
                onPress={handleAddOption}
              >
                <Text style={styles.addOptionText}>+ Add Option</Text>
              </TouchableOpacity>
            )}

            {/* Buttons */}
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, !canSubmit && { opacity: 0.4 }]}
                onPress={handleSubmit}
                disabled={!canSubmit}
              >
                <Text style={styles.submitText}>Post Poll</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#1e1e3a",
    borderRadius: 20,
    margin: 24,
    padding: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9896AA",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2d2d4e",
    borderRadius: 10,
    padding: 12,
    color: "#F0EFF8",
    fontSize: 15,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  removeButton: {
    padding: 4,
  },
  addOptionButton: {
    borderStyle: "dashed" as const,
    borderWidth: 1,
    borderColor: "#3d3d5e",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginTop: 4,
  },
  addOptionText: {
    color: "#9896AA",
    fontSize: 14,
    fontWeight: "600",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#374151",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  cancelText: {
    color: "#9896AA",
    fontSize: 15,
    fontWeight: "700",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  submitText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});
