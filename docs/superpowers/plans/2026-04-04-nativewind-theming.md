# NativeWind Theming & Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up NativeWind v4, fix all hardcoded colors to use theme constants, add tier colors to theme, and create flashy game effect components.

**Architecture:** NativeWind config (4 files), theme extension with tier colors, mechanical color replacement across 6 files, 3 new effect wrapper components using react-native-reanimated.

**Tech Stack:** NativeWind v4, Tailwind CSS, react-native-reanimated, expo-linear-gradient, TypeScript

**Spec:** `docs/superpowers/specs/2026-04-04-nativewind-theming-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `tailwind.config.js` | Create | Tailwind config with theme colors |
| `global.css` | Create | Tailwind directives |
| `metro.config.js` | Create | Metro bundler with NativeWind wrapper |
| `babel.config.js` | Modify | Add nativewind/babel plugin |
| `app/_layout.tsx` | Modify | Import global.css |
| `lib/theme.ts` | Modify | Add tierColors section |
| `lib/xpUtils.ts` | Modify | Import tier colors from theme |
| `app/(tabs)/quests.tsx` | Modify | Replace ~36 hardcoded colors |
| `app/(tabs)/study.tsx` | Modify | Replace ~51 hardcoded colors |
| `app/(tabs)/_layout.tsx` | Modify | Replace 4 hardcoded colors |
| `app/(auth)/index.tsx` | Modify | Replace 2 hardcoded colors |
| `app/(auth)/login.tsx` | Modify | Replace 2 hardcoded colors |
| `components/effects/ShimmerEffect.tsx` | Create | Shimmer sweep animation wrapper |
| `components/effects/GlowBorder.tsx` | Create | Pulsing glow border wrapper |
| `components/effects/GradientBorder.tsx` | Create | Rotating gradient border wrapper |

---

### Task 1: Wire up NativeWind v4

**Files:**
- Create: `tailwind.config.js`
- Create: `global.css`
- Create: `metro.config.js`
- Modify: `babel.config.js`
- Modify: `app/_layout.tsx`

- [ ] **Step 1: Create `tailwind.config.js`**

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#0C0C10",
        surface: { DEFAULT: "#141418", 2: "#1C1C22", 3: "#242430" },
        border: "#2E2E3E",
        primary: { DEFAULT: "#9B6DFF", light: "#B99BFF", dark: "#6B3FD4" },
        mauve: "#C4A4FF",
        gold: { DEFAULT: "#F5C842", dark: "#C49A1A" },
        text1: "#F0EFF8",
        text2: "#9896AA",
        text3: "#5C5B6E",
        danger: "#FF5757",
        success: "#4EFFB4",
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Create `global.css`**

```css
/* global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 3: Create `metro.config.js`**

```javascript
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

- [ ] **Step 4: Modify `babel.config.js`**

Replace the entire contents of `babel.config.js` with:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["nativewind/babel"],
  };
};
```

- [ ] **Step 5: Modify `app/_layout.tsx`**

Add this import as the very first line of `app/_layout.tsx`:

```typescript
import "../global.css";
```

- [ ] **Step 6: Verify the app still starts**

Run: `cd /Users/bird/cracked-quest && npx expo start --clear`
Expected: App starts without errors. Existing StyleSheet screens render unchanged.

- [ ] **Step 7: Commit**

```bash
git add tailwind.config.js global.css metro.config.js babel.config.js app/_layout.tsx
git commit -m "feat: wire up NativeWind v4 with Tailwind config and metro integration"
```

---

### Task 2: Add tier colors to theme and update xpUtils

**Files:**
- Modify: `lib/theme.ts`
- Modify: `lib/xpUtils.ts`

- [ ] **Step 1: Add tierColors to `lib/theme.ts`**

Add the following after the existing `success` entry in the `colors` object:

```typescript
  tierStudent: "#9896AA",
  tierGrinder: "#9B6DFF",
  tierScholar: "#4EFFB4",
  tierVeteran: "#F5C842",
  tierElite: "#FF5757",
  tierLegend: "#F5C842",
```

- [ ] **Step 2: Update `lib/xpUtils.ts` to use theme colors**

Replace the `RANK_TIERS` array in `lib/xpUtils.ts` with:

```typescript
import { colors } from "./theme";

export const RANK_TIERS: TierInfo[] = [
  { name: "Student",  threshold: 0,     color: colors.tierStudent, icon: "🎓" },
  { name: "Grinder",  threshold: 500,   color: colors.tierGrinder, icon: "⚔" },
  { name: "Scholar",  threshold: 1500,  color: colors.tierScholar, icon: "📚" },
  { name: "Veteran",  threshold: 3500,  color: colors.tierVeteran, icon: "🛡" },
  { name: "Elite",    threshold: 7000,  color: colors.tierElite,   icon: "👑" },
  { name: "Legend",    threshold: 12000, color: colors.tierLegend,  icon: "⭐" },
];
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add lib/theme.ts lib/xpUtils.ts
git commit -m "feat: add tier colors to theme, update xpUtils to use theme constants"
```

---

### Task 3: Fix hardcoded colors in `app/(tabs)/quests.tsx`

**Files:**
- Modify: `app/(tabs)/quests.tsx`

- [ ] **Step 1: Add theme import and replace all hardcoded colors**

Add import at top of file:

```typescript
import { colors, radii } from "../../lib/theme";
```

Then replace every hardcoded color in the StyleSheet with theme constants. The complete mapping:

| Find | Replace with |
|------|-------------|
| `"#0f0f23"` | `colors.bg` |
| `"#7c3aed"` | `colors.primary` |
| `"#ffffff"` | `colors.text1` |
| `"#9ca3af"` | `colors.text2` |
| `"#6b7280"` | `colors.text3` |
| `"#1e1e3a"` | `colors.surface2` |
| `"#2d2d4e"` | `colors.border` |
| `"#a78bfa"` | `colors.primaryLight` |
| `"#d1d5db"` | `colors.text1` |
| `"#4b5563"` | `colors.text3` |
| `"#fbbf24"` | `colors.gold` |
| `"#000000"` | `colors.bg` |
| `"#374151"` | `colors.surface3` |
| `"#3d3d5e"` | `colors.border` |
| `"rgba(0,0,0,0.85)"` | `"rgba(0,0,0,0.85)"` (keep as-is, modal overlay) |

Also replace `placeholderTextColor="#6b7280"` with `placeholderTextColor={colors.text3}` in all TextInput components.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/\(tabs\)/quests.tsx
git commit -m "fix: replace hardcoded colors with theme constants in quests screen"
```

---

### Task 4: Fix hardcoded colors in `app/(tabs)/study.tsx`

**Files:**
- Modify: `app/(tabs)/study.tsx`

- [ ] **Step 1: Add theme import and replace all hardcoded colors**

The file already imports `useXpStore` and `useStudyStore`. Add:

```typescript
import { colors, radii } from "../../lib/theme";
```

Apply the same color mapping as Task 3 (identical hex values). Additionally:

| Find | Replace with |
|------|-------------|
| `"#dc2626"` | `colors.danger` |
| `"#10b981"` | `colors.success` |
| `"#065f46"` | `"rgba(78,255,180,0.2)"` (success bg tint) |
| `"#7f1d1d"` | `"rgba(255,87,87,0.2)"` (danger bg tint) |
| `"#ef4444"` | `colors.danger` |
| `"#f87171"` | `colors.danger` |
| `"#2d1f5e"` | `colors.surface3` |

Replace all `placeholderTextColor="#6b7280"` with `placeholderTextColor={colors.text3}`.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/\(tabs\)/study.tsx
git commit -m "fix: replace hardcoded colors with theme constants in study screen"
```

---

### Task 5: Fix hardcoded colors in remaining files

**Files:**
- Modify: `app/(tabs)/_layout.tsx`
- Modify: `app/(auth)/index.tsx`
- Modify: `app/(auth)/login.tsx`

- [ ] **Step 1: Fix `app/(tabs)/_layout.tsx`**

The file already imports `colors`. Replace the remaining hardcoded values:

| Find | Replace with |
|------|-------------|
| `"#B99BFF"` (iconColor) | `colors.primaryLight` |
| `"#5C5B6E"` (iconColor) | `colors.text3` |
| `"#141418"` (tabBar bg) | `colors.surface` |
| `"#2E2E3E"` (tabBar border) | `colors.border` |
| `"#B99BFF"` (pillLabel color) | `colors.primaryLight` |

- [ ] **Step 2: Fix `app/(auth)/index.tsx`**

The file already imports `colors` and `radii`. Replace:

| Find | Replace with |
|------|-------------|
| `"#000000"` (container bg) | `colors.bg` |
| `"#000000"` (whiteBtnText) | `colors.bg` |

- [ ] **Step 3: Fix `app/(auth)/login.tsx`**

The file already imports `colors` and `radii`. Replace:

| Find | Replace with |
|------|-------------|
| `"#FFF"` (primaryBtnText) | `colors.white` |
| `"#1A1400"` (goldBtnText) | `colors.bg` |

- [ ] **Step 4: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add app/\(tabs\)/_layout.tsx app/\(auth\)/index.tsx app/\(auth\)/login.tsx
git commit -m "fix: replace hardcoded colors in tab layout, auth splash, and login screens"
```

---

### Task 6: Create `components/effects/ShimmerEffect.tsx`

**Files:**
- Create: `components/effects/ShimmerEffect.tsx`

- [ ] **Step 1: Create the shimmer effect component**

```typescript
// components/effects/ShimmerEffect.tsx

import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../lib/theme";

interface ShimmerEffectProps {
  children: React.ReactNode;
  color?: string;
  duration?: number;
}

export function ShimmerEffect({
  children,
  color = colors.gold,
  duration = 2000,
}: ShimmerEffectProps) {
  const translateX = useSharedValue(-200);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(400, { duration, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );
  }, [duration, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      {children}
      <Animated.View style={[styles.shimmerOverlay, animatedStyle]}>
        <LinearGradient
          colors={["transparent", `${color}40`, "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    position: "relative",
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    width: 200,
  },
  gradient: {
    flex: 1,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/effects/ShimmerEffect.tsx
git commit -m "feat: add ShimmerEffect component for gold/purple sweep animations"
```

---

### Task 7: Create `components/effects/GlowBorder.tsx`

**Files:**
- Create: `components/effects/GlowBorder.tsx`

- [ ] **Step 1: Create the glow border component**

```typescript
// components/effects/GlowBorder.tsx

import { useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { colors } from "../../lib/theme";

interface GlowBorderProps {
  children: React.ReactNode;
  color?: string;
  intensity?: number;
  borderRadius?: number;
}

export function GlowBorder({
  children,
  color = colors.primary,
  intensity = 0.6,
  borderRadius = 12,
}: GlowBorderProps) {
  const glowOpacity = useSharedValue(intensity * 0.3);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withTiming(intensity, {
        duration: 1500,
        easing: Easing.inOut(Easing.sine),
      }),
      -1,
      true
    );
  }, [intensity, glowOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    shadowOpacity: glowOpacity.value,
  }));

  const glowStyle: ViewStyle = {
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16,
    elevation: 8,
    borderRadius,
  };

  return (
    <Animated.View style={[styles.wrapper, glowStyle, animatedStyle]}>
      <View style={[styles.inner, { borderRadius }]}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: "visible",
  },
  inner: {
    overflow: "hidden",
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/effects/GlowBorder.tsx
git commit -m "feat: add GlowBorder component with pulsing shadow animation"
```

---

### Task 8: Create `components/effects/GradientBorder.tsx`

**Files:**
- Create: `components/effects/GradientBorder.tsx`

- [ ] **Step 1: Create the gradient border component**

```typescript
// components/effects/GradientBorder.tsx

import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../lib/theme";

interface GradientBorderProps {
  children: React.ReactNode;
  gradientColors?: string[];
  borderWidth?: number;
  borderRadius?: number;
}

export function GradientBorder({
  children,
  gradientColors = [colors.gold, colors.primary, colors.primaryDark],
  borderWidth = 2,
  borderRadius = 12,
}: GradientBorderProps) {
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.gradientContainer,
        { borderRadius, padding: borderWidth },
      ]}
    >
      <View
        style={[
          styles.innerContainer,
          {
            borderRadius: borderRadius - borderWidth,
            backgroundColor: colors.surface,
          },
        ]}
      >
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    overflow: "hidden",
  },
  innerContainer: {
    overflow: "hidden",
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bird/cracked-quest && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/effects/GradientBorder.tsx
git commit -m "feat: add GradientBorder component with gold-to-purple gradient wrapper"
```
