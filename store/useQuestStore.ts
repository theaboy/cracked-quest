import { create } from "zustand";

export interface QuestTask {
  id: string;
  day: string;        // e.g. "Day 1 – Mon Apr 6"
  description: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  dueDate: string;    // free-form, e.g. "Apr 15, 2026"
  course: string;
  tasks: QuestTask[];
}

interface QuestState {
  quests: Quest[];
  addQuest: (quest: Quest) => void;
  toggleTask: (questId: string, taskId: string) => void;
}

const MOCK_QUEST: Quest = {
  id: "q-demo-1",
  title: "COMP 551 Term Paper",
  description: "Survey paper on attention mechanisms and transformers.",
  dueDate: "Apr 15, 2026",
  course: "COMP 551",
  tasks: [
    { id: "t1", day: "Day 1 – Mon Apr 6",  description: "Outline structure and choose 8 source papers",    completed: false },
    { id: "t2", day: "Day 2 – Tue Apr 7",  description: "Read & annotate 4 foundational papers",            completed: false },
    { id: "t3", day: "Day 3 – Wed Apr 8",  description: "Read & annotate 4 application papers",             completed: false },
    { id: "t4", day: "Day 4 – Thu Apr 9",  description: "Write intro, background, and related work (3 pp)", completed: false },
    { id: "t5", day: "Day 5 – Fri Apr 10", description: "Write analysis, conclusion; proofread final draft", completed: false },
  ],
};

export const useQuestStore = create<QuestState>((set) => ({
  quests: [MOCK_QUEST],

  addQuest: (quest) =>
    set((s) => ({ quests: [...s.quests, quest] })),

  toggleTask: (questId, taskId) =>
    set((s) => ({
      quests: s.quests.map((q) =>
        q.id !== questId
          ? q
          : {
              ...q,
              tasks: q.tasks.map((t) =>
                t.id !== taskId ? t : { ...t, completed: !t.completed }
              ),
            }
      ),
    })),
}));
