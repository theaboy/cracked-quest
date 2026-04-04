import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Survey } from "../../lib/mockChatData";

interface ActiveSurveyBannerProps {
  survey: Survey | undefined;
  onPress: () => void;
}

export default function ActiveSurveyBanner({
  survey,
  onPress,
}: ActiveSurveyBannerProps) {
  if (!survey) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>
        {"\ud83d\udcca"} Active poll: {survey.totalVotes} votes — tap to see
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    borderBottomWidth: 1,
    borderBottomColor: "#2E2E3E",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  text: {
    color: "#B99BFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
