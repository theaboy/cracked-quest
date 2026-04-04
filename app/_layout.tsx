import { useEffect, useRef, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";
import { useCourseStore } from "../store/useCourseStore";
import * as Notifications from "expo-notifications";
import {
  configureNotificationHandler,
  scheduleDailyReminders,
  scheduleExamCountdowns,
  scheduleExamEveNotifications,
} from "../lib/notifications";

// Configure foreground notification behavior at module load time
configureNotificationHandler();

export default function RootLayout() {
  const user = useAuthStore((s) => s.user);
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const hasInitializedNotifs = useRef(false);

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

  // Initialize notifications once after user session is established
  useEffect(() => {
    if (!user || hasInitializedNotifs.current) return;
    hasInitializedNotifs.current = true;

    const init = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") return;

      await scheduleDailyReminders();
      // Read courses fresh to avoid stale closure; skip if not yet loaded
      const courses = useCourseStore.getState().courses;
      if (courses.length > 0) {
        await scheduleExamCountdowns(courses);
        await scheduleExamEveNotifications(courses);
      }
    };

    init().catch((err) => console.warn("[notifications] init failed:", err));
  }, [user]);

  return <Slot />;
}
