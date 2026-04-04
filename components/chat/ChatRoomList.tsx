import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useChatStore } from "../../store/useChatStore";

export default function ChatRoomList() {
  const router = useRouter();
  const rooms = useChatStore((s) => s.rooms);
  const markRoomRead = useChatStore((s) => s.markRoomRead);
  const [refreshing, setRefreshing] = useState(false);

  const classRooms = rooms.filter((r) => r.type === "class");
  const deptRooms = rooms.filter((r) => r.type === "department");

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800); // fake refresh
  }, []);

  function handleRoomPress(roomId: string) {
    markRoomRead(roomId);
    router.push(`/chat/${roomId}` as any);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#8B5CF6"
        />
      }
    >
      {/* Class Chats Section */}
      <Text style={styles.sectionHeader}>YOUR CLASSES</Text>
      {classRooms.map((room) => (
        <TouchableOpacity
          key={room.id}
          style={styles.roomRow}
          onPress={() => handleRoomPress(room.id)}
          activeOpacity={0.7}
        >
          {/* Avatar circle */}
          <View style={[styles.avatar, { backgroundColor: room.color }]}>
            <Text style={styles.avatarText}>{room.name.charAt(0)}</Text>
          </View>

          {/* Room info */}
          <View style={styles.roomInfo}>
            <Text style={styles.roomName}>{room.name}</Text>
            <Text style={styles.roomSubtitle}>{room.subtitle}</Text>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {room.lastMessage}
            </Text>
          </View>

          {/* Right side: time + unread */}
          <View style={styles.roomMeta}>
            <Text style={styles.timeText}>{room.lastMessageTime}</Text>
            {room.unreadCount > 0 && <View style={styles.unreadDot} />}
          </View>
        </TouchableOpacity>
      ))}

      {/* Department Chats Section */}
      <Text style={[styles.sectionHeader, { marginTop: 24 }]}>DEPARTMENTS</Text>
      {deptRooms.map((room) => (
        <TouchableOpacity
          key={room.id}
          style={styles.roomRow}
          onPress={() => handleRoomPress(room.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.avatar, { backgroundColor: room.color }]}>
            <Text style={styles.avatarText}>{room.name.charAt(0)}</Text>
          </View>
          <View style={styles.roomInfo}>
            <Text style={styles.roomName}>{room.name}</Text>
            <Text style={styles.roomSubtitle}>{room.subtitle}</Text>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {room.lastMessage}
            </Text>
          </View>
          <View style={styles.roomMeta}>
            <Text style={styles.timeText}>{room.lastMessageTime}</Text>
            {room.unreadCount > 0 && <View style={styles.unreadDot} />}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9896AA",
    letterSpacing: 1.5,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  roomRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#2E2E3E",
    minHeight: 72,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  roomInfo: {
    flex: 1,
    marginRight: 12,
  },
  roomName: {
    color: "#F0EFF8",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  roomSubtitle: {
    color: "#9896AA",
    fontSize: 12,
    marginBottom: 3,
  },
  lastMessage: {
    color: "#5C5B6E",
    fontSize: 13,
  },
  roomMeta: {
    alignItems: "flex-end",
    gap: 6,
  },
  timeText: {
    color: "#5C5B6E",
    fontSize: 11,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8B5CF6",
  },
});
