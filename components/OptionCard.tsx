import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, radii } from "../lib/theme";

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function OptionCard({ label, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: "rgba(155,109,255,0.1)",
  },
  label: {
    color: colors.text1,
    fontSize: 15,
    fontWeight: "500",
  },
  labelSelected: {
    color: colors.primaryLight,
  },
});
