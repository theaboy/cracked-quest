# StudyQuest - Product Requirements Document

**Version 1.0 | April 2026 | Target: McGill University (Phase 1)**

## Vision

StudyQuest is a mobile-first academic engagement platform built on a single core insight: students are already gamers. Rather than fighting that instinct, the app turns university life—attending class, studying, collaborating—into a game with real stakes, real social currency, and real rewards.

The goal is not to be a productivity tool. It is to be the game students want to play, where the gameplay happens to make them better students.

## The Problem

### Distraction is engineered
Social media platforms spend billions optimizing for attention capture. Students studying alone with their phones are fighting billion-dollar algorithms with willpower alone.

### Academic work is invisible
There is no feedback loop between effort and recognition until exam results arrive weeks later. A student who attends every class and studies diligently has no way to signal this to peers, professors, or themselves.

### Resources are fragmented
Lecture notes, past exam topics, and study tips exist in scattered group chats and PDFs. There is no central layer where students in the same class pool knowledge.

## Target User

**Primary:** University students aged 17-25 enrolled in degree programs with structured coursework and exam schedules. Initial rollout targets McGill University students.

**Secondary:** University professors and teaching assistants who want visibility into class engagement.

## Three Core Pillars

| Pillar | Description |
|--------|-------------|
| **Study Mode** | A distraction-blocking, AI-assisted study environment with intelligent friction when students try to leave. |
| **The Rank** | A social reputation system based on verified academic behavior: class attendance, study time, resource contributions, collaboration. |
| **The Commons** | A course-specific knowledge-sharing layer where students upload and discover resources, form study groups, and find campus events. |

## Feature Specifications

### 1. Course & Schedule Intelligence

The app connects to the student's university portal (via MCP integration where available, or manual input) and structures:
- Enrolled courses for the current semester
- Exam dates, weights, and topic breakdowns per exam
- Assignment deadlines
- Course syllabi

For each course, the app builds a **Progress Map**: a visual timeline showing topics, study progress, and exam countdown. Topics are marked as Not Started, In Progress, or Mastered based on study activity.

A **Readiness Score** is calculated per exam: a weighted combination of topics covered, time studied per topic, and days remaining. When the score drops into a danger zone, the app triggers escalating nudges.

*McGill-specific note: No official MCP currently exists for McGill's myCourses portal. Phase 1 uses manual input with a structured template. Phase 2 targets OAuth integration.*

### 2. Study Modes

#### Focus Mode (light)
Timer-based session. The student sets a duration. Social media apps remain accessible, but leaving the phone triggers a quiz checkpoint—a single multiple-choice question drawn from course material. Correct answer: 5-minute break window. Incorrect answer: redirected to the app with exam countdown and Readiness Score.

During Focus Mode, if the student opens an external AI assistant (Claude, ChatGPT) and navigates away while a response is loading, a notification fires: "Your answer is ready. Stay in it."

#### Deep Mode (locked)
Full distraction block. Social media apps are intercepted at the OS level:
- **iOS:** Screen Time API + Focus mode configuration
- **Android:** UsageStatsManager + Accessibility Service

Exit routes: (1) answer a quiz question correctly — unlocks 5 minutes, (2) end the session manually — incurs rank point penalty and shows a confirmation prompt with exam countdown, (3) emergency override — no penalty, flagged in session history.

### 3. Study Content & AI Tutor

- **Flashcard Decks:** auto-generated from uploaded course material or manually created; spaced repetition scheduling
- **AI Tutor:** context-aware chat powered by Claude (Anthropic API), pre-loaded with course material, current topic, and exam timeline; pushes back, asks follow-up questions, prompts students to explain concepts
- **Lecture Note Uploads:** PDF/image upload → text extraction → topic structuring → flashcard and quiz generation
- **Topic Mastery Check:** optional 5-question assessment after each study session; updates Progress Map and Readiness Score

### 4. The Rank — Gamification System

The Rank is a visible, social score reflecting overall academic engagement. It measures effort and consistency, not outcomes.

#### XP Sources

| Action | XP |
|--------|-----|
| Attending a class (verified) | +50 XP |
| Completing a study session (>20 min) | +30 XP |
| Answering a quiz checkpoint correctly | +10 XP |
| Completing a Topic Mastery Check | +40 XP |
| Uploading resources shared by others | +25 XP + 5/download |
| Joining and completing a study group session | +35 XP |
| Asking a question in class (professor-verified) | +60 XP |
| Submitting an assignment before deadline | +20 XP |
| 7-day study streak bonus | 2x XP multiplier |

#### Rank Tiers
Student → Grinder → Scholar → Veteran → Elite → Legend

Each tier unlocks cosmetic rewards: profile badges, custom app themes, trophy display slots. Tiers reset each semester.

#### Leaderboards
- **Course leaderboard:** rank among students in the same class
- **Campus leaderboard:** all users at the same institution
- **Friend groups:** private leaderboards

Leaderboards are based on XP earned in the current semester only. Profile is visible to other students and serves as a credibility signal for group project recruitment.

### 5. Attendance Verification

Students log class attendance through stacked verification methods:
- **Location check:** device detected within a defined radius of the building at scheduled class time
- **Photo proof:** student snaps a photo from inside the classroom; image analysis confirms classroom environment
- **Professor QR code:** professor displays a QR code at class start; scanning gives full XP verification with a bonus multiplier

### 6. Assignment Breakdown Engine

When a student adds an assignment, the AI generates a day-by-day task plan:
- Sub-tasks: e.g. "Find 3 sources", "Write introduction", "Draft section 2", "Review and edit"
- Suggested start date based on due date and estimated effort
- Daily micro-tasks synced to Google Tasks or Apple Reminders

Students can accept the breakdown, drag tasks to reschedule, or ask the AI to regenerate with constraints. Completing daily micro-tasks awards XP. Submitting before the due date awards a bonus.

### 7. The Commons — Resource Sharing

#### Resources Tab
Course-specific uploads: lecture notes, slides, past exam topics, study guides, formula sheets. Students tag by topic; downloads are tracked; popular resources surface first. Uploaders earn XP per download. AI generates a summary of any uploaded document for preview.

#### Study Groups Tab
Students create or join study groups for specific courses or exams. Groups have a scheduled time, location or video link, and topic focus. Members get reminders. Attending a study group session awards XP to everyone.

#### Events Tab
Campus events relevant to students: hackathons, club fairs, conferences, networking events, academic competitions. Populated by university calendar scraping, Instagram scraping of student organizations, and manual submissions. *(Phase 2 feature — UI present at launch, data layer in Phase 2.)*

### 8. Smart Notifications

- **Exam countdown:** 7 days, 3 days, 1 day before exam with Readiness Score
- **Assignment approaching:** 3 days and 1 day before deadline with task breakdown link
- **Streak at risk:** 8pm notification if no study session that day and active streak exists
- **Class reminder:** 30 minutes before any class with one-tap check-in button
- **Study group starting:** 15 minutes before a joined study group
- **Wellness nudge:** the night before a major exam — "Big day tomorrow. Sleep > cramming. You've got this."

### 9. Teacher Dashboard (Optional Module)

Read-only dashboard for professors showing:
- Attendance rate per class session (aggregated, anonymous unless students opt in)
- Average Readiness Scores ahead of each exam
- Resource sharing activity and study group formation
- Top contributors in the course Commons

Professors can push announcements and trigger QR check-ins. Individual student study time and quiz performance remains private.

## Game Design Principles

- **Progress must always be visible.** XP bars, readiness scores, streak counters, and leaderboard deltas must be front and center on the home screen.
- **Friction is a feature in study mode.** Distraction-blocking checkpoints must feel like mini-challenges, not punishments.
- **Rewards must feel earned, not automatic.** Showing up to class earns XP. Opening the app does not.
- **Social comparison should feel motivating, not demoralizing.** Show rank relative to peers at similar XP levels, not just a raw global list.
- **The AI is a tutor, not a crutch.** The AI Tutor should ask questions as often as it answers them.

## MVP Scope & Phase Roadmap

### MVP — Launch Features
- Course setup (manual input)
- Progress Map with exam countdown and Readiness Score
- Focus Mode with quiz checkpoints
- Deep Mode (OS-level distraction blocking — iOS Screen Time / Android Accessibility)
- Flashcard generation from uploaded notes
- Assignment Breakdown Engine (AI-powered via Claude API)
- Basic XP system and rank tiers
- Course leaderboard
- Resource sharing Commons (upload/download)

### Phase 2
- University portal integration (McGill myCourses OAuth)
- Study groups with XP verification
- Attendance tracking (location + photo)
- Campus events feed (scraping + manual submissions)
- AI Tutor full integration (Claude with course context)
- Push to Google Tasks / Apple Reminders
- Campus-wide leaderboard

### Phase 3
- Teacher dashboard
- Friend groups and private leaderboards
- Wellness and sleep reminders tied to exam schedule
- Multi-university expansion beyond McGill

## Open Questions

- **Monetization model:** freemium (Free tier + Pro with Deep Mode and AI Tutor) vs. institutional licensing to universities vs. both?
- **Deep Mode scope:** true OS-level blocking requires significant platform permissions. Phase 1 may need to use guided Screen Time setup rather than full programmatic control.
- **McGill integration:** no public MCP for myCourses currently available. Phase 1 is fully manual; Phase 2 requires OAuth negotiation with McGill IT.
- **Anti-gaming XP:** how to handle spoofed location check-ins, friends checking each other into study groups, etc.
- **Privacy:** attendance data handling under Quebec Law 25 / PIPEDA student data provisions.

---
*StudyQuest PRD v1.0 — Confidential*
