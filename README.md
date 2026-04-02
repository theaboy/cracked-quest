# StudyQuest

**Turn university life into a game worth playing.**

StudyQuest is a mobile-first academic engagement platform that transforms studying, attending class, and collaborating into a gamified experience with real social currency and real rewards. Built for students who are already gamers — the gameplay just happens to make them better students.

## Why StudyQuest?

Students fight billion-dollar attention algorithms with willpower alone. Academic effort is invisible until exam day. Study resources are scattered across group chats and random PDFs. StudyQuest fixes all three.

## Core Pillars

### Study Mode
Distraction-blocking study sessions with AI-assisted learning. Focus Mode uses quiz checkpoints as intelligent friction. Deep Mode locks down the device entirely. Both reward sustained effort with XP.

### The Rank
A social reputation system powered by verified academic behavior — class attendance, study time, resource contributions, and collaboration. Rank tiers (Student → Legend) reset each semester. Leaderboards by course, campus, and friend group.

### The Commons
A course-specific knowledge layer. Upload lecture notes, past exams, and study guides. Form study groups. Discover campus events. Top contributors earn XP and social credibility.

## Key Features (MVP)

- **Course Setup** — Manual input of courses, exams, topics, and deadlines
- **Progress Map** — Visual timeline with Readiness Scores per exam
- **Focus Mode** — Timer-based study with quiz checkpoints on distraction
- **Deep Mode** — OS-level distraction blocking (iOS Screen Time / Android Accessibility)
- **Flashcard Engine** — Auto-generated from uploaded notes with spaced repetition
- **Assignment Breakdown** — AI-powered day-by-day task plans via Claude API
- **XP & Rank System** — Earn XP for attendance, study sessions, contributions
- **Course Leaderboard** — Compete with classmates on effort, not grades
- **Resource Commons** — Upload/download course materials, tagged by topic

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native + Expo (SDK 51+) |
| Navigation | Expo Router (file-based routing) |
| 3D Map | Babylon.js (@babylonjs/react-native) |
| Styling | NativeWind (Tailwind for React Native) |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) |
| Edge Functions | Supabase Edge Functions (Deno runtime) |
| AI | Claude API (Anthropic) — tutoring, flashcard gen, assignment breakdown |
| Notifications | Expo Notifications + Supabase triggers |
| State Management | Zustand |

## Target

**Phase 1:** McGill University students
**Phase 2:** University portal integration, study groups, attendance tracking, AI Tutor
**Phase 3:** Teacher dashboard, multi-university expansion

## Project Structure

```
cracked-quest/
├── PRD.md                  # Product Requirements Document
├── TECH_SPEC.md            # Technical Specification
├── README.md               # This file
├── app/                    # Expo Router screens
│   ├── (auth)/             # Login, signup, onboarding
│   ├── (tabs)/             # Main tab navigator
│   │   ├── index.tsx       # Progress Map (home)
│   │   ├── study.tsx       # Study Mode
│   │   ├── quests.tsx      # Assignment Breakdown
│   │   ├── commons.tsx     # Resource sharing
│   │   └── profile.tsx     # Rank + leaderboard
│   └── map/
│       └── [courseId].tsx   # Per-course 3D MMORPG map
├── components/             # Reusable UI components
├── lib/                    # Supabase client, API helpers
├── store/                  # Zustand state stores
├── supabase/
│   └── functions/          # Edge Functions (Deno)
│       ├── breakdown/      # Assignment AI breakdown
│       ├── quiz-gen/       # Quiz question generation
│       └── flashcards/     # Flashcard generation
└── assets/                 # 3D models, fonts, images
```

## Getting Started

```bash
# Clone the repo
git clone https://github.com/theaboy/cracked-quest.git
cd cracked-quest

# Install dependencies
npm install

# Start Expo dev server
npx expo start

# For 3D map (requires native modules)
npx expo prebuild
npx expo run:ios    # or run:android
```

## License

Confidential. All rights reserved.
