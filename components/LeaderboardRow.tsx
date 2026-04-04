import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../lib/theme";

interface LeaderboardRowProps {
  rank: number;
  username: string;
  xp: number;
  tier: string;
  isCurrentUser: boolean;
}

export function LeaderboardRow({
  rank,
  username,
  xp,
  tier,
  isCurrentUser,
}: LeaderboardRowProps) {
  const content = (
    <>
      <Text
        style={[
          styles.rank,
          rank === 1 && styles.rankGold,
          isCurrentUser && styles.rankCurrentUser,
        ]}
      >
        {rank}
      </Text>
      <Text
        style={[
          styles.username,
          isCurrentUser && styles.usernameCurrentUser,
        ]}
      >
        {username}
        {isCurrentUser ? " ⭐" : ""}
      </Text>
      <Text
        style={[
          styles.tier,
          isCurrentUser && styles.tierCurrentUser,
        ]}
      >
        {tier}
      </Text>
      <Text style={styles.xp}>{xp.toLocaleString()} XP</Text>
    </>
  );

  if (isCurrentUser) {
    return (
      <LinearGradient
        colors={[
          "rgba(245,200,66,0.2)",
          "rgba(155,109,255,0.25)",
          "rgba(107,63,212,0.2)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.row, styles.rowCurrentUser]}
      >
        {content}
      </LinearGradient>
    );
  }

  return <View style={[styles.row, styles.rowDefault]}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 6,
  },
  rowDefault: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowCurrentUser: {
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
  },
  rank: {
    fontWeight: "800",
    fontSize: 14,
    width: 28,
    color: colors.text2,
  },
  rankGold: {
    color: colors.gold,
  },
  rankCurrentUser: {
    color: colors.gold,
  },
  username: {
    color: colors.text1,
    fontWeight: "600",
    fontSize: 14,
    flex: 1,
  },
  usernameCurrentUser: {
    fontWeight: "700",
  },
  tier: {
    color: colors.text2,
    fontSize: 12,
    marginRight: 8,
  },
  tierCurrentUser: {
    color: colors.primaryLight,
  },
  xp: {
    color: colors.gold,
    fontWeight: "700",
    fontSize: 13,
  },
});
