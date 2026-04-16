<h1 align="center">StudyQuest</h1>

<p align="center">
  <strong>Turn university life into a game worth playing.</strong><br/>
  A mobile-first, MMORPG-styled academic engagement platform for students who are already gamers — the gameplay just happens to make them better students.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=flat&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Expo-SDK%2054-000020?style=flat&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Babylon.js-3D-BB4B44?style=flat&logo=babylondotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/LLM-AI-9B6DFF?style=flat" />
  <img src="https://img.shields.io/badge/Phase%201-McGill-red?style=flat" />
</p>

<p align="center">
  <img src="assets/crack-mascot.png" width="180" alt="Crack — the StudyQuest mascot" />
</p>

<p align="center"><em>Meet Crack — a purple slime in a graduation cap. Your study companion.</em></p>

---

## What is StudyQuest?

StudyQuest is a mobile app that treats your semester like a game campaign. Every course is a map. Every exam is a boss. Every lecture, study session, and note upload earns XP that feeds a visible social rank — **Student → Grinder → Scholar → Veteran → Elite → Legend** — that resets every semester so nobody coasts on old glory.

It is not a productivity app with a points skin on top. It is designed from the ground up as *a game*, so that the gameplay loop is what keeps students coming back — and the side effect is that they study more, attend class more, and share resources more.

---

## Why we built it

Three things are broken for university students right now:

1. **Distraction is engineered.** TikTok and Instagram spend billions optimizing attention capture. A student with a phone and willpower is in a fight they cannot win alone.
2. **Effort is invisible.** Attending every class and grinding the readings produces no visible signal until grades arrive weeks later. There's no feedback loop, so motivation collapses.
3. **Resources are fragmented.** Lecture notes, past exams, and study tips live in scattered group chats and random Google Drives. Course-wide knowledge never pools.

StudyQuest fixes all three with one mechanic: turn the behavior you want into a game, and make the score social.

---

## The three pillars

### 🎯 Study Mode — distraction-blocking, AI-assisted focus

**Focus Mode (light):** Timer-based session. When the student tries to leave to scroll, a quiz checkpoint fires — one multiple-choice question drawn from their actual course material. Correct = 5-minute break. Incorrect = redirected back with exam countdown and Readiness Score.

**Deep Mode (locked):** Full OS-level distraction block via iOS Screen Time and Android Accessibility Service. Exits cost rank points unless earned through a quiz.

**AI Tutor:** Context-aware chat powered by an LLM. Pre-loaded with course material, current topic, and exam timeline. Pushes back, asks follow-ups, prompts students to explain concepts — closer to a study partner than a homework cheat.

### 🏆 The Rank — a reputation system for academic effort

Effort becomes visible. XP flows in for the stuff that actually moves the needle:

| Action | XP |
|---|---|
| Attending a class (verified) | **+50** |
| 20+ min study session | **+30** |
| Quiz checkpoint correct | **+10** |
| Topic mastery check passed | **+40** |
| Uploading a resource | **+25** (plus 5/download from peers) |
| Joining + completing a study group | **+35** |
| Asking a question in class (prof-verified) | **+60** |
| Assignment submitted before deadline | **+20** |
| 7-day study streak | **2× multiplier** |

Leaderboards per course, per campus, and per friend group.

### 📚 The Commons — a course-specific knowledge layer

Students upload lecture notes, past exams, and study guides. Everything is tagged by course and topic. Top contributors earn XP *and* social credibility. Form study groups. Discover campus events. The pool of class knowledge stops leaking into random group chats.

---

## How it works

```
   ┌──────────────────────┐
   │  React Native + Expo │   Mobile client (iOS/Android)
   │  NativeWind · Zustand│
   │  Expo Router v6      │
   └──────────┬───────────┘
              │
              │  Authenticated requests
              ▼
   ┌──────────────────────┐
   │      Supabase        │   Postgres · Auth · Storage · Realtime
   │   (single backend)   │
   └─────┬──────────┬─────┘
         │          │
         │          │  AI calls routed server-side only
         │          ▼
         │  ┌────────────────────┐
         │  │  Edge Functions    │   Deno runtime
         │  │  • breakdown       │   Assignment → day-by-day plan
         │  │  • quiz-gen        │   Lecture material → checkpoints
         │  │  • flashcards      │   Notes → spaced-repetition deck
         │  │  • award_xp        │   Secure XP writer
         │  └─────────┬──────────┘
         │            │
         │            ▼
         │    ┌───────────────┐
         │    │   LLM API     │   reasoning-grade model
         │    │   (server-    │   called only from the
         │    │    side only) │   Edge Function tier
         │    └───────────────┘
         │
         ▼
   ┌──────────────────────┐
   │  Babylon.js native   │   3D MMORPG-style progression map
   │  (@babylonjs/react-  │   per course
   │  native)             │
   └──────────────────────┘
```

**Architecture rules we do not break:**

- **The client never calls the LLM directly.** Every AI call is brokered by a Supabase Edge Function so the API key never leaves the server.
- **XP is server-awarded.** A dedicated `award_xp` Edge Function is the only path that can mutate XP — no client can forge progression.
- **The 3D map requires native modules.** Babylon.js on RN means prebuild is required; the app will not render the map in Expo Go.

---

## Tech stack

| Layer | Tool |
|---|---|
| Mobile runtime | React Native 0.81 + Expo SDK 54 (New Architecture enabled) |
| Language | TypeScript |
| Navigation | Expo Router v6 (file-based) |
| Styling | NativeWind v4 (Tailwind for RN) |
| State | Zustand v5 |
| 3D progression map | Babylon.js via `@babylonjs/react-native` |
| Backend + Auth + DB + Storage | Supabase (Postgres) |
| AI gateway | Supabase Edge Functions (Deno) → hosted LLM (swappable provider) |
| Notifications | Expo Notifications |

---

## Design system

Dark, neon, game-first. Feels like opening Clash Royale, not a planner.

| Token | Value |
|---|---|
| Background | `#0C0C10` |
| Surface | `#141418` / `#1C1C22` |
| Primary (purple) | `#9B6DFF` |
| Gold | `#F5C842` |
| Success | `#4EFFB4` |
| Danger | `#FF5757` |
| Display font | Sora |
| Body font | DM Sans |
| Buttons | Pill-shaped, uppercase, 0.8 letter-spacing |

Full tokens in `lib/theme.ts`. Mascot and visual language in `assets/`.

---

## Getting started

```bash
# Clone
git clone https://github.com/theaboy/cracked-quest.git
cd cracked-quest

# Install
npm install

# Dev (no 3D map — quick iteration in Expo Go)
npx expo start

# Dev with 3D map (requires native build)
npx expo prebuild
npx expo run:ios          # or: npx expo run:android

# Type-check
npx tsc --noEmit
```

**Supabase Edge Functions:**

```bash
supabase functions deploy breakdown
supabase functions deploy quiz-gen
supabase functions deploy flashcards
supabase functions deploy award_xp
```

You'll need a Supabase project with the schema in `supabase/` applied and an LLM provider API key configured as a Function secret.

---

## Project structure

```
app/                    Expo Router screens
  (auth)/               Login, signup, onboarding
  (tabs)/               Main tab nav
    index.tsx           Progress Map (home)
    study.tsx           Study Mode
    quests.tsx          Assignment breakdown
    commons.tsx         Resource sharing
    profile.tsx         Rank + leaderboard
  map/[courseId].tsx    Per-course 3D MMORPG map
components/             Reusable UI
lib/                    Supabase client, theme, API helpers
store/                  Zustand stores
supabase/functions/     Edge Functions (breakdown, quiz-gen, flashcards, award_xp)
assets/                 Mascot, 3D models, fonts, images
PRD.md                  Full product requirements
TECH_SPEC.md            Architecture, schema, Edge Function contracts
CLAUDE.md               Internal dev-tool memory file (not user-facing)
```

---

## Roadmap

- **Phase 1 (now)** — McGill students. Manual course setup, core gameplay loop, AI tutor, Commons MVP.
- **Phase 2** — OAuth into university portals, verified attendance, study-group matchmaking, richer AI tutor flows.
- **Phase 3** — Teacher dashboards, multi-university expansion, cross-campus leaderboards.

---

## Team

Built at McGill by [theaboy](https://github.com/theaboy) and [William](https://deathnote21306.github.io/).

---

## License

Confidential. All rights reserved.
