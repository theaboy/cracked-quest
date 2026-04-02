# StudyQuest - Technical Specification

**Version 1.0 | April 2026 | MVP Build — McGill University**

## 1. Architecture Overview

StudyQuest is a React Native mobile application with a serverless backend hosted on Supabase. All AI calls are routed through Supabase Edge Functions to keep API keys off the client. The 3D progression map is rendered using Babylon.js via its dedicated React Native package.

| Layer | Technology |
|-------|-----------|
| Mobile app | React Native + Expo (SDK 51+) |
| Navigation | Expo Router (file-based routing) |
| 3D Map | @babylonjs/react-native + @babylonjs/core |
| Styling | NativeWind (Tailwind for React Native) |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) |
| Edge Functions | Supabase Edge Functions (Deno runtime) |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| Push Notifications | Expo Notifications + Supabase triggers |
| File Storage | Supabase Storage (PDFs, images) |
| State Management | Zustand |

## 2. Project Structure

```
studyquest/
├── app/                    # Expo Router screens
│   ├── (auth)/             # Login, signup, onboarding
│   ├── (tabs)/             # Main tab navigator
│   │   ├── index.tsx       # Progress Map (home)
│   │   ├── study.tsx       # Study Mode
│   │   ├── quests.tsx      # Assignment Breakdown
│   │   ├── commons.tsx     # Resource sharing
│   │   └── profile.tsx     # Rank + leaderboard
│   └── map/                # 3D Map screen (Babylon.js)
│       └── [courseId].tsx   # Per-course MMORPG map
├── components/             # Reusable UI components
├── lib/                    # Supabase client, API helpers
├── store/                  # Zustand state stores
├── supabase/
│   └── functions/          # Edge Functions
│       ├── breakdown/      # Assignment AI breakdown
│       ├── quiz-gen/       # Quiz question generation
│       └── flashcards/     # Flashcard generation
└── assets/                 # 3D models, fonts, images
```

## 3. Database Schema (Supabase / PostgreSQL)

All tables include `created_at TIMESTAMPTZ DEFAULT now()` and `updated_at`. Row Level Security (RLS) enabled on all tables.

### users
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | Supabase auth.users ref |
| username | TEXT UNIQUE | Display name |
| university | TEXT | 'McGill' for Phase 1 |
| xp_total | INTEGER DEFAULT 0 | Semester XP |
| rank_tier | TEXT DEFAULT 'Student' | Computed from xp_total |
| streak_days | INTEGER DEFAULT 0 | Consecutive study days |
| last_study_date | DATE | For streak calculation |

### courses
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK → users | Owner |
| name | TEXT | e.g. 'COMP 551 ML' |
| code | TEXT | e.g. 'COMP551' |
| color | TEXT | Hex for UI theming |

### topics
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| course_id | UUID FK → courses | |
| name | TEXT | e.g. 'Linear Regression' |
| order_index | INTEGER | Position in the map path |
| status | TEXT DEFAULT 'locked' | 'locked' \| 'in_progress' \| 'mastered' |
| mastery_score | INTEGER DEFAULT 0 | 0-100 from quiz results |

### exams
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| course_id | UUID FK → courses | |
| name | TEXT | e.g. 'Midterm 1' |
| exam_date | DATE | |
| topic_ids | UUID[] | Array of covered topic IDs |
| is_boss | BOOLEAN DEFAULT true | Renders as boss on 3D map |
| defeated | BOOLEAN DEFAULT false | True after exam is marked done |

### assignments
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| course_id | UUID FK → courses | |
| user_id | UUID FK → users | |
| title | TEXT | |
| description | TEXT | |
| due_date | DATE | |
| status | TEXT DEFAULT 'active' | 'active' \| 'submitted' \| 'overdue' |

### tasks (assignment sub-tasks)
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| assignment_id | UUID FK → assignments | |
| title | TEXT | AI-generated sub-task |
| due_day | DATE | Suggested completion date |
| duration_min | INTEGER | Estimated minutes |
| completed | BOOLEAN DEFAULT false | |
| order_index | INTEGER | Display order |

### study_sessions
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK → users | |
| topic_id | UUID FK → topics | |
| mode | TEXT | 'focus' \| 'deep' |
| duration_seconds | INTEGER | Actual time studied |
| xp_earned | INTEGER | |
| quiz_correct | INTEGER DEFAULT 0 | |
| quiz_total | INTEGER DEFAULT 0 | |

### xp_events
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK → users | |
| amount | INTEGER | XP awarded (can be negative) |
| source | TEXT | 'study_session' \| 'quiz' \| 'assignment' \| 'attendance' \| 'resource_upload' \| 'resource_download' |
| ref_id | UUID | ID of triggering entity |

### resources
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| course_id | UUID FK → courses | |
| uploader_id | UUID FK → users | |
| title | TEXT | |
| type | TEXT | 'notes' \| 'slides' \| 'past_exam' \| 'summary' |
| storage_path | TEXT | Supabase Storage key |
| download_count | INTEGER DEFAULT 0 | |
| ai_summary | TEXT | Claude-generated preview |

## 4. Supabase Edge Functions

All AI calls go through Edge Functions. `ANTHROPIC_API_KEY` stored as a Supabase secret.

### breakdown (Assignment AI)
Calls Claude to return a structured JSON task list for assignment breakdown.

### quiz-gen (Quiz Checkpoint Generator)
Generates a single MCQ from course material for study mode checkpoints.

### flashcard-gen
Generates flashcard pairs from uploaded resource content.

## 5. 3D MMORPG Progression Map

Built with Babylon.js (`@babylonjs/react-native`). Each course has its own map with zone nodes (topics) and boss encounters (exams).

### Zone Visual States
| State | Visual | Trigger |
|-------|--------|---------|
| locked | Dark grey platform, no emission | topic.status = 'locked' |
| in_progress | Amber platform, glow ring particles | topic.status = 'in_progress' |
| mastered | Full colour, green shimmer, flag mesh | topic.status = 'mastered' |
| boss (upcoming) | 2x scale, enemy GLB, red point light | exam.defeated = false |
| boss (defeated) | Cracked texture, trophy GLB, gold particles | exam.defeated = true |

### Performance Targets
- Polygon budget: under 8,000 triangles total
- Use `InstancedMesh` for repeated zone platforms
- No real-time shadows for MVP
- Target 30fps on iPhone 12 / Pixel 5
- Freeze inactive meshes

## 6. Deep Mode Implementation

### iOS
- Guided Screen Time setup (one-time)
- Background notifications every 2 min during active session
- AppState listener detects background → fires notification → quiz gate on return

### Android
- UsageStatsManager for foreground app detection
- Foreground service polling every 3 seconds
- High-priority notification when blocked app detected
- User-configurable blocklist

## 7. Authentication Flow

Supabase Auth with email/password for MVP.

Onboarding: Sign up → Display name + university → Add courses → Add topics → Set exam dates → Progress Map

## 8. XP and Rank Engine

XP awarded server-side only via Edge Functions.

### Rank Tier Thresholds
| Tier | XP Required |
|------|------------|
| Student | 0 |
| Grinder | 500 |
| Scholar | 1,500 |
| Veteran | 3,500 |
| Elite | 7,000 |
| Legend | 12,000 |

## 9. Environment Variables

```
# .env.local (client)
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Supabase secrets (server only)
ANTHROPIC_API_KEY=sk-ant-...
```

---
*StudyQuest Technical Spec v1.0 — Internal Document*
