# StudyQuest — Issues Backlog

**Deadline:** Saturday April 5, 2026 (Demo Day)
**Team:** 2 developers, feature-based split
**Strategy:** Frontend-first. Backend stubs with mock data where needed. Polish what the audience sees.

---

## Priority Legend
- **P0** — Must have for Saturday demo. No demo without it.
- **P1** — Should have. Makes the demo compelling but survivable without.
- **P2** — Nice to have. Only if P0 and P1 are done.

---

## P0 — Demo Blockers (Wed-Thu)

### Issue #1: Onboarding Flow UI
**Priority:** P0
**Description:** Build the auth screens (login, signup) and onboarding flow. Onboarding collects: display name, university (hardcoded "McGill"), add courses (name, code, color), add topics per course, set exam dates. No real auth needed for demo — use a mock login that skips to onboarding or home.
**Acceptance Criteria:**
- [ ] Login screen with email/password fields + "Sign Up" link
- [ ] Signup screen with email/password/confirm
- [ ] Onboarding: step-by-step course setup wizard
- [ ] Data saved to Zustand store (Supabase integration later)
- [ ] Demo shortcut: button to skip auth and load pre-seeded data
**Dependencies:** None
**Estimate:** 4-6 hours

### Issue #2: Tab Navigation & Home Screen (Progress Map)
**Priority:** P0
**Description:** Set up the 5-tab layout with icons and styling. Home screen shows a 2D Progress Map per course: list of topics as nodes on a visual path, color-coded by status (locked/in_progress/mastered). Show Readiness Score per upcoming exam and countdown timer. Use NativeWind for styling.
**Acceptance Criteria:**
- [ ] Bottom tab bar with icons: Map, Study, Quests, Commons, Profile
- [ ] Home screen lists enrolled courses as cards
- [ ] Tap a course → shows topic path with status indicators
- [ ] Readiness Score displayed per exam (calculated from topic mastery %)
- [ ] Exam countdown ("Midterm in 8 days")
**Dependencies:** #1 (needs course data from onboarding or mock)
**Estimate:** 5-7 hours

### Issue #3: Study Mode UI (Focus Mode)
**Priority:** P0
**Description:** Timer-based study session screen. Student selects a course and topic, sets duration, starts timer. Timer counts up with elapsed time visible. "End Session" button with confirmation. On session end, show XP earned and update topic progress. No quiz checkpoint needed for demo — just the timer + XP award.
**Acceptance Criteria:**
- [ ] Course/topic selector before starting
- [ ] Active timer with large elapsed time display
- [ ] Pause/resume functionality
- [ ] End session → summary modal (time studied, XP earned)
- [ ] Session data saved to Zustand store
**Dependencies:** None
**Estimate:** 4-5 hours

### Issue #4: XP & Rank Display
**Priority:** P0
**Description:** XP bar and rank tier visible on home screen and profile. When XP changes, animate the bar. Show current tier with progress to next tier. This is the core game feel — must look polished.
**Acceptance Criteria:**
- [ ] XP progress bar component (current XP / next tier threshold)
- [ ] Rank tier badge (Student → Grinder → Scholar → etc.)
- [ ] XP change animation (bar fills, number ticks up)
- [ ] Visible on home screen header and profile tab
**Dependencies:** #3 (study sessions award XP)
**Estimate:** 3-4 hours

### Issue #5: Profile & Leaderboard Screen
**Priority:** P0
**Description:** Profile tab shows: username, rank tier, XP total, streak days, and a course leaderboard. For demo, leaderboard uses mock data (3-5 fake students with names and XP). Current user highlighted in the list.
**Acceptance Criteria:**
- [ ] Profile card: avatar placeholder, username, rank badge, XP, streak
- [ ] Course leaderboard with mock peers
- [ ] Current user highlighted in leaderboard
- [ ] Tier progress visualization
**Dependencies:** #4
**Estimate:** 3-4 hours

---

## P1 — Compelling Demo Features (Thu-Fri)

### Issue #6: Quiz Checkpoint Modal
**Priority:** P1
**Description:** When a study session hits a checkpoint (e.g. every 10 min), show a quiz modal with a single MCQ. For demo, use hardcoded questions per topic. Correct answer → "+10 XP" toast. Wrong answer → show encouragement + exam countdown.
**Acceptance Criteria:**
- [ ] Modal with question text, 4 answer buttons
- [ ] Correct/incorrect feedback with animation
- [ ] XP toast on correct answer
- [ ] Hardcoded question bank (5-10 questions per demo course)
**Dependencies:** #3
**Estimate:** 3-4 hours

### Issue #7: Assignment Breakdown (Quests Tab)
**Priority:** P1
**Description:** Quests tab shows assignments with AI-generated task breakdowns. For demo: student adds an assignment (title, description, due date, course), and a mock breakdown appears as a checklist of sub-tasks with dates. Completing a task awards XP. If Claude API is connected, generate real breakdowns; otherwise use hardcoded mock.
**Acceptance Criteria:**
- [ ] "Add Assignment" form (title, description, due date, course)
- [ ] Task breakdown displayed as a day-by-day checklist
- [ ] Checkboxes to mark tasks complete → XP award
- [ ] At least one mock breakdown pre-loaded for demo
**Dependencies:** None
**Estimate:** 4-5 hours

### Issue #8: The Commons — Resource Upload/Download
**Priority:** P1
**Description:** Commons tab shows course-filtered resources. Upload button lets students add a file (mock for demo — just title + type selector, no real file upload needed). List view of resources with download count and uploader name. Tapping shows a preview/summary.
**Acceptance Criteria:**
- [ ] Course filter tabs/selector at top
- [ ] Resource list: title, type badge, uploader, download count
- [ ] "Upload" button → form (title, type, course)
- [ ] Pre-seeded mock resources for demo courses
**Dependencies:** None
**Estimate:** 3-4 hours

### Issue #9: 3D Progress Map (Babylon.js)
**Priority:** P1
**Description:** Replace the 2D progress map with the 3D MMORPG map for one demo course (COMP 551). Zone nodes for topics, boss node for midterm exam, avatar on current topic. This is the wow factor for the demo. If Babylon.js native setup is blocked, fall back to a styled 2D map with animations.
**Acceptance Criteria:**
- [ ] 3D scene with isometric camera
- [ ] Topic zones as platforms with status-based coloring
- [ ] Path connecting zones (lights up progressively)
- [ ] Avatar mesh on current topic
- [ ] Boss node for exam with HP bar
- [ ] Fallback: animated 2D map if Babylon blocked
**Dependencies:** #2, Babylon.js installation fix
**Estimate:** 8-10 hours (high variance)

### Issue #10: Deep Mode UI
**Priority:** P1
**Description:** Deep Mode selection on study screen. When activated, show a "locked in" UI state — dark theme, no exit without quiz gate or penalty. For demo, this is visual only (no real OS blocking). Show the exit confirmation with rank penalty warning and exam countdown.
**Acceptance Criteria:**
- [ ] Deep Mode toggle on study screen
- [ ] "Locked in" visual state (dark overlay, lock icon, timer)
- [ ] Exit attempt → quiz gate modal or penalty confirmation
- [ ] Penalty confirmation shows: "You'll lose 20 XP. Midterm in 8 days."
**Dependencies:** #3, #6
**Estimate:** 3-4 hours

---

## P2 — Polish & Nice-to-Have (Only if time)

### Issue #11: Smart Notifications (Local)
**Priority:** P2
**Description:** Schedule local notifications: exam countdown, streak at risk (8pm), study session reminders. Use Expo Notifications for local scheduling — no server needed.
**Dependencies:** #2
**Estimate:** 2-3 hours

### Issue #12: Streak Tracking & Wellness Nudge
**Priority:** P2
**Description:** Track consecutive study days. Show streak counter with fire icon on home screen. Night before exam: "Big day tomorrow. Sleep > cramming." notification.
**Dependencies:** #3, #11
**Estimate:** 2 hours

### Issue #13: Supabase Backend Integration
**Priority:** P2
**Description:** Connect Zustand stores to real Supabase tables. Auth with Supabase Auth. Persist courses, topics, sessions, XP to PostgreSQL. This makes the app functional beyond the demo.
**Dependencies:** All frontend issues
**Estimate:** 6-8 hours

### Issue #14: Claude API Edge Functions (Real AI)
**Priority:** P2
**Description:** Implement the three Edge Functions with real Claude API calls: assignment breakdown, quiz generation, flashcard generation. Wire up to the frontend.
**Dependencies:** #7, #13
**Estimate:** 4-5 hours

### Issue #15: NativeWind Theming & Visual Polish
**Priority:** P2
**Description:** Consistent color scheme, typography, spacing across all screens. Dark mode support. App icon and splash screen with StudyQuest branding.
**Dependencies:** All P0 screens
**Estimate:** 3-4 hours

### Issue #16: Flashcard Deck UI
**Priority:** P2
**Description:** Swipeable flashcard component. Show front, tap to flip to back. Track cards reviewed. Spaced repetition scheduling is post-MVP.
**Dependencies:** None
**Estimate:** 3-4 hours

---

## Suggested Split (2 developers, Wed → Sat)

### Developer A (Frontend Core)
| Day | Issues |
|-----|--------|
| Wed | #1 Onboarding Flow, #2 Tab Nav & Home Screen |
| Thu | #4 XP & Rank Display, #5 Profile & Leaderboard |
| Fri | #10 Deep Mode UI, #15 Visual Polish |
| Sat | Bug fixes, demo prep, seed demo data |

### Developer B (Features & Wow Factor)
| Day | Issues |
|-----|--------|
| Wed | #3 Study Mode, #6 Quiz Checkpoint |
| Thu | #7 Assignment Breakdown, #8 Commons |
| Fri | #9 3D Map (or animated 2D fallback) |
| Sat | Bug fixes, demo prep, seed demo data |

---

## Demo Data Checklist
Before Saturday, seed the demo account with:
- [ ] Account: demo@studyquest.app
- [ ] Courses: COMP 551 (Machine Learning), MATH 223 (Linear Algebra)
- [ ] COMP 551: 6 topics, 2 exams (Midterm in 8 days, Final in 35 days)
- [ ] 3 topics mastered, 1 in progress, 2 locked
- [ ] Readiness Score: 58%
- [ ] XP: 1,240 (Grinder, close to Scholar)
- [ ] 3 mock peers on leaderboard
- [ ] 2 resources in COMP 551 Commons
- [ ] 1 assignment with AI breakdown loaded

---

## Blockers & Risks
- **Babylon.js install:** Requires Xcode fix (`xcodebuild -runFirstLaunch`). If unresolvable, fall back to animated 2D map for #9.
- **Expo Go vs. native:** Babylon.js needs `expo prebuild` (bare workflow). Study/quiz/profile screens work in Expo Go. Plan the demo flow accordingly — may need two builds.
- **Time pressure:** 3D map (#9) is high-impact but high-risk. Timebox to Friday. If not working by Friday 6pm, ship the 2D fallback.
