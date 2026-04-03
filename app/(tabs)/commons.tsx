import { useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCommonsStore, type ResourceType } from "../../store/useCommonsStore";
import { useAuthStore } from "../../store/useAuthStore"; // static accessor only — never used as a hook
import { useXpStore } from "../../store/useXpStore";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEMO_COURSES = ["COMP 551", "COMP 251", "COMP 206"] as const;
const COURSES = ["All", ...DEMO_COURSES] as const;

const RESOURCE_TYPES: ResourceType[] = [
  "Notes",
  "Past Exam",
  "Summary",
  "Slides",
  "Cheatsheet",
];

const TYPE_BADGE_COLORS: Record<ResourceType, string> = {
  Notes:       "#3b82f6",
  "Past Exam": "#ef4444",
  Summary:     "#10b981",
  Slides:      "#f59e0b",
  Cheatsheet:  "#7c3aed",
};

function generateId(): string {
  return `r-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CommonsScreen() {
  const { resources, addResource, incrementDownload } = useCommonsStore();
  const addXp = useXpStore((s) => s.addXp);

  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<ResourceType>("Notes");
  const [formCourse, setFormCourse] = useState<string>("COMP 551");

  const filteredResources =
    activeFilter === "All"
      ? resources
      : resources.filter((r) => r.course === activeFilter);

  function handleOpenModal() {
    setFormTitle("");
    setFormType("Notes");
    setFormCourse("COMP 551");
    setModalVisible(true);
  }

  function handleUpload() {
    const trimmedTitle = formTitle.trim();
    if (!trimmedTitle) return;
    // Static accessor — not a hook, safe inside event handler (same pattern as study.tsx)
    const username = useAuthStore.getState().user?.username ?? "anonymous";
    addResource({
      id: generateId(),
      title: trimmedTitle,
      type: formType,
      course: formCourse,
      uploaderName: username,
      downloadCount: 0,
    });
    // TODO: Replace with server-side award_xp Edge Function call (source: 'upload') before production
    addXp(10);
    setModalVisible(false);
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>The Commons</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handleOpenModal}>
          <Text style={styles.uploadButtonText}>+ Upload</Text>
        </TouchableOpacity>
      </View>

      {/* ── Course filter pills ─────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterBarContent}
      >
        {COURSES.map((course) => (
          <TouchableOpacity
            key={course}
            style={[styles.filterPill, activeFilter === course && styles.filterPillActive]}
            onPress={() => setActiveFilter(course)}
          >
            <Text style={[styles.filterPillText, activeFilter === course && styles.filterPillTextActive]}>
              {course}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Resource list ───────────────────────────────────────────────────── */}
      <ScrollView contentContainerStyle={styles.listContent}>

        {filteredResources.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No resources yet.</Text>
            <Text style={styles.emptyStateSubtext}>Tap "+ Upload" to share one.</Text>
          </View>
        )}

        {filteredResources.map((resource) => (
          <View key={resource.id} style={styles.card}>
            <View style={styles.cardBody}>
              <View style={[styles.typeBadge, { backgroundColor: TYPE_BADGE_COLORS[resource.type] }]}>
                <Text style={styles.typeBadgeText}>{resource.type}</Text>
              </View>
              <Text style={styles.cardTitle}>{resource.title}</Text>
              <Text style={styles.cardMeta}>by {resource.uploaderName} · {resource.course}</Text>
            </View>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => incrementDownload(resource.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.downloadIcon}>⬇</Text>
              <Text style={styles.downloadCount}>{resource.downloadCount}</Text>
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>

      {/* ── Upload modal ────────────────────────────────────────────────────── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Upload Resource</Text>

              <Text style={styles.fieldLabel}>TITLE *</Text>
              <TextInput
                style={styles.textInput}
                value={formTitle}
                onChangeText={setFormTitle}
                placeholder="e.g. COMP 551 Midterm W2025"
                placeholderTextColor="#6b7280"
                returnKeyType="done"
              />

              <Text style={styles.fieldLabel}>TYPE</Text>
              <View style={styles.chipRow}>
                {RESOURCE_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.chip,
                      formType === t && { backgroundColor: TYPE_BADGE_COLORS[t], borderColor: TYPE_BADGE_COLORS[t] },
                    ]}
                    onPress={() => setFormType(t)}
                  >
                    <Text style={[styles.chipText, formType === t && styles.chipTextSelected]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>COURSE</Text>
              <View style={styles.chipRow}>
                {DEMO_COURSES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.chip, formCourse === c && styles.chipCourseSelected]}
                    onPress={() => setFormCourse(c)}
                  >
                    <Text style={[styles.chipText, formCourse === c && styles.chipTextSelected]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitButton, !formTitle.trim() && styles.submitButtonDisabled]}
                  onPress={handleUpload}
                  disabled={!formTitle.trim()}
                >
                  <Text style={styles.submitButtonText}>Upload</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:            { flex: 1, backgroundColor: "#0f0f23" },

  headerRow:            { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 20, marginBottom: 16 },
  screenTitle:          { fontSize: 26, fontWeight: "800", color: "#ffffff" },
  uploadButton:         { backgroundColor: "#7c3aed", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  uploadButtonText:     { fontSize: 14, fontWeight: "700", color: "#ffffff" },

  filterBar:            { flexGrow: 0, height: 44, marginBottom: 12 },
  filterBarContent:     { paddingHorizontal: 20, gap: 8 },
  filterPill:           { borderRadius: 20, borderWidth: 1.5, borderColor: "#3d3d5e", paddingVertical: 6, paddingHorizontal: 14 },
  filterPillActive:     { backgroundColor: "#7c3aed", borderColor: "#7c3aed" },
  filterPillText:       { fontSize: 13, fontWeight: "600", color: "#9ca3af" },
  filterPillTextActive: { color: "#ffffff" },

  listContent:          { paddingHorizontal: 20, paddingBottom: 48 },
  emptyState:           { alignItems: "center", marginTop: 80 },
  emptyStateText:       { fontSize: 18, fontWeight: "700", color: "#9ca3af" },
  emptyStateSubtext:    { fontSize: 14, color: "#6b7280", marginTop: 8, textAlign: "center" },

  card:                 { backgroundColor: "#1e1e3a", borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: "#2d2d4e", flexDirection: "row", alignItems: "center", padding: 14 },
  cardBody:             { flex: 1, marginRight: 12 },
  typeBadge:            { alignSelf: "flex-start", borderRadius: 6, paddingVertical: 2, paddingHorizontal: 8, marginBottom: 6 },
  typeBadgeText:        { fontSize: 10, fontWeight: "700", color: "#ffffff", letterSpacing: 0.5 },
  cardTitle:            { fontSize: 15, fontWeight: "700", color: "#ffffff", marginBottom: 4, lineHeight: 20 },
  cardMeta:             { fontSize: 12, color: "#6b7280" },

  downloadButton:       { alignItems: "center", justifyContent: "center", minWidth: 44, minHeight: 44 },
  downloadIcon:         { fontSize: 20, color: "#7c3aed", marginBottom: 2 },
  downloadCount:        { fontSize: 12, fontWeight: "700", color: "#a78bfa" },

  modalOverlay:         { flex: 1, backgroundColor: "rgba(0,0,0,0.85)", justifyContent: "center" },
  modalCard:            { backgroundColor: "#1e1e3a", borderRadius: 20, margin: 24, padding: 28 },
  modalTitle:           { fontSize: 22, fontWeight: "800", color: "#ffffff", marginBottom: 20 },
  fieldLabel:           { fontSize: 10, fontWeight: "700", color: "#6b7280", letterSpacing: 1.5, marginBottom: 8, marginTop: 16 },
  textInput:            { backgroundColor: "#2d2d4e", borderRadius: 10, padding: 12, fontSize: 15, color: "#ffffff", borderWidth: 1, borderColor: "#3d3d5e" },

  chipRow:              { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip:                 { borderRadius: 8, borderWidth: 1.5, borderColor: "#3d3d5e", paddingVertical: 6, paddingHorizontal: 12 },
  chipCourseSelected:   { backgroundColor: "#7c3aed", borderColor: "#7c3aed" },
  chipText:             { fontSize: 13, fontWeight: "600", color: "#9ca3af" },
  chipTextSelected:     { color: "#ffffff" },

  modalButtons:         { flexDirection: "row", gap: 12, marginTop: 28 },
  cancelButton:         { flex: 1, backgroundColor: "#374151", borderRadius: 12, padding: 14, alignItems: "center" },
  cancelButtonText:     { fontSize: 15, fontWeight: "700", color: "#9ca3af" },
  submitButton:         { flex: 1, backgroundColor: "#7c3aed", borderRadius: 12, padding: 14, alignItems: "center" },
  submitButtonDisabled: { opacity: 0.4 },
  submitButtonText:     { fontSize: 15, fontWeight: "700", color: "#ffffff" },
});
