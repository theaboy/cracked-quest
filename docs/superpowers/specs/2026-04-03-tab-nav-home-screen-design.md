# Issue #2: Tab Navigation & Home Screen — Design Spec

## Context

The app has 5 tabs but they're all placeholders (except Study which is complete). The home screen needs to show course progress, XP, rank, and exam countdowns. This is the main screen users see after onboarding — it must feel like a game dashboard, not a planner.

Saturday demo deadline. Must be fast to build with mock data.

## Tab Bar

**Style:** Pill active state — active tab gets a purple pill highlight with icon + label. Inactive tabs show icon only.

**Icons:** Ionicons (from `@expo/vector-icons`, already available in Expo)

| Tab | Icon (Ionicons) | Label |
|-----|-----------------|-------|
| Home | `map-outline` / `map` | MAP |
| Study | `timer-outline` / `timer` | STUDY |
| Quests | `flag-outline` / `flag` | QUESTS |
| Commons | `grid-outline` / `grid` | COMMONS |
| Profile | `trophy-outline` / `trophy` | RANK |

**Colors:**
- Active: icon + label `#B99BFF`, pill background `rgba(155,109,255,0.15)`
- Inactive: icon `#5C5B6E`
- Tab bar background: `#141418`, top border `1px #2E2E3E`

## Home Screen Layout

Top to bottom, scrollable:

### 1. Header
- Left: "WELCOME BACK" label (`#5C5B6E`, 11px, uppercase, letter-spacing) + username (`#F0EFF8`, 24px, 800 weight)
- Right: XP count (`#F5C842`, 13px, bold) + rank badge pill (`#B99BFF` text, `rgba(155,109,255,0.15)` bg) + streak ("🔥 5 day streak", `#5C5B6E`)

### 2. XP Progress Bar
- Label row: current tier name (left) + "NEXT_TIER at X XP" (right), both `#5C5B6E` 10px
- Bar: 6px height, `#242430` track, purple gradient fill (`#6B3FD4` → `#9B6DFF`)
- Width = `xpTotal / nextTierThreshold * 100%`

### 3. Course Cards (one per enrolled course)

Each card:
- Background `#1C1C22`, border `1px #2E2E3E`, border-radius 20, left border 4px in course color
- **Layout:** flex row — main content (flex:1) + quick review button (far right, vertically centered)
- **Header:** course name (16px, bold, white) + code (12px, `#5C5B6E`) + "Currently: [topic name]" (12px, `#B99BFF`)
- **Exam badge:** top right, pill with countdown ("8 days"). Red tint if ≤7 days (`#FF5757` on `rgba(255,87,87,0.12)`), purple if >7 days
- **Zigzag topic path:** horizontal row of circular nodes alternating up/down (±16px margin-top), connected by angled lines (2px, rotated ±25deg)
  - Mastered: solid `#4EFFB4` fill, white ✓
  - In progress: `#9B6DFF` border, `rgba(155,109,255,0.1)` fill, purple glow shadow, numbered
  - Locked: `#2E2E3E` border, grey number
  - Boss (exam): slightly larger, `#FF5757` border, `rgba(255,87,87,0.08)` fill, 👹 emoji
  - Connectors between nodes match the status of the destination node
- **Readiness bar:** "Readiness" label left, percentage right. 4px bar, gold gradient if <70% (`#C49A1A` → `#F5C842`), green gradient if ≥70% (`#2a9970` → `#4EFFB4`)
- **Quick review button:** 44x44px, border-radius 12, tinted with course color (low opacity bg + border), ⚡ icon (will be swapped later). Vertically centered on far right of card.

### 4. Quick Review Flashcard Modal

Triggered by tapping ⚡ on a course card. Modal overlay:
- Course + topic label at top (10px, uppercase, `#5C5B6E`)
- Question text (16px, `#F0EFF8`, 600 weight)
- Answer area: blurred text on `#242430` surface, "TAP TO REVEAL" label. On tap, blur removes and answer shows.
- Pulls randomly from mastered + in-progress topics only
- For demo: hardcoded question bank (reuse `lib/questionBank.ts` if compatible, else simple inline array)
- No scoring, no XP — pure reinforcement

### 5. CTA Button
- "START STUDYING" — purple pill button, full width minus 32px margins
- Navigates to Study tab

## Data Sources

- **Courses/topics/exams:** `useCourseStore` (populated by onboarding or demo mode)
- **XP/rank/streak:** `useXpStore`
- **Username:** `useAuthStore`
- **Readiness score:** calculated per exam = average mastery of covered topics
- **Current topic:** first topic with status `in_progress`, or first `locked` if none in progress

## Files to Create/Modify

- **Modify:** `app/(tabs)/_layout.tsx` — redesign tab bar with Ionicons + pill active state
- **Rewrite:** `app/(tabs)/index.tsx` — full home screen with header, XP bar, course cards, zigzag path
- **Create:** `components/CourseCard.tsx` — reusable course card with zigzag path
- **Create:** `components/ZigzagPath.tsx` — topic node zigzag renderer
- **Create:** `components/FlashcardModal.tsx` — quick review flashcard popup
- **Create:** `components/XpProgressBar.tsx` — rank progress bar

## Rank Tier Thresholds (for XP bar)

| Tier | XP |
|------|-----|
| Student | 0 |
| Grinder | 500 |
| Scholar | 1,500 |
| Veteran | 3,500 |
| Elite | 7,000 |
| Legend | 12,000 |

## Verification

1. `npx tsc --noEmit` — clean compile
2. Load in Expo Go
3. Demo mode → home screen shows 2 course cards with correct data
4. Zigzag path reflects topic statuses (3 mastered, 1 in progress, 2 locked, 1 boss for COMP 551)
5. XP bar shows 1,240/1,500 progress toward Scholar
6. Tap ⚡ → flashcard modal opens with question from that course
7. Tap answer area → reveals answer
8. Tab bar shows 5 tabs with correct icons, pill highlight on active tab
9. "START STUDYING" navigates to Study tab
