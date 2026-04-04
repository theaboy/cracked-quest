# NativeWind Theming & Visual Polish — Design Spec

**Issue:** #15 — P2: NativeWind Theming & Visual Polish
**Date:** 2026-04-04

## Overview

Wire up NativeWind v4 so Tailwind classes work in React Native. Fix ~100+ hardcoded hex colors across 13 files to use theme constants. Add tier colors to the theme. Create reusable flashy game effect components (shimmer, glow, gradient borders) for Magic UI-style polish.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| NativeWind | Wire up fully | Needed for Magic UI-style animations and Tailwind utility classes |
| Existing screens | Keep StyleSheet.create(), fix colors only | No risky rewrites, new components use Tailwind |
| Tier colors | Add to theme.ts | Single source of truth for all colors |
| Splash screen | Keep current | Focus on in-app polish |
| Effects style | Flashy game effects | Shimmer, glow, gradient borders for game moments |

## Part 1: NativeWind v4 Configuration

### Files to create/modify:

**Create `tailwind.config.js`:**
- Content paths: `app/**/*.{ts,tsx}`, `components/**/*.{ts,tsx}`
- Extend theme colors with values from `lib/theme.ts` (bg, surface, primary, gold, etc.)

**Modify `babel.config.js`:**
- Add `"nativewind/babel"` to plugins array

**Create `metro.config.js`:**
- Use `withNativeWind` wrapper from `nativewind/metro`
- Point to `global.css`

**Create `global.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Modify `app/_layout.tsx`:**
- Add `import "../global.css"` at the top

### Behavior
- Existing `StyleSheet.create()` code continues working unchanged
- New components can use `className` prop with Tailwind utility classes
- Both approaches coexist

## Part 2: Theme Extension — Tier Colors

Add `tierColors` to `lib/theme.ts`:

```typescript
tierColors: {
  student:  "#9896AA",
  grinder:  "#9B6DFF",
  scholar:  "#4EFFB4",
  veteran:  "#F5C842",
  elite:    "#FF5757",
  legend:   "#F5C842",
}
```

Update `lib/xpUtils.ts` to import tier colors from `colors.tierColors` instead of hardcoded hex values.

## Part 3: Hardcoded Color Cleanup

### Color Mapping

| Hardcoded | Theme Constant | Found In |
|-----------|---------------|----------|
| `#7c3aed` | `colors.primary` (`#9B6DFF`) | study.tsx, quests.tsx |
| `#0f0f23` | `colors.bg` (`#0C0C10`) | study.tsx, quests.tsx |
| `#1e1e3a` | `colors.surface2` (`#1C1C22`) | study.tsx, quests.tsx |
| `#2d1f5e` | `colors.surface3` (`#242430`) | study.tsx |
| `#a78bfa` | `colors.primaryLight` (`#B99BFF`) | study.tsx |
| `#ffffff` | `colors.text1` (`#F0EFF8`) | study.tsx, quests.tsx |
| `#9ca3af` | `colors.text2` (`#9896AA`) | study.tsx, quests.tsx |
| `#6b7280` | `colors.text3` (`#5C5B6E`) | study.tsx, quests.tsx |
| `#fbbf24` | `colors.gold` (`#F5C842`) | study.tsx |
| `#dc2626` | `colors.danger` (`#FF5757`) | study.tsx |
| `#10b981` | `colors.success` (`#4EFFB4`) | study.tsx |
| `#000000` | `colors.bg` | auth/index.tsx |

Note: The hardcoded Tailwind palette colors (#7c3aed, etc.) are slightly different hues than the moodboard colors. Replacing them with theme constants will shift the visual appearance to match the intended moodboard design.

### Files to fix:
- `app/(tabs)/study.tsx` — ~45 hardcoded colors (heaviest)
- `app/(tabs)/quests.tsx` — ~50 hardcoded colors (heaviest)
- `app/(tabs)/_layout.tsx` — 3-4 hardcoded
- `app/(auth)/index.tsx` — 2 hardcoded
- `app/(auth)/onboarding.tsx` — 6 hardcoded in color array
- `app/(auth)/login.tsx` — scattered values

### Approach
Mechanical find-and-replace within StyleSheet objects. Import `colors` from `../../lib/theme` (or `../lib/theme` depending on depth), replace hex strings with `colors.xxx`.

## Part 4: Flashy Game Effect Components

Three reusable wrapper components in `components/effects/`:

### `components/effects/ShimmerEffect.tsx`

A shimmer/shine sweep animation that overlays any child component.

- Props: `children`, `color?: string` (default gold), `duration?: number` (default 2000ms)
- Renders a translucent gradient that sweeps left-to-right on a loop
- Uses `react-native-reanimated` for smooth 60fps animation
- Usage: wrap rank badges, XP gain toasts, buttons for premium feel

### `components/effects/GlowBorder.tsx`

An animated pulsing glow around a component.

- Props: `children`, `color?: string` (default `colors.primary`), `intensity?: number` (0-1, default 0.6)
- Renders a shadow that pulses opacity using `react-native-reanimated`
- Usage: current user leaderboard row, active study session card, rank badge on profile

### `components/effects/GradientBorder.tsx`

A rotating gradient border effect.

- Props: `children`, `colors?: string[]` (default gold-to-purple), `borderWidth?: number` (default 2), `borderRadius?: number` (default 12)
- Uses `expo-linear-gradient` (already installed) with animated rotation
- Usage: highlighted cards, premium-feeling containers

### Dependency
- `react-native-reanimated` — check if installed, add if needed. Required for ShimmerEffect and GlowBorder.

## Out of Scope

- Migrating existing StyleSheet screens to Tailwind classes (future work)
- Splash screen changes
- App icon changes
- Dark mode system detection (already dark by default)
