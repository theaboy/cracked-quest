import { create } from "zustand";
import {
  ChatRoom,
  ChatMessage,
  Survey,
  DEMO_ROOMS,
  DEMO_MESSAGES,
  DEMO_SURVEYS,
} from "../lib/mockChatData";

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

export const useChatStore = create<ChatState>((set) => ({
  rooms: DEMO_ROOMS,
  messages: DEMO_MESSAGES,
  surveys: DEMO_SURVEYS,

  setRooms: (rooms) => set({ rooms }),

  addMessage: (roomId, message) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [roomId]: [...(s.messages[roomId] || []), message],
      },
      rooms: s.rooms.map((r) =>
        r.id === roomId
          ? { ...r, lastMessage: message.text, lastMessageTime: "Just now" }
          : r
      ),
    })),

  voteSurvey: (surveyId, optionId) =>
    set((s) => ({
      surveys: s.surveys.map((survey) => {
        if (survey.id !== surveyId || survey.userVote !== null) return survey;
        return {
          ...survey,
          userVote: optionId,
          totalVotes: survey.totalVotes + 1,
          options: survey.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          ),
        };
      }),
    })),

  addSurvey: (survey, message) =>
    set((s) => ({
      surveys: [...s.surveys, survey],
      messages: {
        ...s.messages,
        [message.roomId]: [...(s.messages[message.roomId] || []), message],
      },
      rooms: s.rooms.map((r) =>
        r.id === message.roomId
          ? {
              ...r,
              lastMessage: "\ud83d\udcca New poll posted",
              lastMessageTime: "Just now",
            }
          : r
      ),
    })),

  markRoomRead: (roomId) =>
    set((s) => ({
      rooms: s.rooms.map((r) =>
        r.id === roomId ? { ...r, unreadCount: 0 } : r
      ),
    })),
}));
