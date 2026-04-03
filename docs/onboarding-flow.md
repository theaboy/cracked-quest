# GetCracked — Onboarding Flow Spec
**Version 1.0 | April 2026**
**Mascot name: Cracked**
**Mascot asset: `assets/images/mascot.png`**

---

## Mechanic

Mascot speaks first, user responds by tapping an option or filling a field. Each screen is one question, one action. Never more than that. Feels like texting a friend, not filling a form.

Bubbles appear one at a time with a typing indicator (three animated dots) for 600ms before each bubble, 300ms gap between bubbles. Mascot floats gently on every screen (translateY, 8px range, 2s loop).

---

## Screen 0 — Splash

**Type:** Static landing screen (already built)

**Elements:**
- Mascot centered, upper half
- App name: **GetCracked**
- Tagline: **Study. Rank. Get Cracked.**
- Button 1 (primary): **GET STARTED** → navigates to Screen 1
- Button 2 (secondary): **I HAVE AN ACCOUNT** → navigates to Login

**Data collected:** none

---

## Screen 1 — The Greeting

**Mascot bubbles (in order):**
1. "Hey! I'm Cracked. Your study companion. 👋"
2. "Fair warning — I take studying very seriously. 😤"
3. "Before we start… what do I call you?"

**User action:**
- Single text input, large, centered below bubbles
- Placeholder: *Your first name*

**CTA button text:**
- Default: **"Nice to meet you, Cracked"**
- Once user types: **"Nice to meet you, [name]!"** (updates dynamically)

**Data collected:** `display_name`

---

## Screen 2 — University

**Mascot bubbles (in order):**
1. "Okay [name]! Which university are you at?"

**User action:** Tappable option cards (not a dropdown)

| Option | Notes |
|---|---|
| 🎓 McGill University | Highlighted / pre-selected — Phase 1 focus |
| 🏫 Concordia University | |
| 🏛️ Université de Montréal | |
| ➕ Other | Text input appears below when selected |

**CTA button text:** **"That's my school"**

**Data collected:** `university`

---

## Screen 3 — The Hook

**Type:** Narrative only — no user input

**Mascot bubbles (in order, with pauses):**
1. "Okay so here's the deal." *(pause 1s)*
2. "I'm going to help you turn studying into a game. You earn XP, you rank up, you beat bosses." *(pause 1.2s)*
3. "The bosses are your exams. And right now? They're winning. 😈" *(pause 1s)*
4. "Not for long."

**CTA button text:** **"Let's change that"**

**Data collected:** none

---

## Screen 4 — First Course

**Mascot bubbles (in order):**
1. "First mission: tell me your courses."
2. "Start with the one stressing you out the most. 😬"

**User action:**
- Text field 1: Course name — placeholder *e.g. Machine Learning*
- Text field 2: Course code — placeholder *e.g. COMP 551* — labelled **"Optional"**

**CTA button text:** **"That's the one"**

**Data collected:** `course_name`, `course_code`

---

## Screen 5 — Exam Date

**Mascot bubbles (in order):**
1. "When's the first exam for [course_name]?"

**User action:**
- Date picker, clean minimal style
- Small helper text below: *"No exam yet? Skip for now"* — tapping it skips to Screen 6 with `exam_date = null`

**CTA button text:** **"That's the deadline"**

**Data collected:** `exam_date` for current course

---

## Screen 6 — Topics

**Mascot bubbles (in order):**
1. "What topics does [course_name] cover? List them out."
2. "Don't overthink it. Even 'Week 1 stuff' works. 😄"

**User action:**
- Text input with **+ Add Topic** button
- Each confirmed topic appears as a purple chip tag below the input (`#9B6DFF` background, white text, pill shape, dismissible with ✕)
- Minimum 1 topic required to advance

**CTA button text:** **"Those are my topics"**

**Data collected:** `topics[]` for current course

---

## Screen 7 — More Courses?

**Mascot bubbles (in order):**
1. "Got it. [course_name] is locked in. 🔒" *(pause 1s)*
2. "Any other courses this semester?"

**User action:** Two option cards

| Option | Behaviour |
|---|---|
| **"Yes, add another"** | Loops back to Screen 4. Progress indicator at top increments. Max 6 loops. |
| **"That's all my courses"** | Advances to Screen 8 |

**Data collected:** triggers course loop or ends it

**Progress indicator:** Small pill at top showing *"Course 1 of X added"* — updates each loop

---

## Screen 8 — Study Style

**Mascot bubbles (in order):**
1. "One last thing before we set you up."
2. "How do you usually study?"

**User action:** Multi-select option cards (can select more than one, minimum 1)

| Option | Value |
|---|---|
| 📖 Reading notes | `notes` |
| 🃏 Flashcards | `flashcards` |
| ✍️ Practice problems | `practice` |
| 👥 Study groups | `groups` |
| 🎧 Videos / lectures | `videos` |

**CTA button text:** **"That's how I roll"**

**Data collected:** `study_preferences[]`

---

## Screen 9 — Deep Mode Warning

**Type:** Permission / consent screen

**Mascot bubbles (in order, with pauses):**
1. "Okay. One thing you should know about me." *(pause 1s)*
2. "When you're in Deep Mode, I take over your phone. 😤" *(pause 1s)*
3. "TikTok, Instagram, all of it — blocked." *(pause 0.8s)*
4. "You'll have to answer a question about your course to get a break." *(pause 1s)*
5. "Cool with that?"

**User action:** Two option cards

| Option | Value | Behaviour |
|---|---|---|
| **"Sounds good, I need this"** | `deep` | Sets default study mode to Deep Mode |
| **"Maybe later"** | `focus` | Sets default to Focus Mode, can change in settings |

**Data collected:** `default_study_mode`

---

## Screen 10 — The Payoff

**Type:** Completion / reward screen — no user input

**Mascot bubbles (in order, with pauses):**
1. "Alright [name]. You're all set. 🎓" *(pause 1s)*
2. "You've got [X] courses, [Y] topics, and your first exam in [Z] days." *(pause 1s)*
3. "Let's get you to the top. 👑"

**Reward animation sequence:**
1. After last bubble: gold **+50 XP** number bursts from center of screen, floats upward and fades
2. Purple badge appears: **"Onboarding Complete"**
3. CTA button fades in after animation completes (~1.5s)

**CTA button text:** **"Let's Get Cracked"**

**On tap:** Confetti or purple particle burst → navigate to Home screen (Progress Map tab)

**Data collected:** none — this screen triggers the Supabase write (see below)

---

## Data Write — Supabase

All collected data is held in a single local state object `onboardingData` throughout the flow. On Screen 10 CTA tap, write everything in one batch:

```js
onboardingData = {
  display_name: string,
  university: string,
  default_study_mode: 'deep' | 'focus',
  study_preferences: string[],
  courses: [
    {
      course_name: string,
      course_code: string | null,
      exam_date: string | null,      // ISO date string
      topics: string[]
    }
    // ...repeated for each course added
  ]
}
```

**Write sequence:**
1. `INSERT` into `users` → `display_name`, `university`, `default_study_mode`, `study_preferences`
2. For each course: `INSERT` into `courses` → returns `course_id`
3. For each course: `INSERT` into `topics` (bulk) using `course_id`
4. For each course with `exam_date`: `INSERT` into `exams` using `course_id`
5. Award 50 XP: call `award_xp({ user_id, amount: 50, source: 'onboarding' })`
6. Set `onboarding_complete = true` on user record
7. Navigate to Home

If any step fails, show an inline error on Screen 10 without navigating away. Do not write partial data.

---

## Navigation Rules

| Rule | Detail |
|---|---|
| Advance | Slide in from right |
| Go back | Slide out to right |
| Back button | Visible top-left on Screens 1–9. Hidden on Screen 0 and Screen 10. |
| Skip exam date | Allowed on Screen 5 — advances normally with `exam_date = null` |
| Loop limit | Screen 7 loop capped at 6 courses total |
| Keyboard | Auto-dismiss on CTA tap before navigating |

---

## Design Tokens (reference moodboard)

| Token | Value |
|---|---|
| Background | `#0C0C10` |
| Surface (cards) | `#1C1C22` |
| Border | `#2E2E3E` |
| Primary | `#9B6DFF` |
| Primary selected bg | `rgba(155, 109, 255, 0.1)` |
| Gold (XP) | `#F5C842` |
| Text primary | `#F0EFF8` |
| Text secondary | `#9896AA` |
| Font | Sora |
| Font weights | 800 buttons, 600 bubbles, 500 card labels, 400 helper text |
| Button border-radius | 50 (pill) |
| Card border-radius | 14 |
| Chip border-radius | 20 |
