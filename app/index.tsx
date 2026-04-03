import { Redirect } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";

export default function Index() {
  const user = useAuthStore((s) => s.user);

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)" />;
}
