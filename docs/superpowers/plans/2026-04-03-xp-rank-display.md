# XP & Rank Display Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an animated XP progress bar and rank tier badge to the Map header and Profile tab.

**Architecture:** Composed small components — `lib/xpUtils.ts` (pure tier logic), `hooks/useXpAnimation.ts` (mount + gain animations), three UI components (`XpProgressBar`, `XpAnimatedCounter`, `RankBadge`). Map and Profile screens compose these differently.

**Tech Stack:** React Native Animated API, Zustand, TypeScript, StyleSheet.create()

**Spec:** `docs/superpowers/specs/2026-04-03-xp-rank-display-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `lib/xpUtils.ts` | Create | Tier thresholds, colors, icons, progress calculation |
| `store/useXpStore.ts` | Modify | Remove `rankTier`/`setRank`, keep XP mutations |
| `hooks/useXpAnimation.ts` | Create | Animated.Value driven by store, mount + gain animations |
| `components/XpProgressBar.tsx` | Create | Animated bar, compact/full variants, tier-colored |
| `components/XpAnimatedCounter.tsx` | Create | Tick-up number display, compact/full variants |
| `components/RankBadge.tsx` | Create | Pill or shield badge, tier icon + name |
| `app/(tabs)/index.tsx` | Modify | Add XP header row above map content |
| `app/(tabs)/profile.tsx` | Modify | Add shield badge, XP counter, progress bar |

---

### Task 1: Create `lib/xpUtils.ts`

**Files:**
- Create: `lib/xpUtils.ts`

- [ ] **Step 1: Create xpUtils with tier data and functions**

```typescript
// lib/xpUtils.ts

export type RankTier = "Student" | "Grinder" | "Scholar" | "Veteran" | "Elite" | "Legend";

export interface TierInfo {
  name: RankTier;
  threshold: number;
  color: string;
  icon: string;
}

export const RANK_TIERS: TierInfo[] = [
  { name: "Student",  threshold: 0,     color: "#9896AA", icon: "🎓" },
  { name: "Grinder",  threshold: 500,   color: "#9B6DFF", icon: "⚔" },
  { name: "Scholar",  threshold: 1500,  color: "#4EFFB4", icon: "📚" },
  { name: "Veteran",  threshold: 3500,  color: "#F5C842", icon: "🛡" },
  { name: "Elite",    threshold: 7000,  color: "#FF5757", icon: "👑" },
  { name: "Legend",    threshold: 12000, color: "#F5C842", icon: "⭐" },
];

export function getCurrentTier(xp: number): TierInfo {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (xp >= RANK_TIERS[i].threshold) {
      return RANK_TIERS[i];
    }
  }
  return RANK_TIERS[0];
}

export function getNextTier(xp: number): TierInfo | null {
  const current = getCurrentTier(xp);
  const currentIndex = RANK_TIERS.indexOf(current);
  if (currentIndex >= RANK_TIERS.length - 1) return null;
  return RANK_TIERS[currentIndex + 1];
}

export function getTierProgress(xp: number): number {
  const current = getCurrentTier(xp);
  const next = getNextTier(xp);
  if (!next) return 1;
  const range = next.threshold - current.threshold;
  const progress = xp - current.threshold;
  return Math.min(progress / range, 1);
}

export function getTierColor(xp: number): string {
  return getCurrentTier(xp).color;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors related to `lib/xpUtils.ts`

- [ ] **Step 3: Commit**

```bash
git add lib/xpUtils.ts
git commit -m "feat(xp): add xpUtils with tier thresholds, colors, and progress calc"
```

---

### Task 2: Update `useXpStore` — remove stored rankTier

**Files:**
- Modify: `store/useXpStore.ts`

- [ ] **Step 1: Remove rankTier and setRank from the store**

Replace the entire contents of `store/useXpStore.ts` with:

```typescript
import { create } from "zustand";

interface XpState {
  xpTotal: number;
  streakDays: number;
  setXp: (xp: number) => void;
  setStreak: (days: number) => void;
  addXp: (amount: number) => void;
}

export const useXpStore = create<XpState>((set) => ({
  xpTotal: 0,
  streakDays: 0,
  setXp: (xp) => set({ xpTotal: xp }),
  setStreak: (days) => set({ streakDays: days }),
  // TODO: Replace with server-side award_xp Edge Function call (source: 'quiz') before production
  addXp: (amount) => set((s) => ({ xpTotal: s.xpTotal + amount })),
}));
```

- [ ] **Step 2: Verify no other files import `rankTier` or `setRank`**

Run: `cd /Users/bird/cracked-quest && grep -r "rankTier\|setRank" --include="*.ts" --include="*.tsx" store/ app/ components/ hooks/ lib/`
Expected: Only the old store file should have matched (now removed). If any consumer references `rankTier` or `setRank`, update them to use `getCurrentTier(xpTotal)` from `lib/xpUtils.ts`.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add store/useXpStore.ts
git commit -m "refactor(xp): remove stored rankTier, tier now derived via xpUtils"
```

---

### Task 3: Create `hooks/useXpAnimation.ts`

**Files:**
- Create: `hooks/useXpAnimation.ts`

- [ ] **Step 1: Create the animation hook**

```typescript
// hooks/useXpAnimation.ts

import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { useXpStore } from "../store/useXpStore";

interface XpAnimationResult {
  animatedXp: Animated.Value;
  displayXp: number;
}

export function useXpAnimation(): XpAnimationResult {
  const xpTotal = useXpStore((s) => s.xpTotal);
  const animatedXp = useRef(new Animated.Value(0)).current;
  const prevXpRef = useRef<number | null>(null);
  const [displayXp, setDisplayXp] = useState(0);

  useEffect(() => {
    const listenerId = animatedXp.addListener(({ value }) => {
      setDisplayXp(Math.round(value));
    });
    return () => animatedXp.removeListener(listenerId);
  }, [animatedXp]);

  useEffect(() => {
    if (prevXpRef.current === null) {
      // Mount: animate from 0 → current
      animatedXp.setValue(0);
      Animated.timing(animatedXp, {
        toValue: xpTotal,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else if (prevXpRef.current !== xpTotal) {
      // Gain: animate from previous → new
      Animated.timing(animatedXp, {
        toValue: xpTotal,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
    prevXpRef.current = xpTotal;
  }, [xpTotal, animatedXp]);

  return { animatedXp, displayXp };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors related to `hooks/useXpAnimation.ts`

- [ ] **Step 3: Commit**

```bash
git add hooks/useXpAnimation.ts
git commit -m "feat(xp): add useXpAnimation hook for mount and gain animations"
```

---

### Task 4: Create `components/XpProgressBar.tsx`

**Files:**
- Create: `components/XpProgressBar.tsx`

- [ ] **Step 1: Create the XP progress bar component**

```typescript
// components/XpProgressBar.tsx

import { View, Text, Animated, StyleSheet } from "react-native";
import { colors } from "../lib/theme";
import { getCurrentTier, getNextTier, getTierColor } from "../lib/xpUtils";
import { useXpStore } from "../store/useXpStore";

interface XpProgressBarProps {
  animatedXp: Animated.Value;
  size: "compact" | "full";
}

export function XpProgressBar({ animatedXp, size }: XpProgressBarProps) {
  const xpTotal = useXpStore((s) => s.xpTotal);
  const currentTier = getCurrentTier(xpTotal);
  const nextTier = getNextTier(xpTotal);
  const tierColor = getTierColor(xpTotal);

  const rangeStart = currentTier.threshold;
  const rangeEnd = nextTier ? nextTier.threshold : currentTier.threshold + 1;

  const animatedWidth = animatedXp.interpolate({
    inputRange: [rangeStart, rangeEnd],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  const barHeight = size === "compact" ? 6 : 10;
  const barRadius = barHeight / 2;

  return (
    <View>
      <View
        style={[
          styles.barBackground,
          {
            height: barHeight,
            borderRadius: barRadius,
            width: size === "compact" ? 90 : "100%",
          },
        ]}
      >
        <Animated.View
          style={[
            styles.barFill,
            {
              height: barHeight,
              borderRadius: barRadius,
              backgroundColor: tierColor,
              width: animatedWidth,
            },
          ]}
        />
      </View>
      {size === "full" && nextTier && (
        <View style={styles.labelRow}>
          <Text style={styles.tierLabel}>
            {currentTier.name} — {currentTier.threshold.toLocaleString()} XP
          </Text>
          <Text style={styles.tierLabel}>
            {nextTier.name} — {nextTier.threshold.toLocaleString()} XP
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  barBackground: {
    backgroundColor: colors.surface2,
    overflow: "hidden",
  },
  barFill: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  tierLabel: {
    fontSize: 11,
    color: colors.text3,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/XpProgressBar.tsx
git commit -m "feat(xp): add XpProgressBar component with tier-colored animated fill"
```

---

### Task 5: Create `components/XpAnimatedCounter.tsx`

**Files:**
- Create: `components/XpAnimatedCounter.tsx`

- [ ] **Step 1: Create the animated counter component**

```typescript
// components/XpAnimatedCounter.tsx

import { View, Text, StyleSheet } from "react-native";
import { colors } from "../lib/theme";

interface XpAnimatedCounterProps {
  displayXp: number;
  size: "compact" | "full";
}

export function XpAnimatedCounter({ displayXp, size }: XpAnimatedCounterProps) {
  const formatted = displayXp.toLocaleString();

  if (size === "compact") {
    return (
      <Text style={styles.compactText}>{formatted} XP</Text>
    );
  }

  return (
    <View style={styles.fullContainer}>
      <Text style={styles.fullNumber}>{formatted}</Text>
      <Text style={styles.fullLabel}>XP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  compactText: {
    color: colors.gold,
    fontWeight: "700",
    fontSize: 13,
    fontVariant: ["tabular-nums"],
  },
  fullContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  fullNumber: {
    color: colors.gold,
    fontWeight: "900",
    fontSize: 32,
    fontVariant: ["tabular-nums"],
  },
  fullLabel: {
    color: colors.gold,
    fontWeight: "700",
    fontSize: 18,
    marginLeft: 6,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/XpAnimatedCounter.tsx
git commit -m "feat(xp): add XpAnimatedCounter component with compact and full variants"
```

---

### Task 6: Create `components/RankBadge.tsx`

**Files:**
- Create: `components/RankBadge.tsx`

- [ ] **Step 1: Create the rank badge component**

```typescript
// components/RankBadge.tsx

import { View, Text, StyleSheet } from "react-native";
import { colors } from "../lib/theme";
import { getCurrentTier, type TierInfo } from "../lib/xpUtils";

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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/RankBadge.tsx
git commit -m "feat(xp): add RankBadge component with pill and shield variants"
```

---

### Task 7: Integrate XP header into Map tab (`app/(tabs)/index.tsx`)

**Files:**
- Modify: `app/(tabs)/index.tsx`

- [ ] **Step 1: Replace the placeholder Map screen with XP header**

Replace the entire contents of `app/(tabs)/index.tsx` with:

```typescript
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { colors } from "../../lib/theme";
import { getCurrentTier } from "../../lib/xpUtils";
import { useXpStore } from "../../store/useXpStore";
import { useXpAnimation } from "../../hooks/useXpAnimation";
import { XpProgressBar } from "../../components/XpProgressBar";
import { XpAnimatedCounter } from "../../components/XpAnimatedCounter";
import { RankBadge } from "../../components/RankBadge";

export default function ProgressMapScreen() {
  const xpTotal = useXpStore((s) => s.xpTotal);
  const tier = getCurrentTier(xpTotal);
  const { animatedXp, displayXp } = useXpAnimation();

  return (
    <SafeAreaView style={styles.container}>
      {/* XP Header */}
      <View style={styles.headerRow}>
        <RankBadge tier={tier} variant="pill" />
        <View style={styles.headerRight}>
          <XpProgressBar animatedXp={animatedXp} size="compact" />
          <XpAnimatedCounter displayXp={displayXp} size="compact" />
        </View>
      </View>

      {/* Map content placeholder — issue #2 builds this out */}
      <View style={styles.mapContent}>
        <Text style={styles.mapPlaceholder}>Progress Map</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  mapContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholder: {
    color: colors.text3,
    fontSize: 16,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/\(tabs\)/index.tsx
git commit -m "feat(xp): add XP header row to Map tab with badge, bar, and counter"
```

---

### Task 8: Integrate XP display into Profile tab (`app/(tabs)/profile.tsx`)

**Files:**
- Modify: `app/(tabs)/profile.tsx`

- [ ] **Step 1: Replace the placeholder Profile screen with XP display**

Replace the entire contents of `app/(tabs)/profile.tsx` with:

```typescript
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { colors } from "../../lib/theme";
import { getCurrentTier } from "../../lib/xpUtils";
import { useXpStore } from "../../store/useXpStore";
import { useXpAnimation } from "../../hooks/useXpAnimation";
import { XpProgressBar } from "../../components/XpProgressBar";
import { XpAnimatedCounter } from "../../components/XpAnimatedCounter";
import { RankBadge } from "../../components/RankBadge";

export default function ProfileScreen() {
  const xpTotal = useXpStore((s) => s.xpTotal);
  const tier = getCurrentTier(xpTotal);
  const { animatedXp, displayXp } = useXpAnimation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Username */}
        <Text style={styles.username}>DemoStudent</Text>
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

        {/* Placeholder for leaderboard/stats — issue #5 */}
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Leaderboard & Stats (Issue #5)</Text>
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
  username: {
    color: colors.text1,
    fontWeight: "800",
    fontSize: 22,
    textAlign: "center",
    marginTop: 24,
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
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
  },
  placeholderText: {
    color: colors.text3,
    fontSize: 14,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/\(tabs\)/profile.tsx
git commit -m "feat(xp): add shield badge, XP counter, and progress bar to Profile tab"
```

---

### Task 9: Set demo XP in mock data and smoke test

**Files:**
- Modify: `app/(tabs)/index.tsx` (temporary test)

- [ ] **Step 1: Set demo XP value on the Map screen for visual testing**

Add a temporary `useEffect` at the top of `ProgressMapScreen` in `app/(tabs)/index.tsx`, right after the existing hooks:

```typescript
  // Temporary: seed demo XP for visual testing — remove before merge
  useEffect(() => {
    const { xpTotal, setXp } = useXpStore.getState();
    if (xpTotal === 0) setXp(1240);
  }, []);
```

Add the import at the top of the file:

```typescript
import { useEffect } from "react";
```

- [ ] **Step 2: Run the app and visually verify**

Run: `cd /Users/bird/cracked-quest && npx expo start`

Check:
- Map tab shows: pill badge ("GRINDER") on left, purple progress bar + "1,240 XP" on right
- Profile tab shows: shield badge, "1,240 XP" large, full bar with "Grinder — 500 XP" / "Scholar — 1,500 XP" labels
- Bar and counter animate from 0 on tab mount

- [ ] **Step 3: Remove the temporary seed and commit**

Remove the temporary `useEffect` and unused `useEffect` import from `app/(tabs)/index.tsx`.

```bash
git add app/\(tabs\)/index.tsx app/\(tabs\)/profile.tsx
git commit -m "feat(xp): complete XP & Rank Display for issue #4"
```
