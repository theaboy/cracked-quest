# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StudyQuest is a mobile-first gamified academic engagement app targeting McGill University students (Phase 1). It turns studying, attending class, and collaborating into an MMORPG-style game with XP, rank tiers, leaderboards, and a 3D progression map.

## Key Documents

- `PRD.md` — Full product requirements (features, game design, phase roadmap)
- `TECH_SPEC.md` — Technical specification (architecture, DB schema, Edge Functions, 3D map details)

## Tech Stack

- **Mobile:** React Native 0.81 + Expo (SDK 54), Expo Router v6 (file-based routing); React 19; New Architecture enabled (`newArchEnabled: true`)
- **3D Map:** Babylon.js (`@babylonjs/react-native`) — MMORPG-style progression map
- **Styling:** NativeWind v4 (Tailwind CSS for React Native)
- **State:** Zustand v5
- **Backend/DB:** Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **AI:** Anthropic Claude API (`claude-sonnet-4-20250514`) via Supabase Edge Functions (Deno runtime)
- **Notifications:** Expo Notifications
- **Language:** TypeScript throughout

## Build Commands

```bash
npm install                   # Install dependencies
npx expo start                # Dev server (Expo Go — no 3D map)
npx expo start --tunnel       # Dev server with tunnel (for demo/device)
npx expo prebuild             # Generate native projects (required for Babylon.js)
npx expo run:ios              # Run on iOS simulator with native modules
npx expo run:android          # Run on Android with native modules
npx tsc --noEmit              # TypeScript type-check (no test runner configured)

# Edge Functions
supabase functions deploy breakdown
supabase functions deploy quiz-gen
supabase functions deploy flashcards
supabase functions deploy award_xp
```

## Architecture Rules

- **Never call Claude API from the client.** All AI calls go through Supabase Edge Functions.
- **`ANTHROPIC_API_KEY` is a Supabase secret** — never in the app bundle or `.env.local`.
- **Client env vars** use `EXPO_PUBLIC_` prefix (Supabase URL and anon key only).
- **RLS enabled on all tables.** Users can only read/write their own data except leaderboard queries.
- **XP is awarded server-side only** via Edge Functions to prevent client-side manipulation.
- **Babylon.js requires native modules.** Must run `npx expo prebuild` (bare workflow). No `expo-gl` needed — Babylon uses JSI.
- **`supabase` is nullable.** `lib/supabase.ts` returns `null` when `EXPO_PUBLIC_SUPABASE_URL` is unset (to prevent crash on module load). Always call it as `supabase?.functions.invoke(...)` — never assume it's defined.
- **Styling: `StyleSheet.create()` only.** NativeWind is in `package.json` but its babel/metro config is not yet wired up. Do not use Tailwind class names until that setup is done.
- **`FlatList` inside `ScrollView` is forbidden.** React Native warns and breaks scroll. Use `View` + `.map()` instead.

## Project Structure

```
app/                    # Expo Router screens
  _layout.tsx           # Root Stack navigator (no headers)
  (auth)/               # Login, signup, onboarding screens
  (tabs)/               # Tab navigator: Map, Study, Quests, Commons, Profile
    _layout.tsx         # Tabs layout
    index.tsx           # Progress Map (home tab)
  map/[courseId].tsx    # Per-course 3D Babylon.js map
lib/
  supabase.ts           # Supabase client (reads EXPO_PUBLIC_ env vars)
store/
  useAuthStore.ts       # Auth state: user, isLoading, setUser, clearUser
  useStudyStore.ts      # Study session state
  useXpStore.ts         # XP/rank state
supabase/functions/     # Deno Edge Functions (Deno runtime, JSR imports)
  breakdown/            # Assignment AI breakdown → Claude task list JSON (stub)
  quiz-gen/             # MCQ generation for study checkpoints (stub)
  flashcards/           # Flashcard pair generation from notes (stub)
  award_xp/             # Record study session + award XP (stub — no DB writes yet)
```

## Data Flow

1. **Auth:** Supabase Auth (email/password) → `useAuthStore` holds session
2. **AI features:** Client calls Supabase Edge Function → Edge Function calls Claude API with `ANTHROPIC_API_KEY` secret → returns structured JSON to client
3. **XP:** All XP mutations go through the `award_xp` Edge Function, never direct DB writes from client. The client reads `xpEarned` and `newXpTotal` from the response and updates `useXpStore` — it never calculates XP itself.
4. **3D Map:** `map/[courseId].tsx` loads topics/exams from Supabase, renders Babylon.js scene with zone states (locked/in_progress/mastered) and boss encounters (exams)

## Database Key Concepts

- `topics.status`: `'locked' | 'in_progress' | 'mastered'` — drives 3D map zone visuals
- `exams.is_boss` / `exams.defeated` — drives boss encounter rendering on the map
- `xp_events` — append-only log; `users.xp_total` is the aggregate
- Rank tiers: Student (0) → Grinder (500) → Scholar (1,500) → Veteran (3,500) → Elite (7,000) → Legend (12,000)

## Environment Variables

```
# .env.local (client-side only)
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Supabase secrets (server-side only, never in client)
ANTHROPIC_API_KEY=sk-ant-...
```

## Current State

- Issue #3 (Study Mode UI) is complete: `study.tsx`, `useStudyStore`, `lib/supabase.ts`, and `award_xp` Edge Function are implemented on branch `feature/issue-3-study-mode-ui`
- `useStudyStore` has a two-phase reset: `endSession()` stops the timer but **preserves `elapsedSeconds`** so the summary modal can read it; `resetSession()` clears everything and is called only after the modal is dismissed
- Edge Functions (`breakdown`, `quiz-gen`, `flashcards`, `award_xp`) are all stubs — no DB writes yet
- `@babylonjs/react-native` is not yet in `package.json` — add it before working on the 3D map
- MVP targets McGill University (Phase 1); manual course input only (no portal integration)

## Claude Code Configuration

The superpowers plugin is enabled (`.claude/settings.json`). Use the available skills for structured workflows:
- `superpowers:brainstorming` — before building any new feature or component
- `superpowers:writing-plans` — before implementing multi-step tasks
- `superpowers:test-driven-development` — when implementing features or fixing bugs
- `superpowers:systematic-debugging` — when encountering bugs or unexpected behavior
