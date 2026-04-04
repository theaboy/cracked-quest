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
      { id: "t1", name: "Linear Regression", status: "mastered", masteryScore: 92, notes: "Linear Regression models the relationship between a continuous output y and input features x by fitting a hyperplane that minimises the Residual Sum of Squares (RSS). The ordinary least-squares solution is w* = (X\u1D40X)\u207BX\u1D40y \u2014 closed-form and exact when X\u1D40X is invertible. Ridge regression (L2 penalty \u03BB\u2016w\u2016\u00B2) handles multicollinearity. The bias\u2013variance tradeoff is central: too few features \u2192 underfits; too many \u2192 overfits. Key assumptions: linearity in parameters, homoscedasticity of residuals, independence of observations. For COMP 551 exams: derive the normal equations, explain why gradient descent converges to the same solution for convex loss, and interpret R\u00B2 as the fraction of variance explained." },
      { id: "t2", name: "Logistic Regression", status: "mastered", masteryScore: 85 },
      { id: "t3", name: "Decision Trees", status: "mastered", masteryScore: 78 },
      { id: "t4", name: "Neural Networks", status: "in_progress", masteryScore: 35, notes: "A neural network is a composition of affine transformations and non-linearities: z\u207D\u02E1\u207E = W\u207D\u02E1\u207Ea\u207D\u02E1\u207B\u00B9\u207E + b\u207D\u02E1\u207E, a\u207D\u02E1\u207E = \u03C3(z\u207D\u02E1\u207E). Training uses backpropagation: forward pass then chain-rule gradients backward to get \u2202L/\u2202W per layer. Key pitfalls: vanishing gradients with sigmoid/tanh (fix: ReLU), exploding gradients (fix: gradient clipping or Xavier/He init), overfitting (fix: dropout, weight decay). Activations to know: ReLU, Leaky ReLU, sigmoid, softmax. Optimisers: SGD with momentum, Adam. Still to review: batch normalisation and why it stabilises training." },
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
  { username: "LiamT", xp: 820, tier: "Grinder" },
  { username: "MayaR", xp: 740, tier: "Grinder" },
  { username: "NoahK", xp: 610, tier: "Grinder" },
  { username: "OliviaP", xp: 530, tier: "Grinder" },
  { username: "EthanB", xp: 450, tier: "Student" },
  { username: "SophieW", xp: 380, tier: "Student" },
  { username: "DanielF", xp: 290, tier: "Student" },
];
