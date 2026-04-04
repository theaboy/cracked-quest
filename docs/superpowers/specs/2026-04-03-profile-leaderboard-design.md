# Profile & Leaderboard Screen — Design Spec

**Issue:** #5 — P0: Profile & Leaderboard Screen
**Date:** 2026-04-03
**Depends on:** #4 (XP & Rank Display — complete)

## Overview

Expand the Profile tab with an avatar, streak card, and leaderboard. The existing XP section (shield badge, counter, progress bar from issue #4) stays untouched. New content goes below the divider.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Avatar | Crack mascot in purple circle (swappable later) | Simple default, custom avatars are a future feature |
| Streak display | Dedicated card with current + best streak | Prominent game feel, not just inline text |
| Leaderboard scope | Global (all students) | Simplest for demo, per-course filtering is future work |
| User highlight | Gold-to-purple gradient background | Pimping, valorizes user rank, eye-catching |
| Pinned row | Always show user position at bottom | User always sees their rank even in longer lists |
| Layout | Keep existing XP section, add below divider | Minimal changes to working code |
| Architecture | Composed small components | Focused files, reusable, matches issue #4 pattern |

## Architecture

```
components/
  ProfileAvatar.tsx       — Crack mascot in circular container
  StreakCard.tsx           — flame icon, current streak, best streak
  LeaderboardList.tsx     — section header, ranked rows, pinned user row
  LeaderboardRow.tsx      — single row (rank, username, tier, XP)
```

## File Details

### `components/ProfileAvatar.tsx`

Props: `size?: number` (default 80)

- Circular container: `borderRadius: size/2`, border `2.5px solid colors.primary`
- Background: `colors.surface2`
- Displays `assets/crack-mascot.png` via `<Image>` filling the circle
- Later: accept an optional `uri` prop to show custom avatar instead of mascot

### `components/StreakCard.tsx`

No props — reads `streakDays` from `useXpStore`.

- Card: `colors.surface` background, `colors.border` border, `borderRadius: 14`
- Left side: 🔥 emoji (28px) + streak count (24px bold gold) + "day streak" label
- Right side: "BEST" label + hardcoded best streak value (e.g. 12 days)
- Best streak is hardcoded for demo — `useXpStore` doesn't track it yet

### `components/LeaderboardRow.tsx`

Props: `rank: number`, `username: string`, `xp: number`, `tier: string`, `isCurrentUser: boolean`

- Row layout: rank number (28px width) | username (flex) | tier name | XP count
- Default style: `colors.surface` background, `colors.border` border
- Current user style: gold-to-purple gradient background (`linear-gradient(135deg, rgba(245,200,66,0.2), rgba(155,109,255,0.25), rgba(107,63,212,0.2))`), `colors.primaryLight` border, username has ⭐ suffix and bold weight
- Rank #1 gets gold colored rank number, others get `colors.text2`

Note: React Native doesn't support CSS `linear-gradient` on `View`. Implementation uses `expo-linear-gradient` (`LinearGradient` component) as the row background for the current user's row.

### `components/LeaderboardList.tsx`

Props: `currentUsername: string`

- "LEADERBOARD" section label (11px, uppercase, `colors.text3`, letter-spacing 1.5)
- Reads from `DEMO_LEADERBOARD` in `lib/mockData.ts`, sorted by XP descending
- Renders rows via `.map()` (no FlatList — CLAUDE.md rule)
- Each row gets `isCurrentUser={entry.username === currentUsername}`
- Below the main list: pinned row showing current user's position
  - Same gradient styling as the highlighted row
  - "Your position" label below (10px, centered, `colors.text3`)
  - Separated from list by 8px gap

## Mock Data Update

The existing `DEMO_LEADERBOARD` in `lib/mockData.ts` is sufficient:

```typescript
export const DEMO_LEADERBOARD = [
  { username: "AlexChen", xp: 1420, tier: "Scholar" },
  { username: "SarahM", xp: 1380, tier: "Grinder" },
  { username: "DemoStudent", xp: 1240, tier: "Grinder" },
  { username: "JakeW", xp: 1100, tier: "Grinder" },
  { username: "EmmaL", xp: 890, tier: "Grinder" },
];
```

No changes needed — tiers can be derived via `getCurrentTier()` but the mock data already has them as strings, which is fine for the demo.

## Screen Integration (`app/(tabs)/profile.tsx`)

Replace the placeholder section below the divider. Full layout top to bottom:

1. `ProfileAvatar` — centered, 80px
2. Username text — "DemoStudent" (from `useAuthStore`)
3. University text — "McGill University"
4. `RankBadge` variant="shield" (existing from #4)
5. `XpAnimatedCounter` size="full" (existing from #4)
6. `XpProgressBar` size="full" (existing from #4)
7. Divider (existing)
8. `StreakCard`
9. `LeaderboardList` with `currentUsername` from auth store

## Dependencies

- `expo-linear-gradient` — needed for the gold-to-purple gradient on user's leaderboard row. Must be added to `package.json`.

## Mockup Reference

Visual mockups saved in `.superpowers/brainstorm/` — see `profile-mockup-v2.html` for the approved layout.
