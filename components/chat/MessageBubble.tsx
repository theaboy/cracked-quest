import { View, Text, StyleSheet } from "react-native";
import { ChatMessage } from "../../lib/mockChatData";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

function getAvatarColor(name: string): string {
  const colors = [
    "#6C5CE7",
    "#00B894",
    "#E17055",
    "#0984E3",
    "#FDCB6E",
    "#A29BFE",
    "#55EFC4",
    "#FF7675",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const isSurvey = message.type === "survey";

  if (isOwn) {
    return (
      <View style={styles.ownRow}>
        <View style={styles.ownBubble}>
          <Text style={styles.ownText}>
            {isSurvey ? "[Survey]" : message.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>{message.timestamp}</Text>
      </View>
    );
  }

  return (
    <View style={styles.otherRow}>
      <View style={styles.avatarColumn}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: getAvatarColor(message.senderName) },
          ]}
        >
          <Text style={styles.avatarText}>
            {getInitials(message.senderName)}
          </Text>
        </View>
      </View>
      <View style={styles.otherContent}>
        <Text style={styles.senderName}>{message.senderName}</Text>
        <View style={styles.otherBubble}>
          <Text style={styles.otherText}>
            {isSurvey ? "[Survey]" : message.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>{message.timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Own message (right-aligned)
  ownRow: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
  ownBubble: {
    backgroundColor: "#8B5CF6",
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "75%",
  },
  ownText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 20,
  },

  // Other message (left-aligned)
  otherRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  avatarColumn: {
    marginRight: 8,
    marginTop: 18, // align with bubble, below sender name
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  otherContent: {
    flex: 1,
    maxWidth: "75%",
  },
  senderName: {
    color: "#9896AA",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  otherBubble: {
    backgroundColor: "#1C1C22",
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  otherText: {
    color: "#F0EFF8",
    fontSize: 15,
    lineHeight: 20,
  },

  // Shared
  timestamp: {
    color: "#5C5B6E",
    fontSize: 10,
    marginTop: 4,
  },
});
