import { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";

export default function RootLayout() {
  const user = useAuthStore((s) => s.user);
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      setTimeout(() => {
        router.replace("/(auth)");
      }, 0);
    } else if (user && inAuthGroup) {
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 0);
    }
  }, [user, segments, isReady]);

  return <Slot />;
}
