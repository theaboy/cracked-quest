import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../lib/theme";

type IoniconsName = keyof typeof Ionicons.glyphMap;

const TAB_CONFIG: Record<
  string,
  { label: string; icon: IoniconsName; activeIcon: IoniconsName }
> = {
  index: { label: "MAP", icon: "map-outline", activeIcon: "map" },
  study: { label: "STUDY", icon: "timer-outline", activeIcon: "timer" },
  quests: { label: "QUESTS", icon: "flag-outline", activeIcon: "flag" },
  commons: { label: "COMMUNITY", icon: "chatbubbles-outline", activeIcon: "chatbubbles" },
  profile: { label: "RANK", icon: "trophy-outline", activeIcon: "trophy" },
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      {Object.entries(TAB_CONFIG).map(([name, config]) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            tabBarIcon: ({ focused }) => {
              const iconName = focused ? config.activeIcon : config.icon;
              const iconColor = focused ? colors.primaryLight : colors.text3;

              if (focused) {
                return (
                  <View style={styles.pill}>
                    <Ionicons name={iconName} size={20} color={iconColor} />
                    <Text style={styles.pillLabel}>{config.label}</Text>
                  </View>
                );
              }

              return (
                <Ionicons name={iconName} size={22} color={iconColor} />
              );
            },
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 70,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(155,109,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillLabel: {
    color: colors.primaryLight,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginLeft: 6,
  },
});
