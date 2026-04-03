import { Course } from "../store/useCourseStore";

export const DEMO_USER = {
  id: "demo-user-001",
  email: "demo@studyquest.app",
  username: "DemoStudent",
};

export const DEMO_COURSES: Course[] = [
  {
    id: "course-comp551",
    name: "Machine Learning",
    code: "COMP 551",
    color: "#6C5CE7",
    topics: [
      { id: "t1", name: "Linear Regression", status: "mastered", masteryScore: 92 },
      { id: "t2", name: "Logistic Regression", status: "mastered", masteryScore: 85 },
      { id: "t3", name: "Decision Trees", status: "mastered", masteryScore: 78 },
      { id: "t4", name: "Neural Networks", status: "in_progress", masteryScore: 35 },
      { id: "t5", name: "CNNs", status: "locked", masteryScore: 0 },
      { id: "t6", name: "Transformers", status: "locked", masteryScore: 0 },
    ],
    exams: [
      {
        id: "e1",
        name: "Midterm",
        examDate: new Date(Date.now() + 8 * 86400000).toISOString().split("T")[0],
        topicIds: ["t1", "t2", "t3", "t4"],
        defeated: false,
      },
      {
        id: "e2",
        name: "Final",
        examDate: new Date(Date.now() + 35 * 86400000).toISOString().split("T")[0],
        topicIds: ["t1", "t2", "t3", "t4", "t5", "t6"],
        defeated: false,
      },
    ],
  },
  {
    id: "course-math223",
    name: "Linear Algebra",
    code: "MATH 223",
    color: "#00B894",
    topics: [
      { id: "t7", name: "Vectors & Spaces", status: "mastered", masteryScore: 90 },
      { id: "t8", name: "Matrix Operations", status: "mastered", masteryScore: 82 },
      { id: "t9", name: "Eigenvalues", status: "in_progress", masteryScore: 40 },
      { id: "t10", name: "SVD", status: "locked", masteryScore: 0 },
    ],
    exams: [
      {
        id: "e3",
        name: "Midterm",
        examDate: new Date(Date.now() + 12 * 86400000).toISOString().split("T")[0],
        topicIds: ["t7", "t8", "t9"],
        defeated: false,
      },
    ],
  },
];

export const DEMO_LEADERBOARD = [
  { username: "AlexChen", xp: 1420, tier: "Scholar" },
  { username: "SarahM", xp: 1380, tier: "Grinder" },
  { username: "DemoStudent", xp: 1240, tier: "Grinder" },
  { username: "JakeW", xp: 1100, tier: "Grinder" },
  { username: "EmmaL", xp: 890, tier: "Grinder" },
];
