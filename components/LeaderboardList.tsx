import { View, Text, ScrollView, StyleSheet } from "react-native";
import { colors } from "../lib/theme";
import { DEMO_LEADERBOARD } from "../lib/mockData";
import { LeaderboardRow } from "./LeaderboardRow";
import { ProgressiveBlur } from "./ProgressiveBlur";

interface LeaderboardListProps {
  currentUsername: string;
}

export function LeaderboardList({ currentUsername }: LeaderboardListProps) {
  const sorted = [...DEMO_LEADERBOARD].sort((a, b) => b.xp - a.xp);

  const currentUserEntry = sorted.find(
    (entry) => entry.username === currentUsername
  );
  const currentUserRank = currentUserEntry
    ? sorted.indexOf(currentUserEntry) + 1
    : null;

  return (
    <View>
      <Text style={styles.sectionLabel}>LEADERBOARD</Text>

      <View style={styles.scrollWrapper}>
        <ScrollView
          style={styles.scrollArea}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        >
          {sorted.map((entry, index) => (
            <LeaderboardRow
              key={entry.username}
              rank={index + 1}
              username={entry.username}
              xp={entry.xp}
              tier={entry.tier}
              isCurrentUser={entry.username === currentUsername}
            />
          ))}
        </ScrollView>
        <ProgressiveBlur height={70} position="bottom" />
      </View>

      {currentUserEntry && currentUserRank && (
        <View style={styles.pinnedContainer}>
          <LeaderboardRow
            rank={currentUserRank}
            username={currentUserEntry.username}
            xp={currentUserEntry.xp}
            tier={currentUserEntry.tier}
            isCurrentUser={true}
          />
          <Text style={styles.pinnedLabel}>Your position</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text3,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  scrollWrapper: {
    height: 340,
  },
  scrollArea: {
    maxHeight: 340,
  },
  pinnedContainer: {
    marginTop: 8,
  },
  pinnedLabel: {
    fontSize: 10,
    color: colors.text3,
    textAlign: "center",
    marginTop: -2,
  },
});
