# Issue #10: Deep Mode UI — Design Spec

## Context

The study screen already supports Focus and Deep mode selection, a timer, and quiz checkpoints. Deep Mode needs a distinct visual identity — it should feel like entering a boss arena, not just a different timer. For the demo, no real OS-level blocking — just visual and UX changes.

## Entry Flow

1. User selects "Deep" mode on study setup screen and taps Start Session
2. **Transition screen:** Full-screen black background, Crack serious mode video plays (`assets/crack-deep-mode.mp4`), "Lock in" speech bubble appears on top of mascot (same ChatBubble component from onboarding with purple border and spike pointing down). Video loops once, transition auto-advances after ~3 seconds.
3. Screen transitions to Deep Mode active session UI

## Deep Mode Active Session

**Visual changes from Focus Mode:**
- Background: deeper dark with vignette overlay (radial gradient from transparent center to black edges)
- Lock icon in header next to mode label ("DEEP MODE 🔒")
- Timer: larger, more dramatic — pulsing purple glow shadow animation on the timer text
- Overall feel: boss arena — darker, more intense, minimal distractions

**Functional — same as Focus Mode:**
- Timer counting up (tick logic from useStudyStore)
- Pause/resume available
- Quiz checkpoint button available
- XP awarded on session end via award_xp Edge Function

## Exit Flow

When user taps "End Session" during Deep Mode, show an exit gate instead of immediately ending:

### Exit Gate Modal

Two paths presented side by side or stacked:

**Path 1 — Quiz Gate (no penalty):**
- "Answer a question to earn a break"
- Shows a quiz question from the current topic
- Correct answer → session pauses, 5-minute break timer starts, toast "5 min break earned!"
- Wrong answer → modal stays, shows encouragement + exam countdown, user can try another question or choose penalty exit
- After break timer ends → soft notification "Break over. Back to it?"

**Path 2 — Penalty Escape:**
- Straightforward modal, no mascot
- Title: "End Deep Mode?"
- Body: "-20 XP penalty. Your midterm is in 8 days."
- Days calculated from nearest future undefeated exam for the current topic's course
- Two buttons:
  - "Stay" (primary purple pill) — dismisses modal, resumes session
  - "Leave (-20 XP)" (outline/danger style) — ends session, deducts 20 XP, goes to summary

## Files to Create/Modify

- **Modify:** `app/(tabs)/study.tsx` — add Deep Mode visual state, exit gate logic, break timer
- **Create:** `components/DeepModeOverlay.tsx` — vignette overlay, pulsing glow, lock icon header
- **Create:** `components/ExitGateModal.tsx` — quiz gate + penalty escape modal
- **Modify:** `store/useStudyStore.ts` — add `isOnBreak` state and break timer logic

## Design Tokens

| Element | Value |
|---------|-------|
| Vignette | Radial gradient, rgba(0,0,0,0.8) edges to transparent center |
| Timer glow | shadowColor #9B6DFF, animated shadowRadius 8→20→8, 2s loop |
| Lock icon | Ionicons `lock-closed` 16px, #B99BFF, next to mode label |
| Penalty modal bg | colors.surface (#141418) |
| "Stay" button | Primary purple pill |
| "Leave" button | Outline, borderColor colors.danger, text colors.danger |
| Break timer | Smaller text below main timer, gold color (#F5C842) |

## Verification

1. `npx tsc --noEmit` — clean compile
2. Select Deep Mode on setup → start → see vignette + pulsing timer + lock icon
3. Tap End Session → exit gate modal appears (not immediate end)
4. Quiz gate: correct answer → break timer starts, wrong → encouragement shown
5. Penalty escape: confirm → -20 XP deducted, session ends
6. "Stay" → modal dismisses, session continues
7. Focus Mode unchanged — no vignette, no exit gate, direct end
