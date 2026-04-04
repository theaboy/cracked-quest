import { create } from "zustand";

export type ResourceType =
  | "Notes"
  | "Past Exam"
  | "Summary"
  | "Slides"
  | "Cheatsheet";

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  course: string;
  uploaderName: string;
  downloadCount: number;
}

interface CommonsState {
  resources: Resource[];
  addResource: (resource: Resource) => void;
  incrementDownload: (id: string) => void;
}

const MOCK_RESOURCES: Resource[] = [
  { id: "r-001", title: "Linear Regression Cheatsheet", type: "Cheatsheet", course: "COMP 551", uploaderName: "alex_s",    downloadCount: 34  },
  { id: "r-002", title: "COMP 551 Midterm W2024",        type: "Past Exam",  course: "COMP 551", uploaderName: "prof_notes", downloadCount: 87  },
  { id: "r-003", title: "Neural Networks Summary",        type: "Summary",    course: "COMP 551", uploaderName: "marie_c",   downloadCount: 52  },
  { id: "r-004", title: "Sorting Algorithms Notes",       type: "Notes",      course: "COMP 251", uploaderName: "theaboy",   downloadCount: 21  },
  { id: "r-005", title: "DP Problem Set Solutions",       type: "Slides",     course: "COMP 251", uploaderName: "alex_s",    downloadCount: 45  },
  { id: "r-006", title: "COMP 251 Final F2023",           type: "Past Exam",  course: "COMP 251", uploaderName: "marie_c",   downloadCount: 113 },
  { id: "r-007", title: "C Pointers Cheatsheet",          type: "Cheatsheet", course: "COMP 206", uploaderName: "theaboy",   downloadCount: 18  },
];

export const useCommonsStore = create<CommonsState>((set) => ({
  resources: MOCK_RESOURCES,

  addResource: (resource) =>
    set((s) => ({ resources: [resource, ...s.resources] })),

  incrementDownload: (id) =>
    set((s) => ({
      resources: s.resources.map((r) =>
        r.id === id ? { ...r, downloadCount: r.downloadCount + 1 } : r
      ),
    })),
}));
