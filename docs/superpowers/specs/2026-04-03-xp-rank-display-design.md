# XP & Rank Display — Design Spec

**Issue:** #4 — P0: XP & Rank Display
**Date:** 2026-04-03

## Overview

XP progress bar and rank tier badge visible on the Map tab header and Profile tab. When XP changes, the bar and counter animate. Shows current tier with progress to next tier. This is the core game feel — must look polished.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Visibility | Map header + Profile only | Keep other tabs clean |
| Badge style | Hybrid — pill (Map), shield (Profile) | Contextual sizing per screen |
| XP bar color | Tier-colored | Visual progression as players rank up |
| Animation on mount | 0 → current XP (~0.5s) | Satisfying "loading in" feel |
| Animation on gain | Previous → new XP (~0.5s) | Real-time feedback on any XP source |
| Number tick-up | Quick snap ~0.5s | Fast and punchy |
| Architecture | Composed small components | Focused files, reusable, testable |

## Architecture

### Approach: Composed Small Components

Each piece has a single responsibility. The Map and Profile screens compose them differently.

```
lib/xpUtils.ts              — pure functions: thresholds, tier colors, progress %
hooks/useXpAnimation.ts     — mount animation + incremental gain detection
components/
  XpProgressBar.tsx          — animated bar, tier-colored fill
  XpAnimatedCounter.tsx      — number tick-up (~0.5s snap)
  RankBadge.tsx              — pill (compact) or shield (full) variant
```

### Data Flow

```
Study session / Quiz
  → useXpStore.addXp() or setXp()
    → useXpAnimation hook detects change via useRef
      → Animated.timing drives bar width + counter text
```

## File Details

### `lib/xpUtils.ts` — Pure Utility Functions

Single source of truth for rank tier data. Replaces hardcoded tier info.

```typescript
RANK_TIERS = [
  { name: "Student",  threshold: 0,     color: "#9896AA" },
  { name: "Grinder",  threshold: 500,   color: "#9B6DFF" },
  { name: "Scholar",  threshold: 1500,  color: "#4EFFB4" },
  { name: "Veteran",  threshold: 3500,  color: "#F5C842" },
  { name: "Elite",    threshold: 7000,  color: "#FF5757" },
  { name: "Legend",    threshold: 12000, color: "#F5C842" },
]
```

Functions:
- `getCurrentTier(xp)` — returns current tier object
- `getNextTier(xp)` — returns next tier object, or `null` if Legend
- `getTierProgress(xp)` — returns 0–1 float representing progress within current tier
- `getTierColor(xp)` — returns the current tier's hex color string

### `hooks/useXpAnimation.ts`

Manages two animation scenarios:

1. **On mount:** Animates from 0 → current `xpTotal` over ~500ms using `Animated.timing`
2. **On XP gain:** Detects `xpTotal` change via `useRef(prevXp)`, animates from previous → new over ~500ms

Returns:
- `animatedXp: Animated.Value` — for driving bar width interpolation
- `displayXp: number` — plain number updated via `Animated.Value` listener, for counter text

Reads `useXpStore.xpTotal` directly via Zustand selector.

### `components/XpProgressBar.tsx`

Props: `animatedXp: Animated.Value`, `size: "compact" | "full"`

- **Compact** (Map header): 6px tall, no text labels
- **Full** (Profile): 10px tall, tier labels below ("Grinder — 500 XP" left, "Scholar — 1,500 XP" right)
- Background: `colors.surface2` (`#1C1C22`), fully rounded corners
- Fill: tier-colored via `getTierColor()`, animated width via `Animated.interpolate` mapping XP range to 0%–100%
- Uses `StyleSheet.create()` per CLAUDE.md rules

### `components/XpAnimatedCounter.tsx`

Props: `displayXp: number`, `size: "compact" | "full"`

- **Compact** (Map header): "1,240 XP" — 13px, gold, single line with `white-space: nowrap`
- **Full** (Profile): "1,240" large (32px bold) + "XP" (18px) on the same line, both gold
- Number formatted with commas via `toLocaleString()`

### `components/RankBadge.tsx`

Props: `tier: string`, `variant: "pill" | "shield"`

- **Pill** (Map header): `surface2` background, tier-colored border, tier icon + uppercase name, inline-flex
- **Shield** (Profile): gradient fill (`primary` → `primaryDark`), `primaryLight` border, pointed bottom, tier icon centered, name below
- Tier icons (emoji, swappable to SVGs later): Student &#x1F393;, Grinder &#x2694;, Scholar &#x1F4DA;, Veteran &#x1F6E1;, Elite &#x1F451;, Legend &#x2B50;

## Screen Integration

### Map Tab Header (`app/(tabs)/index.tsx`)

Horizontal row at the top inside `SafeAreaView`:
- Left: `RankBadge` variant="pill"
- Right: `XpProgressBar` size="compact" + `XpAnimatedCounter` size="compact"
- Row background: `colors.surface` with bottom border
- Sits above whatever content issue #2 builds — no conflict

### Profile Tab (`app/(tabs)/profile.tsx`)

Top section of the screen:
- Username + university (existing placeholder content)
- `RankBadge` variant="shield", centered
- Spacing (24px)
- `XpAnimatedCounter` size="full", centered
- Spacing (12px)
- `XpProgressBar` size="full" with tier labels
- Divider, then rest of profile (issue #5 scope)

## Store Change: `useXpStore`

Remove `rankTier` state and `setRank` action. Tier is now derived:

```typescript
// Before: stored in state
rankTier: "Student",
setRank: (tier) => set({ rankTier: tier }),

// After: derived via xpUtils
// Components call getCurrentTier(xpTotal).name instead
```

Keep `xpTotal`, `streakDays`, `setXp`, `addXp`, `setStreak`. The `RankTier` type moves to `lib/xpUtils.ts`.

## Mockup Reference

Visual mockups saved in `.superpowers/brainstorm/` — see `screen-mockups-v3.html` for the approved layout.
