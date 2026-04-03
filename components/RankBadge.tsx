import { View, Text, StyleSheet } from "react-native";
import { colors } from "../lib/theme";
import { type TierInfo } from "../lib/xpUtils";

interface RankBadgeProps {
  tier: TierInfo;
  variant: "pill" | "shield";
}

export function RankBadge({ tier, variant }: RankBadgeProps) {
  if (variant === "pill") {
    return (
      <View style={[styles.pill, { borderColor: tier.color }]}>
        <Text style={styles.pillIcon}>{tier.icon}</Text>
        <Text style={[styles.pillName, { color: tier.color }]}>{tier.name.toUpperCase()}</Text>
      </View>
    );
  }

  return (
    <View style={styles.shieldContainer}>
      <View style={styles.shieldTop}>
        <Text style={styles.shieldIcon}>{tier.icon}</Text>
      </View>
      <View style={styles.shieldPoint} />
      <Text style={styles.shieldName}>{tier.name.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // -- Pill variant --
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surface2,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 50,
    borderWidth: 1.5,
  },
  pillIcon: {
    fontSize: 14,
  },
  pillName: {
    fontWeight: "700",
    fontSize: 11,
    letterSpacing: 1,
  },

  // -- Shield variant --
  shieldContainer: {
    alignItems: "center",
  },
  shieldTop: {
    width: 72,
    height: 62,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  shieldIcon: {
    fontSize: 28,
  },
  shieldPoint: {
    width: 0,
    height: 0,
    borderLeftWidth: 36,
    borderRightWidth: 36,
    borderBottomWidth: 18,
    borderLeftColor: colors.primary,
    borderRightColor: colors.primary,
    borderBottomColor: "transparent",
  },
  shieldName: {
    color: colors.text1,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1.5,
    marginTop: 6,
  },
});
