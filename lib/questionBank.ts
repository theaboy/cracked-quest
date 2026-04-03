export type QuizQuestion = {
  id: string;
  topicId: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

export const QUESTION_BANK: QuizQuestion[] = [
  // ── t1: Linear Regression (COMP 551) ──────────────────────────────────────
  {
    id: "t1-1",
    topicId: "t1",
    question: "What does the Ordinary Least Squares (OLS) method minimize?",
    options: [
      "Sum of absolute errors",
      "Sum of squared residuals",
      "Cross-entropy loss",
      "KL divergence",
    ],
    correctIndex: 1,
  },
  {
    id: "t1-2",
    topicId: "t1",
    question: "Which assumption makes OLS the Best Linear Unbiased Estimator (BLUE)?",
    options: [
      "Errors are normally distributed",
      "Features are uncorrelated with each other",
      "Errors have constant variance (homoscedasticity)",
      "The target variable is binary",
    ],
    correctIndex: 2,
  },
  {
    id: "t1-3",
    topicId: "t1",
    question: "What does R² = 0.85 mean?",
    options: [
      "85% of predictions are exactly correct",
      "85% of the variance in y is explained by the model",
      "The model has 85% classification accuracy",
      "The mean squared error is 0.15",
    ],
    correctIndex: 1,
  },
  {
    id: "t1-4",
    topicId: "t1",
    question: "Adding irrelevant features to a linear regression model will always...",
    options: [
      "Decrease training R²",
      "Keep training R² exactly the same",
      "Increase or keep the same training R²",
      "Have no effect on any metric",
    ],
    correctIndex: 2,
  },
  {
    id: "t1-5",
    topicId: "t1",
    question: "Which regularization technique adds an L1 penalty and can produce sparse weights?",
    options: ["Ridge", "Lasso", "Elastic Net", "Dropout"],
    correctIndex: 1,
  },

  // ── t2: Neural Networks (COMP 551) ────────────────────────────────────────
  {
    id: "t2-1",
    topicId: "t2",
    question: "What is the primary role of an activation function in a neural network?",
    options: [
      "Initialize weights close to zero",
      "Introduce non-linearity into the model",
      "Normalize the inputs to each layer",
      "Compute gradients during backpropagation",
    ],
    correctIndex: 1,
  },
  {
    id: "t2-2",
    topicId: "t2",
    question: "In backpropagation, which calculus rule is used to compute gradients layer by layer?",
    options: ["Product rule", "Quotient rule", "Chain rule", "Power rule"],
    correctIndex: 2,
  },
  {
    id: "t2-3",
    topicId: "t2",
    question: "Which activation function is most associated with the 'dying neuron' problem?",
    options: ["Sigmoid", "Tanh", "ReLU", "Softmax"],
    correctIndex: 2,
  },
  {
    id: "t2-4",
    topicId: "t2",
    question: "Applying dropout during training approximates which technique at inference time?",
    options: [
      "L2 regularization",
      "Approximate ensemble averaging",
      "Batch normalization",
      "Weight clipping",
    ],
    correctIndex: 1,
  },
  {
    id: "t2-5",
    topicId: "t2",
    question: "What does a softmax output layer produce?",
    options: [
      "Log-probabilities summing to 0",
      "A probability distribution summing to 1",
      "Raw unnormalized logits",
      "Binary outputs only",
    ],
    correctIndex: 1,
  },

  // ── t3: Sorting Algorithms (COMP 251) ─────────────────────────────────────
  {
    id: "t3-1",
    topicId: "t3",
    question: "What is the worst-case time complexity of QuickSort?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correctIndex: 1,
  },
  {
    id: "t3-2",
    topicId: "t3",
    question: "Which sorting algorithm is stable AND has a guaranteed O(n log n) worst-case?",
    options: ["QuickSort", "HeapSort", "MergeSort", "ShellSort"],
    correctIndex: 2,
  },
  {
    id: "t3-3",
    topicId: "t3",
    question: "What is the best-case time complexity of Insertion Sort?",
    options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
    correctIndex: 2,
  },
  {
    id: "t3-4",
    topicId: "t3",
    question: "Which of the following sorting algorithms is NOT comparison-based?",
    options: ["MergeSort", "HeapSort", "Counting Sort", "QuickSort"],
    correctIndex: 2,
  },
  {
    id: "t3-5",
    topicId: "t3",
    question: "What is the auxiliary space complexity of MergeSort when sorting arrays?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctIndex: 2,
  },

  // ── t4: Dynamic Programming (COMP 251) ────────────────────────────────────
  {
    id: "t4-1",
    topicId: "t4",
    question: "What two properties must a problem have to be solved with dynamic programming?",
    options: [
      "Greedy choice property and local optima",
      "Optimal substructure and overlapping subproblems",
      "Divide-and-conquer and memoization",
      "Recursion and backtracking",
    ],
    correctIndex: 1,
  },
  {
    id: "t4-2",
    topicId: "t4",
    question: "What is the time complexity of the classic 0/1 Knapsack DP solution?",
    options: ["O(n log n)", "O(2ⁿ)", "O(nW) where W is the capacity", "O(n²)"],
    correctIndex: 2,
  },
  {
    id: "t4-3",
    topicId: "t4",
    question: "In the Longest Common Subsequence (LCS) problem, what does each cell in the DP table store?",
    options: [
      "Characters of the LCS",
      "Length of LCS of the two prefixes",
      "Edit distance between prefixes",
      "Character frequencies",
    ],
    correctIndex: 1,
  },
  {
    id: "t4-4",
    topicId: "t4",
    question: "Bottom-up dynamic programming is also known as...",
    options: ["Memoization", "Tabulation", "Recursion with cache", "Branch and bound"],
    correctIndex: 1,
  },
  {
    id: "t4-5",
    topicId: "t4",
    question: "What is the time complexity of computing the nth Fibonacci number using standard DP?",
    options: ["O(2ⁿ) — same as naive recursion", "O(n log n)", "O(n)", "O(log n)"],
    correctIndex: 2,
  },
];

// Build lookup map once at module load time
const byTopic: Record<string, QuizQuestion[]> = {};
for (const q of QUESTION_BANK) {
  (byTopic[q.topicId] ??= []).push(q);
}

export function getRandomQuestion(topicId: string): QuizQuestion | null {
  const pool = byTopic[topicId];
  if (!pool?.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// TODO: Compute dynamically from exams.exam_date once the DB is seeded
const EXAM_COUNTDOWN: Record<string, string> = {
  t1: "Midterm in 12 days",
  t2: "Midterm in 12 days",
  t3: "Final in 18 days",
  t4: "Final in 18 days",
};

export function getExamCountdown(topicId: string): string {
  return EXAM_COUNTDOWN[topicId] ?? "Exam date TBD";
}
