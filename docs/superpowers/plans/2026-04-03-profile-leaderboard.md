# Profile & Leaderboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the Profile tab with an avatar, streak card, and global leaderboard with highlighted current user.

**Architecture:** Four new components (`ProfileAvatar`, `StreakCard`, `LeaderboardRow`, `LeaderboardList`) composed into the existing profile screen below the XP section from issue #4. Current user's leaderboard row uses a gold-to-purple gradient via `expo-linear-gradient`.

**Tech Stack:** React Native, Expo, expo-linear-gradient, Zustand, TypeScript, StyleSheet.create()

**Spec:** `docs/superpowers/specs/2026-04-03-profile-leaderboard-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `components/ProfileAvatar.tsx` | Create | Crack mascot in circular container |
| `components/StreakCard.tsx` | Create | Flame icon, current streak, best streak |
| `components/LeaderboardRow.tsx` | Create | Single leaderboard row with gradient for current user |
| `components/LeaderboardList.tsx` | Create | Section header, ranked rows, pinned user row |
| `app/(tabs)/profile.tsx` | Modify | Add avatar, streak card, leaderboard below existing XP section |

---

### Task 1: Install expo-linear-gradient

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

```bash
cd /Users/bird/cracked-quest && npx expo install expo-linear-gradient
```

- [ ] **Step 2: Verify it installed**

```bash
grep "expo-linear-gradient" package.json
```

Expected: A line showing `"expo-linear-gradient"` in dependencies.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add expo-linear-gradient for leaderboard user highlight"
```

---

### Task 2: Create `components/ProfileAvatar.tsx`

**Files:**
- Create: `components/ProfileAvatar.tsx`

- [ ] **Step 1: Create the avatar component**

```typescript
// components/ProfileAvatar.tsx

import { View, Image, StyleSheet } from "react-native";
import { colors } from "../lib/theme";

interface ProfileAvatarProps {
  size?: number;
}

export function ProfileAvatar({ size = 80 }: ProfileAvatarProps) {
  const borderRadius = size / 2;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
        },
      ]}
    >
      <Image
        source={require("../assets/crack-mascot.png")}
        style={{
          width: size - 6,
          height: size - 6,
          borderRadius: (size - 6) / 2,
        }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2.5,
    borderColor: colors.primary,
    backgroundColor: colors.surface2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/ProfileAvatar.tsx
git commit -m "feat(profile): add ProfileAvatar component with Crack mascot"
```

---

### Task 3: Create `components/StreakCard.tsx`

**Files:**
- Create: `components/StreakCard.tsx`

- [ ] **Step 1: Create the streak card component**

```typescript
// components/StreakCard.tsx

import { View, Text, Image, StyleSheet } from "react-native";
import { colors } from "../lib/theme";
import { useXpStore } from "../store/useXpStore";

const BEST_STREAK = 12; // Hardcoded for demo — not tracked in store yet

export function StreakCard() {
  const streakDays = useXpStore((s) => s.streakDays);

  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <Image
          source={require("../assets/streak-flame.png")}
          style={styles.flameIcon}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.streakCount}>{streakDays}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.bestLabel}>BEST</Text>
        <Text style={styles.bestValue}>{BEST_STREAK} days</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  flameIcon: {
    width: 28,
    height: 28,
  },
  streakCount: {
    color: colors.gold,
    fontWeight: "900",
    fontSize: 24,
  },
  streakLabel: {
    color: colors.text2,
    fontSize: 12,
    fontWeight: "600",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  bestLabel: {
    color: colors.text3,
    fontSize: 11,
    fontWeight: "600",
  },
  bestValue: {
    color: colors.text2,
    fontWeight: "700",
    fontSize: 16,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/StreakCard.tsx
git commit -m "feat(profile): add StreakCard component with custom flame icon"
```

---

### Task 4: Create `components/LeaderboardRow.tsx`

**Files:**
- Create: `components/LeaderboardRow.tsx`

- [ ] **Step 1: Create the leaderboard row component**

```typescript
// components/LeaderboardRow.tsx

import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../lib/theme";

interface LeaderboardRowProps {
  rank: number;
  username: string;
  xp: number;
  tier: string;
  isCurrentUser: boolean;
}

export function LeaderboardRow({
  rank,
  username,
  xp,
  tier,
  isCurrentUser,
}: LeaderboardRowProps) {
  const content = (
    <>
      <Text
        style={[
          styles.rank,
          rank === 1 && styles.rankGold,
          isCurrentUser && styles.rankCurrentUser,
        ]}
      >
        {rank}
      </Text>
      <Text
        style={[
          styles.username,
          isCurrentUser && styles.usernameCurrentUser,
        ]}
      >
        {username}
        {isCurrentUser ? " ⭐" : ""}
      </Text>
      <Text
        style={[
          styles.tier,
          isCurrentUser && styles.tierCurrentUser,
        ]}
      >
        {tier}
      </Text>
      <Text style={styles.xp}>{xp.toLocaleString()} XP</Text>
    </>
  );

  if (isCurrentUser) {
    return (
      <LinearGradient
        colors={[
          "rgba(245,200,66,0.2)",
          "rgba(155,109,255,0.25)",
          "rgba(107,63,212,0.2)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.row, styles.rowCurrentUser]}
      >
        {content}
      </LinearGradient>
    );
  }

  return <View style={[styles.row, styles.rowDefault]}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 6,
  },
  rowDefault: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowCurrentUser: {
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
  },
  rank: {
    fontWeight: "800",
    fontSize: 14,
    width: 28,
    color: colors.text2,
  },
  rankGold: {
    color: colors.gold,
  },
  rankCurrentUser: {
    color: colors.gold,
  },
  username: {
    color: colors.text1,
    fontWeight: "600",
    fontSize: 14,
    flex: 1,
  },
  usernameCurrentUser: {
    fontWeight: "700",
  },
  tier: {
    color: colors.text2,
    fontSize: 12,
    marginRight: 8,
  },
  tierCurrentUser: {
    color: colors.primaryLight,
  },
  xp: {
    color: colors.gold,
    fontWeight: "700",
    fontSize: 13,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/LeaderboardRow.tsx
git commit -m "feat(profile): add LeaderboardRow with gold-to-purple gradient for current user"
```

---

### Task 5: Create `components/LeaderboardList.tsx`

**Files:**
- Create: `components/LeaderboardList.tsx`

- [ ] **Step 1: Create the leaderboard list component**

```typescript
// components/LeaderboardList.tsx

import { View, Text, StyleSheet } from "react-native";
import { colors } from "../lib/theme";
import { DEMO_LEADERBOARD } from "../lib/mockData";
import { LeaderboardRow } from "./LeaderboardRow";

interface LeaderboardListProps {
  currentUsername: string;
}

export function LeaderboardList({ currentUsername }: LeaderboardListProps) {
  const sorted = [...DEMO_LEADERBOARD].sort((a, b) => b.xp - a.xp);

  const currentUserEntry = sorted.find(
    (entry) => entry.username === currentUsername
  );
  const currentUserRank = currentUserEntry
    ? sorted.indexOf(currentUserEntry) + 1
    : null;

  return (
    <View>
      <Text style={styles.sectionLabel}>LEADERBOARD</Text>

      {sorted.map((entry, index) => (
        <LeaderboardRow
          key={entry.username}
          rank={index + 1}
          username={entry.username}
          xp={entry.xp}
          tier={entry.tier}
          isCurrentUser={entry.username === currentUsername}
        />
      ))}

      {currentUserEntry && currentUserRank && (
        <View style={styles.pinnedContainer}>
          <LeaderboardRow
            rank={currentUserRank}
            username={currentUserEntry.username}
            xp={currentUserEntry.xp}
            tier={currentUserEntry.tier}
            isCurrentUser={true}
          />
          <Text style={styles.pinnedLabel}>Your position</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text3,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  pinnedContainer: {
    marginTop: 8,
  },
  pinnedLabel: {
    fontSize: 10,
    color: colors.text3,
    textAlign: "center",
    marginTop: -2,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/LeaderboardList.tsx
git commit -m "feat(profile): add LeaderboardList with ranked rows and pinned user position"
```

---

### Task 6: Integrate into Profile tab (`app/(tabs)/profile.tsx`)

**Files:**
- Modify: `app/(tabs)/profile.tsx`

- [ ] **Step 1: Update profile.tsx with avatar, streak card, and leaderboard**

Replace the entire contents of `app/(tabs)/profile.tsx` with:

```typescript
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../lib/theme";
import { getCurrentTier } from "../../lib/xpUtils";
import { useAuthStore } from "../../store/useAuthStore";
import { useXpStore } from "../../store/useXpStore";
import { useXpAnimation } from "../../hooks/useXpAnimation";
import { XpProgressBar } from "../../components/XpProgressBar";
import { XpAnimatedCounter } from "../../components/XpAnimatedCounter";
import { RankBadge } from "../../components/RankBadge";
import { ProfileAvatar } from "../../components/ProfileAvatar";
import { StreakCard } from "../../components/StreakCard";
import { LeaderboardList } from "../../components/LeaderboardList";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const xpTotal = useXpStore((s) => s.xpTotal);
  const tier = getCurrentTier(xpTotal);
  const { animatedXp, displayXp } = useXpAnimation();

  const username = user?.username ?? "DemoStudent";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <ProfileAvatar size={80} />
        </View>

        {/* Username */}
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.university}>McGill University</Text>

        {/* Shield badge */}
        <View style={styles.badgeContainer}>
          <RankBadge tier={tier} variant="shield" />
        </View>

        {/* XP counter */}
        <View style={styles.counterContainer}>
          <XpAnimatedCounter displayXp={displayXp} size="full" />
        </View>

        {/* XP progress bar */}
        <View style={styles.barContainer}>
          <XpProgressBar animatedXp={animatedXp} size="full" />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Streak Card */}
        <View style={styles.streakContainer}>
          <StreakCard />
        </View>

        {/* Leaderboard */}
        <View style={styles.leaderboardContainer}>
          <LeaderboardList currentUsername={username} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingBottom: 48,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  username: {
    color: colors.text1,
    fontWeight: "800",
    fontSize: 22,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  university: {
    color: colors.text3,
    fontSize: 12,
    textAlign: "center",
  },
  badgeContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  counterContainer: {
    marginTop: 24,
  },
  barContainer: {
    marginTop: 12,
    paddingHorizontal: 32,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
    marginTop: 16,
  },
  streakContainer: {
    marginTop: 16,
    marginHorizontal: 20,
  },
  leaderboardContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Run the app and visually verify**

Run: `cd /Users/bird/cracked-quest && npx expo start`

Check:
- Profile tab shows: Crack mascot avatar at top, username, shield badge, XP counter + bar
- Below divider: streak card with custom flame icon, streak count
- Leaderboard with 5 rows, DemoStudent at #3 with gold-to-purple gradient
- Pinned "Your position" row at the bottom

- [ ] **Step 4: Commit**

```bash
git add app/\(tabs\)/profile.tsx
git commit -m "feat(profile): integrate avatar, streak card, and leaderboard into Profile tab"
```
