import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import type { Course } from "../store/useCourseStore";

// ─── Channel IDs ──────────────────────────────────────────────────────────────

const CHANNEL_EXAMS  = "exam-countdowns";
const CHANNEL_STREAK = "streak-reminders";
const CHANNEL_STUDY  = "study-reminders";

// ─── Notification identifiers ─────────────────────────────────────────────────

const ID_PREFIX_EXAM  = "exam-countdown-";
const ID_DAILY_STREAK = "daily-streak-risk";
const ID_DAILY_STUDY  = "daily-study-reminder";

// ─── Foreground handler (call at module level in _layout.tsx) ─────────────────

export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// ─── Android channels ─────────────────────────────────────────────────────────

async function setupAndroidChannels(): Promise<void> {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(CHANNEL_EXAMS, {
    name: "Exam Countdown",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#9B6DFF",
  });
  await Notifications.setNotificationChannelAsync(CHANNEL_STREAK, {
    name: "Streak Reminders",
    importance: Notifications.AndroidImportance.DEFAULT,
    lightColor: "#F5C842",
  });
  await Notifications.setNotificationChannelAsync(CHANNEL_STUDY, {
    name: "Study Reminders",
    importance: Notifications.AndroidImportance.DEFAULT,
    lightColor: "#9B6DFF",
  });
}

// ─── Permissions ──────────────────────────────────────────────────────────────

export async function requestPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });
  return status === "granted";
}

// ─── Exam countdowns ──────────────────────────────────────────────────────────

export async function scheduleExamCountdowns(courses: Course[]): Promise<void> {
  await setupAndroidChannels();

  // Cancel previously scheduled exam countdown notifications
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.identifier.startsWith(ID_PREFIX_EXAM))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );

  const now = Date.now();

  for (const course of courses) {
    for (const exam of course.exams) {
      if (exam.defeated) continue;

      const examMs = new Date(exam.examDate).getTime();

      for (const daysAhead of [7, 3, 1]) {
        const triggerDate = new Date(examMs - daysAhead * 86_400_000);
        triggerDate.setHours(9, 0, 0, 0);
        if (triggerDate.getTime() <= now) continue;

        const dayLabel = daysAhead === 1 ? "tomorrow" : `in ${daysAhead} days`;
        const body =
          daysAhead === 1
            ? "It's crunch time."
            : daysAhead === 3
            ? "Are you ready?"
            : "Let's get cracking.";

        await Notifications.scheduleNotificationAsync({
          identifier: `${ID_PREFIX_EXAM}${exam.id}-${daysAhead}d`,
          content: {
            title: `${course.code} ${exam.name} is ${dayLabel}`,
            body,
            data: { examId: exam.id, courseId: course.id },
          },
          trigger: {
            type: SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
            channelId: CHANNEL_EXAMS,
          },
        });
      }
    }
  }
}

// ─── Daily reminders ──────────────────────────────────────────────────────────

export async function scheduleDailyReminders(): Promise<void> {
  await setupAndroidChannels();

  // Cancel existing daily reminders before re-scheduling
  await Notifications.cancelScheduledNotificationAsync(ID_DAILY_STREAK).catch(() => {});
  await Notifications.cancelScheduledNotificationAsync(ID_DAILY_STUDY).catch(() => {});

  // Streak-at-risk reminder: 8:00 PM daily
  await Notifications.scheduleNotificationAsync({
    identifier: ID_DAILY_STREAK,
    content: {
      title: "Your streak is at risk! 🔥",
      body: "You haven't studied today. Log a session to keep your streak alive.",
      data: { type: "streak" },
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
      channelId: CHANNEL_STREAK,
    },
  });

  // Study session reminder: 7:00 PM daily
  await Notifications.scheduleNotificationAsync({
    identifier: ID_DAILY_STUDY,
    content: {
      title: "Time to get cracked 📚",
      body: "Open the app and start a study session. Your exams won't beat themselves.",
      data: { type: "study" },
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DAILY,
      hour: 19,
      minute: 0,
      channelId: CHANNEL_STUDY,
    },
  });
}

// ─── Cancel all ───────────────────────────────────────────────────────────────

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
