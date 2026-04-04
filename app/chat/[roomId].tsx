import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useChatStore } from "../../store/useChatStore";
import { DEMO_CURRENT_USER } from "../../lib/mockChatData";
import MessageBubble from "../../components/chat/MessageBubble";
import ChatInput from "../../components/chat/ChatInput";
import SurveyCreator from "../../components/chat/SurveyCreator";
import ActiveSurveyBanner from "../../components/chat/ActiveSurveyBanner";

export default function ChatThreadScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [surveyModalVisible, setSurveyModalVisible] = useState(false);

  const rooms = useChatStore((s) => s.rooms);
  const messages = useChatStore((s) => s.messages);
  const addMessage = useChatStore((s) => s.addMessage);
  const addSurvey = useChatStore((s) => s.addSurvey);
  const surveys = useChatStore((s) => s.surveys);

  const room = rooms.find((r) => r.id === roomId);
  const roomMessages = roomId ? messages[roomId] ?? [] : [];
  const roomSurveys = surveys.filter((s) => s.roomId === roomId);
  const activeSurvey = roomSurveys.find((s) => s.userVote === null) ?? roomSurveys[roomSurveys.length - 1];

  // Auto-scroll to bottom on mount and when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, [roomMessages.length]);

  function handleSend(text: string) {
    if (!roomId) return;
    const newMessage = {
      id: `msg-${Date.now()}`,
      roomId,
      senderId: DEMO_CURRENT_USER.id,
      senderName: DEMO_CURRENT_USER.name,
      senderAvatar: DEMO_CURRENT_USER.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      type: "message" as const,
    };
    addMessage(roomId, newMessage);
  }

  function handleSurveyPress() {
    setSurveyModalVisible(true);
  }

  function handleSurveySubmit(question: string, options: string[]) {
    if (!roomId) return;
    const surveyId = `survey-${Date.now()}`;
    const messageId = `msg-${Date.now()}`;
    const surveyOptions = options.map((text, i) => ({
      id: `opt-${Date.now()}-${i}`,
      text,
      votes: 0,
    }));
    addSurvey(
      {
        id: surveyId,
        roomId: roomId as string,
        messageId,
        question,
        options: surveyOptions,
        totalVotes: 0,
        userVote: null,
        creatorName: DEMO_CURRENT_USER.name,
      },
      {
        id: messageId,
        roomId: roomId as string,
        senderId: DEMO_CURRENT_USER.id,
        senderName: DEMO_CURRENT_USER.name,
        senderAvatar: DEMO_CURRENT_USER.avatar,
        text: `\ud83d\udcca ${question}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
        type: "survey",
        surveyId,
      }
    );
    setSurveyModalVisible(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#F0EFF8" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{room?.name ?? "Chat"}</Text>
          {room && (
            <View style={styles.memberBadge}>
              <Ionicons name="people" size={12} color="#9896AA" />
              <Text style={styles.memberCount}>{room.memberCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Active Survey Banner */}
      <ActiveSurveyBanner
        survey={activeSurvey}
        onPress={() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }}
      />

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={
          roomMessages.length === 0
            ? styles.emptyContent
            : styles.messagesContent
        }
        keyboardShouldPersistTaps="handled"
      >
        {roomMessages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>{"👋"}</Text>
            <Text style={styles.emptyText}>Be the first to say hello</Text>
          </View>
        ) : (
          roomMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === DEMO_CURRENT_USER.id}
            />
          ))
        )}
      </ScrollView>

      {/* Input */}
      <ChatInput onSend={handleSend} onSurveyPress={handleSurveyPress} />

      {/* Survey Creator Modal */}
      <SurveyCreator
        visible={surveyModalVisible}
        onClose={() => setSurveyModalVisible(false)}
        onSubmit={handleSurveySubmit}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0C10",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 54,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#141418",
    borderBottomWidth: 1,
    borderBottomColor: "#2E2E3E",
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    color: "#F0EFF8",
    fontSize: 17,
    fontWeight: "700",
  },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 4,
  },
  memberCount: {
    color: "#9896AA",
    fontSize: 12,
  },
  headerSpacer: {
    width: 36,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: "#5C5B6E",
    fontSize: 16,
  },
});
