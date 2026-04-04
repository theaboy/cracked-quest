import { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Survey } from "../../lib/mockChatData";

interface SurveyCardProps {
  survey: Survey;
  onVote: (surveyId: string, optionId: string) => void;
}

export default function SurveyCard({ survey, onVote }: SurveyCardProps) {
  const barWidths = useRef(
    survey.options.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (survey.userVote) {
      survey.options.forEach((opt, i) => {
        const pct =
          survey.totalVotes > 0
            ? (opt.votes / survey.totalVotes) * 100
            : 0;
        Animated.timing(barWidths[i], {
          toValue: pct,
          duration: 600,
          delay: i * 100,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [survey.userVote]);

  const hasVoted = survey.userVote !== null;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{"📊 Poll"}</Text>
        </View>
        <Text style={styles.creatorText}>by {survey.creatorName}</Text>
      </View>

      {/* Question */}
      <Text style={styles.question}>{survey.question}</Text>

      {/* Options */}
      {survey.options.map((option, index) => {
        if (!hasVoted) {
          return (
            <TouchableOpacity
              key={option.id}
              style={styles.optionButton}
              onPress={() => onVote(survey.id, option.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          );
        }

        const pct =
          survey.totalVotes > 0
            ? Math.round((option.votes / survey.totalVotes) * 100)
            : 0;
        const isUserVote = survey.userVote === option.id;
        const animatedWidth = barWidths[index].interpolate({
          inputRange: [0, 100],
          outputRange: ["0%", "100%"],
        });

        return (
          <View key={option.id} style={styles.resultOption}>
            <Animated.View
              style={[
                styles.resultBar,
                {
                  width: animatedWidth,
                  backgroundColor: isUserVote
                    ? "rgba(139, 92, 246, 0.25)"
                    : "rgba(255, 255, 255, 0.05)",
                },
              ]}
            />
            <View style={styles.resultContent}>
              <Text style={styles.optionText}>{option.text}</Text>
              <Text style={styles.percentText}>{pct}%</Text>
            </View>
            <Text style={styles.voteCount}>
              {option.votes} {option.votes === 1 ? "vote" : "votes"}
            </Text>
          </View>
        );
      })}

      {/* Footer */}
      <Text style={styles.footer}>
        {survey.totalVotes} {survey.totalVotes === 1 ? "vote" : "votes"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(139, 92, 246, 0.08)",
    borderWidth: 1,
    borderColor: "#2E2E3E",
    borderRadius: 14,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    backgroundColor: "#8B5CF6",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  creatorText: {
    color: "#9896AA",
    fontSize: 12,
  },
  question: {
    color: "#F0EFF8",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 14,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "#2E2E3E",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  optionText: {
    color: "#F0EFF8",
    fontSize: 14,
  },
  resultOption: {
    borderWidth: 1,
    borderColor: "#2E2E3E",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    overflow: "hidden",
  },
  resultBar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 10,
  },
  resultContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  percentText: {
    color: "#F0EFF8",
    fontSize: 14,
    fontWeight: "600",
  },
  voteCount: {
    color: "#9896AA",
    fontSize: 11,
    marginTop: 4,
  },
  footer: {
    color: "#9896AA",
    fontSize: 12,
    marginTop: 8,
  },
});
