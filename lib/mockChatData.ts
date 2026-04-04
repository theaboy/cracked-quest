// Types
export interface ChatRoom {
  id: string;
  name: string;
  type: "class" | "department";
  subtitle: string;
  memberCount: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  color: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  type: "message" | "survey";
  surveyId?: string;
}

export interface SurveyOption {
  id: string;
  text: string;
  votes: number;
}

export interface Survey {
  id: string;
  roomId: string;
  messageId: string;
  question: string;
  options: SurveyOption[];
  totalVotes: number;
  userVote: string | null;
  creatorName: string;
}

export const DEMO_CURRENT_USER = {
  id: "demo-user-001",
  name: "DemoStudent",
  avatar: "DS",
};

export const DEMO_ROOMS: ChatRoom[] = [
  {
    id: "room-comp551",
    name: "COMP 551",
    type: "class",
    subtitle: "Prof. Li Chen",
    memberCount: 34,
    lastMessage: "Does anyone have notes from today?",
    lastMessageTime: "2:34 PM",
    unreadCount: 3,
    color: "#6C5CE7",
  },
  {
    id: "room-math223",
    name: "MATH 223",
    type: "class",
    subtitle: "Prof. Sarah Williams",
    memberCount: 28,
    lastMessage: "The midterm review is posted!",
    lastMessageTime: "1:15 PM",
    unreadCount: 0,
    color: "#00B894",
  },
  {
    id: "room-comp206",
    name: "COMP 206",
    type: "class",
    subtitle: "Prof. Ahmed Hassan",
    memberCount: 41,
    lastMessage: "Can someone explain pipes?",
    lastMessageTime: "11:42 AM",
    unreadCount: 1,
    color: "#E17055",
  },
  {
    id: "room-cs-dept",
    name: "Computer Science",
    type: "department",
    subtitle: "128 students",
    memberCount: 128,
    lastMessage: "Summer internship thread 🧵",
    lastMessageTime: "12:05 PM",
    unreadCount: 0,
    color: "#0984E3",
  },
  {
    id: "room-eng-dept",
    name: "Engineering",
    type: "department",
    subtitle: "95 students",
    memberCount: 95,
    lastMessage: "Welcome new students! 🎉",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    color: "#FDCB6E",
  },
];

export const DEMO_MESSAGES: Record<string, ChatMessage[]> = {
  "room-comp551": [
    {
      id: "msg-comp551-1",
      roomId: "room-comp551",
      senderId: "user-ps",
      senderName: "Priya Sharma",
      senderAvatar: "PS",
      text: "Hey everyone! Did anyone understand the gradient descent derivation from today's lecture?",
      timestamp: "1:45 PM",
      type: "message",
    },
    {
      id: "msg-comp551-2",
      roomId: "room-comp551",
      senderId: "user-cm",
      senderName: "Carlos Mendez",
      senderAvatar: "CM",
      text: "I got most of it but the part about learning rate schedules was confusing",
      timestamp: "1:48 PM",
      type: "message",
    },
    {
      id: "msg-comp551-3",
      roomId: "room-comp551",
      senderId: "user-fa",
      senderName: "Fatima Al-Rashid",
      senderAvatar: "FA",
      text: "Same here. I think Prof. Chen went through it too fast. Anyone want to form a study group?",
      timestamp: "1:52 PM",
      type: "message",
    },
    {
      id: "msg-comp551-4",
      roomId: "room-comp551",
      senderId: "user-wz",
      senderName: "Wei Zhang",
      senderAvatar: "WZ",
      text: "I can share my notes! I recorded the key equations step by step",
      timestamp: "1:55 PM",
      type: "message",
    },
    {
      id: "msg-comp551-5",
      roomId: "room-comp551",
      senderId: "user-ao",
      senderName: "Amara Okafor",
      senderAvatar: "AO",
      text: "That would be amazing Wei! Also has anyone started on Assignment 3? The regularization question is tricky",
      timestamp: "2:01 PM",
      type: "message",
    },
    {
      id: "msg-comp551-6",
      roomId: "room-comp551",
      senderId: "user-dp",
      senderName: "Dimitri Petrov",
      senderAvatar: "DP",
      text: "I'm stuck on the L2 vs L1 comparison part. The math isn't clicking for me",
      timestamp: "2:05 PM",
      type: "message",
    },
    {
      id: "msg-comp551-7",
      roomId: "room-comp551",
      senderId: "user-yt",
      senderName: "Yuki Tanaka",
      senderAvatar: "YT",
      text: "I found a great visualization for that! L1 gives sparse solutions because of the diamond-shaped constraint. I'll share the link after class",
      timestamp: "2:10 PM",
      type: "message",
    },
    {
      id: "msg-comp551-8",
      roomId: "room-comp551",
      senderId: "user-ps",
      senderName: "Priya Sharma",
      senderAvatar: "PS",
      text: "📊 New poll: How's the pace of the course so far?",
      timestamp: "2:15 PM",
      type: "survey",
      surveyId: "survey-1",
    },
    {
      id: "msg-comp551-9",
      roomId: "room-comp551",
      senderId: "user-ln",
      senderName: "Leila Nazari",
      senderAvatar: "LN",
      text: "Study group sounds great! I'm free Thursdays after 4. We could book a room in Trottier",
      timestamp: "2:20 PM",
      type: "message",
    },
    {
      id: "msg-comp551-10",
      roomId: "room-comp551",
      senderId: "user-ed",
      senderName: "Emmanuel Diop",
      senderAvatar: "ED",
      text: "Thursday works for me too. Can we also go over the bias-variance tradeoff? I keep mixing it up",
      timestamp: "2:25 PM",
      type: "message",
    },
    {
      id: "msg-comp551-11",
      roomId: "room-comp551",
      senderId: "user-sr",
      senderName: "Sofia Reyes",
      senderAvatar: "SR",
      text: "Count me in! Also just a reminder the midterm is in 2 weeks 😬",
      timestamp: "2:30 PM",
      type: "message",
    },
    {
      id: "msg-comp551-12",
      roomId: "room-comp551",
      senderId: "user-ap",
      senderName: "Arjun Patel",
      senderAvatar: "AP",
      text: "Does anyone have notes from today? I had to leave early for a doctor's appointment",
      timestamp: "2:34 PM",
      type: "message",
    },
  ],
  "room-math223": [
    {
      id: "msg-math223-1",
      roomId: "room-math223",
      senderId: "user-ms",
      senderName: "Maria Santos",
      senderAvatar: "MS",
      text: "Can someone explain how to find eigenvalues for a 3x3 matrix? The characteristic polynomial is getting messy",
      timestamp: "12:30 PM",
      type: "message",
    },
    {
      id: "msg-math223-2",
      roomId: "room-math223",
      senderId: "user-wz",
      senderName: "Wei Zhang",
      senderAvatar: "WZ",
      text: "Try expanding along the row with the most zeros. It makes the determinant calculation much easier",
      timestamp: "12:42 PM",
      type: "message",
    },
    {
      id: "msg-math223-3",
      roomId: "room-math223",
      senderId: "user-fa",
      senderName: "Fatima Al-Rashid",
      senderAvatar: "FA",
      text: "Also remember that the trace equals the sum of eigenvalues and the determinant equals their product. Good sanity check!",
      timestamp: "12:55 PM",
      type: "message",
    },
    {
      id: "msg-math223-4",
      roomId: "room-math223",
      senderId: "user-dp",
      senderName: "Dimitri Petrov",
      senderAvatar: "DP",
      text: "Has anyone checked if the midterm review is posted on myCourses? Prof. Williams mentioned it would be up today",
      timestamp: "1:08 PM",
      type: "message",
    },
    {
      id: "msg-math223-5",
      roomId: "room-math223",
      senderId: "user-ao",
      senderName: "Amara Okafor",
      senderAvatar: "AO",
      text: "The midterm review is posted! Just checked — it covers chapters 4-6, focusing on eigenvalues, diagonalization, and inner product spaces",
      timestamp: "1:15 PM",
      type: "message",
    },
  ],
};

export const DEMO_SURVEYS: Survey[] = [
  {
    id: "survey-1",
    roomId: "room-comp551",
    messageId: "msg-comp551-8",
    question: "How's the pace of the course so far?",
    options: [
      { id: "opt-1", text: "Too fast", votes: 8 },
      { id: "opt-2", text: "Just right", votes: 14 },
      { id: "opt-3", text: "Too slow", votes: 3 },
      { id: "opt-4", text: "Need more examples", votes: 9 },
    ],
    totalVotes: 34,
    userVote: null,
    creatorName: "Priya Sharma",
  },
];
