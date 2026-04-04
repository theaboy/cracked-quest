# Chat & Community — Design Document

**Date:** 2026-04-04
**Status:** Approved

## Overview
Replace the Commons tab with a Community tab featuring a segmented view: Chat (class/department rooms with real-time messaging and in-chat surveys) and Resources (existing upload/download functionality preserved).

## Location
- Tab renamed: COMMONS → COMMUNITY (icon: chatbubbles-outline)
- Segmented control at top: Chat | Resources

## Chat Room List (Chat segment)
- Section 1: "Your Classes" — one room per enrolled course
- Section 2: "Departments" — broader rooms (CS, Engineering, etc.)
- Each row: room name, subtitle (prof or dept), member count, last message preview, time, unread dot
- Pull-to-refresh
- Tapping a room pushes to chat thread

## Chat Thread (app/chat/[roomId].tsx)
- Stack push (slide-in from right)
- Message bubbles: purple (#8B5CF6) for sent, warm grey (#1C1C22) for received
- Sender: avatar (initials circle), name, timestamp
- Staggered fade-in animation on load
- Input bar: text input + send button + survey icon
- Auto-scroll to bottom on new messages
- Pinned active survey at top
- Empty state: "Be the first to say hello 👋"

## Surveys/Polls
- Creation: tap survey icon → modal (question + 2-5 options) → post
- Display: special card in chat feed (purple-tinted bg)
- Voting: tap option → bar animates with results + percentages
- Pinned summary at top of chat if active survey exists

## Mock Data
- Diverse names: South Asian, Latin American, Middle Eastern, East Asian, African, European
- 2-3 class rooms, 2 department rooms
- 10-15 messages per active room
- 1-2 surveys with votes

## Design Tokens
- Primary: #8B5CF6 (per spec — slightly different from app's #9B6DFF, use #8B5CF6 for chat)
- Sent bubble: #8B5CF6
- Received bubble: #1C1C22
- Card bg: #141418
- Border: #2E2E3E
- Radii: 14-16px (bubbles), 12px (cards)
- Min tap target: 44px
