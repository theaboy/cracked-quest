# CLAUDE.md — GetCracked Project Memory

## Project Overview
GetCracked is a mobile-first gamified academic engagement app targeting McGill University students (Phase 1). It turns studying, attending class, and collaborating into an MMORPG-style game with XP, rank tiers, leaderboards, and a 3D progression map.

## Mascot
- **Name:** Crack — a cute purple slime with round glasses and a graduation cap
- **Image:** `assets/crack-mascot.png`
- **Usage:** Login screen, onboarding (speech bubbles — conversational flow like Duolingo), key moments

## Design System (from moodboard v1.0)
- **Theme file:** `lib/theme.ts`
- **Bg:** `#0C0C10` | **Surface:** `#141418` / `#1C1C22` | **Border:** `#2E2E3E`
- **Primary:** `#9B6DFF` (purple) | **Light:** `#B99BFF` | **Dark:** `#6B3FD4`
- **Gold:** `#F5C842` | **Success:** `#4EFFB4` | **Danger:** `#FF5757`
- **Text:** `#F0EFF8` (primary) / `#9896AA` (secondary) / `#5C5B6E` (muted)
- **Buttons:** Pill-shaped (borderRadius 50), uppercase, letter-spacing 0.8
- **Fonts:** Sora (display), DM Sans (body) — system fonts as fallback
- **Mood:** "Feels like opening a game, not a planner" — inspired by Clash Royale, Runify, Duolingo

## Key Documents
- `PRD.md` — Full product requirements (features, game design, phase roadmap)
- `TECH_SPEC.md` — Technical specification (architecture, DB schema, Edge Functions, 3D map details)
- `README.md` — Project overview and setup instructions

## Tech Stack
- **Mobile:** React Native + Expo (SDK 51+), Expo Router (file-based routing)
- **3D Map:** Babylon.js (@babylonjs/react-native) — MMORPG-style progression map
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **State:** Zustand
- **Backend/DB:** Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **AI:** Anthropic Claude API via Supabase Edge Functions (Deno runtime)
- **Notifications:** Expo Notifications
- **Language:** TypeScript throughout

## Architecture Rules
- **Never call Claude API from the client.** All AI calls go through Supabase Edge Functions.
- **ANTHROPIC_API_KEY is a Supabase secret**, never in app bundle or .env.local.
- **Client env vars** use `EXPO_PUBLIC_` prefix (Supabase URL and anon key only).
- **RLS enabled on all tables.** Users can only read/write their own data except leaderboard queries.
- **XP is awarded server-side only** via the `award_xp` Edge Function to prevent manipulation.
- **Babylon.js requires native modules.** Must run `npx expo prebuild` (bare workflow). No expo-gl needed — Babylon uses JSI.

## Project Structure
```
app/                    # Expo Router screens
  (auth)/               # Login, signup, onboarding
  (tabs)/               # Tab navigator: home, study, quests, commons, profile
  map/[courseId].tsx     # Per-course 3D map
components/             # Reusable UI components
lib/                    # Supabase client, API helpers
store/                  # Zustand stores
supabase/functions/     # Edge Functions: breakdown, quiz-gen, flashcards
assets/                 # 3D models (GLB), fonts, images
```

## Database Tables
users, courses, topics, exams, assignments, tasks, study_sessions, xp_events, resources — see TECH_SPEC.md for full schema.

## Three Core Pillars
1. **Study Mode** — Focus Mode (light, quiz checkpoints) + Deep Mode (OS-level blocking)
2. **The Rank** — XP system, 6 rank tiers (Student→Legend), course/campus leaderboards
3. **The Commons** — Course resource sharing, study groups, campus events

## MVP Scope
- Course setup (manual input)
- Progress Map with Readiness Score
- Focus Mode + Deep Mode
- Flashcard generation from uploaded notes
- Assignment Breakdown Engine (Claude API)
- Basic XP/rank system + course leaderboard
- Resource sharing Commons

## Current Phase
Phase 1 — MVP targeting McGill University. Manual course input only (no portal integration).

## Build Commands
```bash
npm install                  # Install dependencies
npx expo start               # Dev server (Expo Go — no 3D)
npx expo prebuild             # Generate native projects (required for Babylon.js)
npx expo run:ios              # Run on iOS with native modules
npx expo run:android          # Run on Android with native modules
```

## Demo Setup
- Distributed via Expo Go with `npx expo start --tunnel`
- Pre-seed demo account with McGill courses (COMP 551, MATH 223)
- Demo QR code on a slide as backup
