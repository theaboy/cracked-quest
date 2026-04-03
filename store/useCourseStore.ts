import { create } from "zustand";

export interface Topic {
  id: string;
  name: string;
  status: "locked" | "in_progress" | "mastered";
  masteryScore: number;
}

export interface Exam {
  id: string;
  name: string;
  examDate: string;
  topicIds: string[];
  defeated: boolean;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
  topics: Topic[];
  exams: Exam[];
}

interface CourseState {
  courses: Course[];
  addCourse: (course: Course) => void;
  setCourses: (courses: Course[]) => void;
  clearCourses: () => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  addCourse: (course) =>
    set((s) => ({ courses: [...s.courses, course] })),
  setCourses: (courses) => set({ courses }),
  clearCourses: () => set({ courses: [] }),
}));
