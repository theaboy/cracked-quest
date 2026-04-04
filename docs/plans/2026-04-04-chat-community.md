# Chat & Community — Implementation Plan

> **For agent:** REQUIRED SUB-SKILL: Use Section 4 or Section 5 to implement this plan.

**Goal:** Replace the Commons tab with a Community tab featuring chat rooms (class + department), message threads with surveys/polls, and the existing resources section behind a segment toggle.

**Architecture:** Segmented Community screen at `app/(tabs)/commons.tsx`, chat thread at `app/chat/[roomId].tsx`, new Zustand store for chat state, mock data for demo.

**Tech Stack:** React Native, Expo Router (stack push for chat thread), Zustand v5, StyleSheet.create, react-native-reanimated for animations

---

## Task 1: Mock Data & Chat Store

**Files:**
- Create: `lib/mockChatData.ts`
- Create: `store/useChatStore.ts`

**What to build:**

### mockChatData.ts
- `ChatRoom` type: `{ id, name, type: 'class' | 'department', subtitle: string, memberCount: number, lastMessage: string, lastMessageTime: string, unreadCount: number }`
- `ChatMessage` type: `{ id, roomId, senderId, senderName, senderAvatar: string (initials), text: string, timestamp: string, type: 'message' | 'survey' }`
- `Survey` type: `{ id, roomId, messageId, question: string, options: { id, text, votes: number }[], totalVotes: number, userVote: string | null }`
- `DEMO_ROOMS`: 5 rooms:
  - Class: "COMP 551 — Machine Learning" (Prof. Li Chen, 34 members, 3 unread)
  - Class: "MATH 223 — Linear Algebra" (Prof. Sarah Williams, 28 members, 0 unread)
  - Class: "COMP 206 — Software Systems" (Prof. Ahmed Hassan, 41 members, 1 unread)
  - Department: "Computer Science" (128 members)
  - Department: "Engineering" (95 members)
- `DEMO_MESSAGES`: Record<roomId, ChatMessage[]> — 10-15 messages for COMP 551, 5 for MATH 223, empty for others
- Use diverse names: Priya Sharma, Carlos Mendez, Fatima Al-Rashid, Wei Zhang, Amara Okafor, Dimitri Petrov, Yuki Tanaka, Leila Nazari, Emmanuel Diop, Sofia Reyes, Arjun Patel, Maria Santos
- Include 1 survey message in COMP 551 messages
- `DEMO_SURVEYS`: 1 survey for COMP 551 — "How's the pace of the course?" options: Too fast / Just right / Too slow / Need more examples — with 34 total votes
- Export `DEMO_CURRENT_USER = { id: "demo-user-001", name: "DemoStudent", avatar: "DS" }`

### useChatStore.ts
```typescript
interface ChatState {
  rooms: ChatRoom[];
  messages: Record<string, ChatMessage[]>;
  surveys: Survey[];
  setRooms: (rooms: ChatRoom[]) => void;
  addMessage: (roomId: string, message: ChatMessage) => void;
  voteSurvey: (surveyId: string, optionId: string) => void;
  addSurvey: (survey: Survey, message: ChatMessage) => void;
  markRoomRead: (roomId: string) => void;
}
```
- Initialize with DEMO data in the store defaults

**Commit:** `feat: chat store and mock data with diverse demo content`

---

## Task 2: Rename Commons Tab → Community with Segment Toggle

**Files:**
- Modify: `app/(tabs)/_layout.tsx` — rename tab label and icon
- Modify: `app/(tabs)/commons.tsx` — add segment toggle, keep resources as one segment

**What to build:**

### _layout.tsx
Change the commons entry in TAB_CONFIG:
```typescript
commons: { label: "COMMUNITY", icon: "chatbubbles-outline", activeIcon: "chatbubbles" },
```

### commons.tsx
- Add a segment control at the top: "Chat" | "Resources"
- State: `activeSegment: 'chat' | 'resources'`
- When "Resources" selected: show existing commons content (everything currently there)
- When "Chat" selected: show `<ChatRoomList />` component (placeholder for now)
- Segment pills styled like existing filter pills but bigger, centered

**Commit:** `feat: rename Commons to Community with Chat/Resources segment toggle`

---

## Task 3: Chat Room List Component

**Files:**
- Create: `components/chat/ChatRoomList.tsx`
- Modify: `app/(tabs)/commons.tsx` — import and render ChatRoomList

**What to build:**

### ChatRoomList.tsx
- Two sections with headers: "YOUR CLASSES" and "DEPARTMENTS"
- Each room row:
  - Left: colored circle with first letter of room name
  - Middle: room name (bold), subtitle (prof name or "Open to all"), last message preview (grey, truncated 1 line)
  - Right: timestamp (grey), unread dot (purple, 8px circle) if unreadCount > 0
- Rows separated by thin border (#2E2E3E)
- Pull-to-refresh (RefreshControl)
- Tap room → navigate to `app/chat/[roomId]` via `router.push`
- Min height per row: 72px, thumb-friendly
- Use ScrollView + map (not FlatList in ScrollView)

**Commit:** `feat: chat room list with class and department sections`

---

## Task 4: Chat Thread Screen

**Files:**
- Create: `app/chat/[roomId].tsx`
- Create: `components/chat/MessageBubble.tsx`
- Create: `components/chat/ChatInput.tsx`

**What to build:**

### app/chat/[roomId].tsx
- Get `roomId` from route params
- Load messages from `useChatStore`
- Header: room name + back button + member count
- ScrollView of messages (auto-scroll to bottom on mount and new messages)
- Pinned active survey banner at top (if survey exists for this room)
- ChatInput at bottom
- Empty state if no messages: centered text "Be the first to say hello 👋" with waving hand

### MessageBubble.tsx
- Props: `message: ChatMessage, isOwn: boolean`
- Own messages: purple bg (#8B5CF6), white text, aligned right, no avatar
- Other messages: dark bg (#1C1C22), white text, aligned left, avatar + name shown
- Avatar: colored circle with initials (derive color from name hash)
- Timestamp below bubble in muted text
- Rounded corners: 16px, with tail corner 4px on the sender's side
- If message type is 'survey', render SurveyCard instead

### ChatInput.tsx
- Props: `onSend: (text: string) => void, onSurveyPress: () => void`
- TextInput with placeholder "Type a message..."
- Send button (arrow icon) — purple when text is non-empty, grey when empty
- Survey button (bar-chart icon) to left of send
- Bottom padding for safe area
- Input bar bg: #141418, border-top: #2E2E3E

**Commit:** `feat: chat thread with message bubbles and input bar`

---

## Task 5: Survey Card & Voting

**Files:**
- Create: `components/chat/SurveyCard.tsx`
- Modify: `components/chat/MessageBubble.tsx` — render SurveyCard for survey messages

**What to build:**

### SurveyCard.tsx
- Props: `survey: Survey, onVote: (surveyId: string, optionId: string) => void`
- Card with purple-tinted bg (rgba(139, 92, 246, 0.08)), rounded 14px, border #2E2E3E
- Header: "📊 Poll" badge + sender name
- Question text: bold, white, 16px
- Options: vertical list of touchable rows
  - Before voting: option text with radio-style circle outline
  - After voting: option text + animated horizontal bar showing % + vote count
  - User's voted option highlighted with purple fill
  - Bar animation: width transitions from 0 to result % (use Animated or Reanimated)
- Footer: "X total votes" in muted text
- On vote: call `useChatStore.voteSurvey()`, update UI optimistically

**Commit:** `feat: survey card with voting and animated results`

---

## Task 6: Survey Creation Modal

**Files:**
- Create: `components/chat/SurveyCreator.tsx`
- Modify: `app/chat/[roomId].tsx` — add survey creation flow

**What to build:**

### SurveyCreator.tsx
- Modal triggered by survey button in ChatInput
- Form:
  - Question input (TextInput, placeholder "Ask a question...")
  - Options list: start with 2 inputs, "Add option" button (up to 5)
  - Each option: TextInput + delete button (X icon, only if > 2 options)
  - "Post Poll" button (purple, disabled until question + at least 2 options filled)
  - "Cancel" button
- On submit: create survey + message in store, close modal
- Styled like existing upload modal (dark card, same spacing)

**Commit:** `feat: survey creation modal with dynamic options`

---

## Task 7: Active Survey Banner & Polish

**Files:**
- Create: `components/chat/ActiveSurveyBanner.tsx`
- Modify: `app/chat/[roomId].tsx` — add banner at top
- Modify: `components/chat/MessageBubble.tsx` — add staggered fade-in animation

**What to build:**

### ActiveSurveyBanner.tsx
- If room has an active survey: show pinned bar at top of chat
- "📊 Active poll: X votes — tap to see"
- Purple-tinted bg, tap scrolls to the survey message in the list

### Staggered fade-in
- Messages animate in with a subtle opacity + translateY animation on first render
- Use `useEffect` + `Animated.stagger` or Reanimated `FadeInDown` with delay per index
- Only on initial load, not on new messages sent

### Polish pass
- Ensure all colors match theme
- Verify 44px min tap targets
- Test keyboard avoiding behavior on chat input
- Smooth transitions between segments

**Commit:** `feat: active survey banner and message animation polish`

---

## Execution Notes
- Tasks 1-2 are foundational — do first, sequentially
- Tasks 3-4 are the core UI — sequential
- Tasks 5-6 are survey features — sequential
- Task 7 is polish — after everything works
