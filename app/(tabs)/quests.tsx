import { useRef, useState } from "react";
import {
  Animated,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useQuestStore, type Quest } from "../../store/useQuestStore";
import { useXpStore } from "../../store/useXpStore";
import { colors } from "../../lib/theme";

function generateId(): string {
  return `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export default function QuestsScreen() {
  const { quests, addQuest, toggleTask } = useQuestStore();
  const addXp = useXpStore((s) => s.addXp);

  const [expandedId, setExpandedId] = useState<string | null>(quests[0]?.id ?? null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formDue, setFormDue] = useState("");
  const [formCourse, setFormCourse] = useState("");
  const [toastLabel, setToastLabel] = useState<string | null>(null);
  const xpToastScale = useRef(new Animated.Value(0.5)).current;

  function handleToggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function handleTaskCheck(questId: string, taskId: string, alreadyDone: boolean) {
    if (alreadyDone) return; // tasks are one-way completions in P1
    toggleTask(questId, taskId);
    // TODO: Replace with server-side award_xp Edge Function call (source: 'task') before production
    addXp(15);
    showXpToast("+15 XP");
  }

  function showXpToast(label: string) {
    setToastLabel(label);
    xpToastScale.setValue(0.5);
    Animated.spring(xpToastScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 120,
      friction: 7,
    }).start(() => {
      setTimeout(() => setToastLabel(null), 1400);
    });
  }

  function handleOpenModal() {
    setFormTitle("");
    setFormDesc("");
    setFormDue("");
    setFormCourse("");
    setModalVisible(true);
  }

  function handleAddQuest() {
    const trimmedTitle = formTitle.trim();
    if (!trimmedTitle) return;
    const newQuest: Quest = {
      id: generateId(),
      title: trimmedTitle,
      description: formDesc.trim(),
      dueDate: formDue.trim() || "No due date",
      course: formCourse.trim() || "General",
      tasks: [],
    };
    addQuest(newQuest);
    setExpandedId(newQuest.id);
    setModalVisible(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.headerRow}>
          <Text style={styles.screenTitle}>Assignment Quests</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleOpenModal}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {quests.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No quests yet.</Text>
            <Text style={styles.emptyStateSubtext}>Tap "+ Add" to break down an assignment.</Text>
          </View>
        )}

        {quests.map((quest) => {
          const isExpanded = expandedId === quest.id;
          const completedCount = quest.tasks.filter((t) => t.completed).length;
          const totalCount = quest.tasks.length;

          return (
            <View key={quest.id} style={styles.card}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => handleToggleExpand(quest.id)}
                activeOpacity={0.75}
              >
                <View style={styles.cardHeaderLeft}>
                  <Text style={styles.cardCourse}>{quest.course}</Text>
                  <Text style={styles.cardTitle}>{quest.title}</Text>
                  {quest.description.length > 0 && (
                    <Text style={styles.cardDesc} numberOfLines={isExpanded ? undefined : 1}>
                      {quest.description}
                    </Text>
                  )}
                </View>
                <View style={styles.cardHeaderRight}>
                  <Text style={styles.cardDue}>Due {quest.dueDate}</Text>
                  {totalCount > 0 && (
                    <Text style={styles.cardProgress}>{completedCount}/{totalCount}</Text>
                  )}
                  <Text style={styles.chevron}>{isExpanded ? "▲" : "▼"}</Text>
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.taskList}>
                  {quest.tasks.length === 0 && (
                    <Text style={styles.noTasksText}>No tasks yet — real breakdown coming soon.</Text>
                  )}
                  {quest.tasks.map((task) => (
                    <TouchableOpacity
                      key={task.id}
                      style={styles.taskRow}
                      onPress={() => handleTaskCheck(quest.id, task.id, task.completed)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
                        {task.completed && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <View style={styles.taskTextBlock}>
                        <Text style={styles.taskDay}>{task.day}</Text>
                        <Text style={[styles.taskDescription, task.completed && styles.taskDescriptionDone]}>
                          {task.description}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}

      </ScrollView>

      {toastLabel !== null && (
        <Animated.View
          style={[styles.xpToast, { transform: [{ scale: xpToastScale }] }]}
          pointerEvents="none"
        >
          <Text style={styles.xpToastText}>{toastLabel}</Text>
        </Animated.View>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Assignment</Text>

            <Text style={styles.fieldLabel}>TITLE *</Text>
            <TextInput
              style={styles.textInput}
              value={formTitle}
              onChangeText={setFormTitle}
              placeholder="e.g. COMP 251 Problem Set 4"
              placeholderTextColor={colors.text3}
              returnKeyType="next"
            />

            <Text style={styles.fieldLabel}>DESCRIPTION</Text>
            <TextInput
              style={[styles.textInput, styles.textInputMultiline]}
              value={formDesc}
              onChangeText={setFormDesc}
              placeholder="Brief description (optional)"
              placeholderTextColor={colors.text3}
              multiline
              numberOfLines={3}
              returnKeyType="next"
            />

            <Text style={styles.fieldLabel}>DUE DATE</Text>
            <TextInput
              style={styles.textInput}
              value={formDue}
              onChangeText={setFormDue}
              placeholder="e.g. Apr 20, 2026"
              placeholderTextColor={colors.text3}
              returnKeyType="next"
            />

            <Text style={styles.fieldLabel}>COURSE</Text>
            <TextInput
              style={styles.textInput}
              value={formCourse}
              onChangeText={setFormCourse}
              placeholder="e.g. COMP 251"
              placeholderTextColor={colors.text3}
              returnKeyType="done"
              onSubmitEditing={handleAddQuest}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, !formTitle.trim() && styles.submitButtonDisabled]}
                onPress={handleAddQuest}
                disabled={!formTitle.trim()}
              >
                <Text style={styles.submitButtonText}>Add Quest</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:            { flex: 1, backgroundColor: colors.bg },
  scrollContent:        { padding: 20, paddingBottom: 48 },

  headerRow:            { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  screenTitle:          { fontSize: 26, fontWeight: "800", color: colors.text1 },
  addButton:            { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  addButtonText:        { fontSize: 14, fontWeight: "700", color: colors.text1 },

  emptyState:           { alignItems: "center", marginTop: 64 },
  emptyStateText:       { fontSize: 18, fontWeight: "700", color: colors.text2 },
  emptyStateSubtext:    { fontSize: 14, color: colors.text3, marginTop: 8, textAlign: "center" },

  card:                 { backgroundColor: colors.surface2, borderRadius: 14, marginBottom: 14, overflow: "hidden", borderWidth: 1, borderColor: colors.border },
  cardHeader:           { flexDirection: "row", justifyContent: "space-between", padding: 16 },
  cardHeaderLeft:       { flex: 1, marginRight: 12 },
  cardHeaderRight:      { alignItems: "flex-end" },
  cardCourse:           { fontSize: 11, fontWeight: "700", color: colors.primary, letterSpacing: 1, marginBottom: 2 },
  cardTitle:            { fontSize: 16, fontWeight: "700", color: colors.text1, marginBottom: 4 },
  cardDesc:             { fontSize: 13, color: colors.text2, lineHeight: 18 },
  cardDue:              { fontSize: 11, color: colors.text3, marginBottom: 4 },
  cardProgress:         { fontSize: 12, fontWeight: "700", color: colors.primaryLight, marginBottom: 4 },
  chevron:              { fontSize: 11, color: colors.text3 },

  taskList:             { borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 16, paddingBottom: 12, paddingTop: 8 },
  noTasksText:          { fontSize: 13, color: colors.text3, fontStyle: "italic", paddingVertical: 8 },
  taskRow:              { flexDirection: "row", alignItems: "flex-start", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  checkbox:             { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.primary, marginRight: 12, marginTop: 2, alignItems: "center", justifyContent: "center" },
  checkboxDone:         { backgroundColor: colors.primary, borderColor: colors.primary },
  checkmark:            { fontSize: 13, fontWeight: "800", color: colors.text1, lineHeight: 15 },
  taskTextBlock:        { flex: 1 },
  taskDay:              { fontSize: 11, fontWeight: "700", color: colors.primary, letterSpacing: 0.4, marginBottom: 2 },
  taskDescription:      { fontSize: 14, color: colors.text1, lineHeight: 20 },
  taskDescriptionDone:  { color: colors.text3, textDecorationLine: "line-through" },

  xpToast:              { position: "absolute", bottom: 100, alignSelf: "center", backgroundColor: colors.gold, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 24 },
  xpToastText:          { fontSize: 24, fontWeight: "900", color: colors.bg },

  modalOverlay:         { flex: 1, backgroundColor: "rgba(0,0,0,0.85)", justifyContent: "center" },
  modalCard:            { backgroundColor: colors.surface2, borderRadius: 20, margin: 24, padding: 28 },
  modalTitle:           { fontSize: 22, fontWeight: "800", color: colors.text1, marginBottom: 24 },
  fieldLabel:           { fontSize: 10, fontWeight: "700", color: colors.text3, letterSpacing: 1.5, marginBottom: 6, marginTop: 14 },
  textInput:            { backgroundColor: colors.border, borderRadius: 10, padding: 12, fontSize: 15, color: colors.text1, borderWidth: 1, borderColor: colors.border },
  textInputMultiline:   { minHeight: 72, textAlignVertical: "top" },
  modalButtons:         { flexDirection: "row", gap: 12, marginTop: 28 },
  cancelButton:         { flex: 1, backgroundColor: colors.surface3, borderRadius: 12, padding: 14, alignItems: "center" },
  cancelButtonText:     { fontSize: 15, fontWeight: "700", color: colors.text2 },
  submitButton:         { flex: 1, backgroundColor: colors.primary, borderRadius: 12, padding: 14, alignItems: "center" },
  submitButtonDisabled: { opacity: 0.4 },
  submitButtonText:     { fontSize: 15, fontWeight: "700", color: colors.text1 },
});
