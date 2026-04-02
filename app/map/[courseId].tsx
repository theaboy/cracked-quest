import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function CourseMapScreen() {
  const { courseId } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>3D Map for Course: {courseId}</Text>
    </View>
  );
}
