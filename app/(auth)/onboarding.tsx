import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { colors, radii } from "../../lib/theme";
import { useAuthStore } from "../../store/useAuthStore";
import { useCourseStore, Course } from "../../store/useCourseStore";
import { useXpStore } from "../../store/useXpStore";
import ChatBubble from "../../components/ChatBubble";
import TypingIndicator from "../../components/TypingIndicator";
import OptionCard from "../../components/OptionCard";
import { useBubbleSequence } from "../../hooks/useBubbleSequence";
import { requestPermissions } from "../../lib/notifications";

interface OnboardingData {
  display_name: string;
  university: string;
  default_study_mode: "deep" | "focus";
  study_preferences: string[];
  courses: {
    course_name: string;
    course_code: string;
    exam_date: string | null;
    topics: string[];
  }[];
}

const INITIAL_DATA: OnboardingData = {
  display_name: "",
  university: "",
  default_study_mode: "focus",
  study_preferences: [],
  courses: [],
};

type Screen = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export default function OnboardingScreen() {
  const [screen, setScreen] = useState<Screen>(1);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);

  const [nameInput, setNameInput] = useState("");
  const [university, setUniversity] = useState("McGill University");
  const [otherUni, setOtherUni] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [examDate, setExamDate] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [tempTopics, setTempTopics] = useState<string[]>([]);
  const [studyPrefs, setStudyPrefs] = useState<string[]>([]);
  const [studyMode, setStudyMode] = useState<"deep" | "focus" | "">("");
  const [showXpBurst, setShowXpBurst] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [showFinalCta, setShowFinalCta] = useState(false);
  const [mascotReady, setMascotReady] = useState(false);

  const xpAnim = useRef(new Animated.Value(0)).current;
  const xpOpacity = useRef(new Animated.Value(0)).current;

  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);
  const setCourses = useCourseStore((s) => s.setCourses);
  const setXp = useXpStore((s) => s.setXp);

  const getBubbles = (): string[] => {
    const name = data.display_name || "there";
    const course = data.courses.length > 0 ? data.courses[data.courses.length - 1].course_name : "";
    const cn = courseName || course;
    const totalTopics = data.courses.reduce((a, c) => a + c.topics.length, 0);
    const daysUntilExam = data.courses[0]?.exam_date
      ? Math.max(1, Math.ceil((new Date(data.courses[0].exam_date).getTime() - Date.now()) / 86400000))
      : null;

    switch (screen) {
      case 1: return ["Hey! I'm Cracked. Your study companion. 👋", "Fair warning — I take studying very seriously. 😤", "Before we start… what do I call you?"];
      case 2: return [`Okay ${name}! Which university are you at?`];
      case 3: return ["Okay so here's the deal.", "I'm going to help you turn studying into a game. You earn XP, you rank up, you beat bosses.", "The bosses are your exams. And right now? They're winning. 😈", "Not for long."];
      case 4: return data.courses.length === 0
        ? ["First mission: tell me your courses.", "Start with the one stressing you out the most. 😬"]
        : ["Another one! What's the next course?"];
      case 5: return [`When's the first exam for ${cn}?`];
      case 6: return [`What topics does ${cn} cover? List them out.`, "Don't overthink it. Even 'Week 1 stuff' works. 😄"];
      case 7: return [`Got it. ${cn} is locked in. 🔒`, "Any other courses this semester?"];
      case 8: return ["One last thing before we set you up.", "How do you usually study?"];
      case 9: return ["Okay. One thing you should know about me.", "When you're in Deep Mode, I take over your phone. 😤", "TikTok, Instagram, all of it — blocked.", "You'll have to answer a question about your course to get a break.", "Cool with that?"];
      case 10: return [`Alright ${name}. You're all set. 🎓`, `You've got ${data.courses.length} course${data.courses.length > 1 ? "s" : ""}, ${totalTopics} topics${daysUntilExam ? `, and your first exam in ${daysUntilExam} days` : ""}.`, "Let's get you to the top. 👑"];
      default: return [];
    }
  };

  const bubbles = getBubbles();
  const { currentIndex, isTyping, isDone } = useBubbleSequence(bubbles, screen, mascotReady);

  useEffect(() => {
    if (screen === 10 && isDone) {
      setTimeout(() => {
        setShowXpBurst(true);
        Animated.parallel([
          Animated.timing(xpAnim, { toValue: -80, duration: 1200, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(xpOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.delay(600),
            Animated.timing(xpOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
          ]),
        ]).start(() => {
          setShowBadge(true);
          setTimeout(() => setShowFinalCta(true), 800);
        });
      }, 500);
    }
  }, [screen, isDone]);

  const advance = () => {
    Keyboard.dismiss();
    setScreen((s) => (s + 1) as Screen);
  };

  const goBack = () => {
    if (screen <= 1) return;

    // Undo data mutations when going back
    if (screen === 5 || screen === 6 || screen === 7) {
      // Remove the last added course if going back from exam/topics/more-courses
      if (screen === 5) {
        setData((d) => ({ ...d, courses: d.courses.slice(0, -1) }));
        setCourseName("");
        setCourseCode("");
      }
    }

    setScreen((s) => (s - 1) as Screen);
  };

  const handleScreen1 = () => {
    setData((d) => ({ ...d, display_name: nameInput.trim() }));
    advance();
  };

  const handleScreen2 = () => {
    const uni = university === "Other" ? otherUni.trim() : university;
    setData((d) => ({ ...d, university: uni }));
    advance();
  };

  const handleScreen4 = () => {
    setData((d) => ({
      ...d,
      courses: [...d.courses, { course_name: courseName.trim(), course_code: courseCode.trim(), exam_date: null, topics: [] }],
    }));
    advance();
  };

  const handleScreen5 = (skip = false) => {
    if (!skip && examDate.trim()) {
      setData((d) => {
        const courses = [...d.courses];
        courses[courses.length - 1].exam_date = examDate.trim();
        return { ...d, courses };
      });
    }
    setExamDate("");
    advance();
  };

  const handleAddTopic = () => {
    const t = topicInput.trim();
    if (t && !tempTopics.includes(t)) {
      setTempTopics([...tempTopics, t]);
      setTopicInput("");
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setTempTopics(tempTopics.filter((t) => t !== topic));
  };

  const handleScreen6 = () => {
    setData((d) => {
      const courses = [...d.courses];
      courses[courses.length - 1].topics = tempTopics;
      return { ...d, courses };
    });
    setTempTopics([]);
    advance();
  };

  const handleScreen7 = (addMore: boolean) => {
    if (addMore && data.courses.length < 6) {
      setCourseName("");
      setCourseCode("");
      setScreen(4);
    } else {
      advance();
    }
  };

  const handleScreen8 = () => {
    setData((d) => ({ ...d, study_preferences: studyPrefs }));
    advance();
  };

  const handleScreen9 = (mode: "deep" | "focus") => {
    setData((d) => ({ ...d, default_study_mode: mode }));
    setStudyMode(mode);
    advance();
  };

  const handleFinish = async () => {
    const storeCourses: Course[] = data.courses.map((c, ci) => ({
      id: `course-${Date.now()}-${ci}`,
      name: c.course_name,
      code: c.course_code || "",
      color: ["#9B6DFF", "#4EFFB4", "#E17055", "#0984E3", "#F5C842", "#E84393"][ci % 6],
      topics: c.topics.map((t, ti) => ({
        id: `topic-${Date.now()}-${ci}-${ti}`,
        name: t,
        status: "locked" as const,
        masteryScore: 0,
      })),
      exams: c.exam_date
        ? [{ id: `exam-${Date.now()}-${ci}`, name: "Exam 1", examDate: c.exam_date, topicIds: [], defeated: false }]
        : [],
    }));
    setCourses(storeCourses);
    setXp(50);
    // Request notification permissions — user just finished onboarding, optimal moment
    await requestPermissions().catch(() => {});
    // Set user LAST — this triggers the root layout guard to navigate to /(tabs)
    setUser({ id: `user-${Date.now()}`, email: "", username: data.display_name });
  };

  const togglePref = (pref: string) => {
    setStudyPrefs((prev) => prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]);
  };

  const canAdvance = (): boolean => {
    switch (screen) {
      case 1: return nameInput.trim().length > 0;
      case 2: return university !== "" && (university !== "Other" || otherUni.trim().length > 0);
      case 3: return true;
      case 4: return courseName.trim().length > 0;
      case 5: return true;
      case 6: return tempTopics.length > 0;
      case 7: return true;
      case 8: return studyPrefs.length > 0;
      case 9: return true;
      case 10: return showFinalCta;
      default: return false;
    }
  };

  const getCtaText = (): string => {
    switch (screen) {
      case 1: return nameInput.trim() ? `Nice to meet you, ${nameInput.trim()}!` : "Nice to meet you, Cracked";
      case 2: return "That's my school";
      case 3: return "Let's change that";
      case 4: return "That's the one";
      case 5: return "That's the deadline";
      case 6: return "Those are my topics";
      case 8: return "That's how I roll";
      case 10: return "Let's Get Cracked";
      default: return "Next";
    }
  };

  const handleCta = () => {
    switch (screen) {
      case 1: handleScreen1(); break;
      case 2: handleScreen2(); break;
      case 3: advance(); break;
      case 4: handleScreen4(); break;
      case 5: handleScreen5(); break;
      case 6: handleScreen6(); break;
      case 8: handleScreen8(); break;
      case 10: void handleFinish(); break;
    }
  };

  // Should we show the input/options area? Only after all bubbles are done
  const showContent = isDone;

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      {screen > 1 && screen < 10 && (
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Mascot with speech bubble above */}
        <View style={[styles.mascotArea, !mascotReady && { opacity: 0 }]}>
          {/* Mascot — static, centered, big */}
          <View style={styles.mascotWrap}>
            <Image
              source={require("../../assets/crack-mascot.png")}
              style={styles.mascot}
              resizeMode="contain"
              onLoad={() => setMascotReady(true)}
            />
          </View>

          {/* Speech bubble — positioned above mascot, overlapping the top */}
          <View style={styles.bubbleArea}>
            {mascotReady && isTyping && <TypingIndicator />}
            {mascotReady && !isTyping && currentIndex >= 0 && (
              <ChatBubble text={bubbles[currentIndex]} />
            )}
          </View>
        </View>

        {/* Content below mascot — only after bubbles finish */}
        {showContent && (
          <View style={styles.contentWrap}>
            {screen === 1 && (
              <TextInput
                style={styles.input}
                placeholder="Your first name"
                placeholderTextColor={colors.text3}
                value={nameInput}
                onChangeText={setNameInput}
              />
            )}

            {screen === 2 && (
              <View style={styles.optionsWrap}>
                {[
                  { label: "🎓 McGill University", value: "McGill University" },
                  { label: "🏫 Concordia University", value: "Concordia University" },
                  { label: "🏛️ Université de Montréal", value: "Université de Montréal" },
                  { label: "➕ Other", value: "Other" },
                ].map((opt) => (
                  <OptionCard key={opt.value} label={opt.label} selected={university === opt.value} onPress={() => setUniversity(opt.value)} />
                ))}
                {university === "Other" && (
                  <TextInput style={styles.input} placeholder="Enter your university" placeholderTextColor={colors.text3} value={otherUni} onChangeText={setOtherUni} />
                )}
              </View>
            )}

            {screen === 4 && (
              <View style={styles.optionsWrap}>
                <TextInput style={styles.input} placeholder="e.g. Machine Learning" placeholderTextColor={colors.text3} value={courseName} onChangeText={setCourseName} />
                <TextInput style={styles.input} placeholder="e.g. COMP 551" placeholderTextColor={colors.text3} value={courseCode} onChangeText={setCourseCode} autoCapitalize="characters" />
                <Text style={styles.helperText}>Course code is optional</Text>
              </View>
            )}

            {screen === 5 && (
              <View style={styles.optionsWrap}>
                <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor={colors.text3} value={examDate} onChangeText={setExamDate} keyboardType="numbers-and-punctuation" />
                <TouchableOpacity onPress={() => handleScreen5(true)}>
                  <Text style={styles.skipText}>No exam yet? Skip for now</Text>
                </TouchableOpacity>
              </View>
            )}

            {screen === 6 && (
              <View style={styles.optionsWrap}>
                <View style={styles.topicInputRow}>
                  <TextInput style={[styles.input, { flex: 1 }]} placeholder="Add a topic" placeholderTextColor={colors.text3} value={topicInput} onChangeText={setTopicInput} onSubmitEditing={handleAddTopic} returnKeyType="done" />
                  <TouchableOpacity style={styles.addTopicBtn} onPress={handleAddTopic}>
                    <Text style={styles.addTopicBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.chipWrap}>
                  {tempTopics.map((t) => (
                    <TouchableOpacity key={t} style={styles.chip} onPress={() => handleRemoveTopic(t)}>
                      <Text style={styles.chipText}>{t} ✕</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {screen === 7 && (
              <View style={styles.optionsWrap}>
                <Text style={styles.courseCount}>{data.courses.length} course{data.courses.length > 1 ? "s" : ""} added</Text>
                <OptionCard label='Yes, add another' selected={false} onPress={() => handleScreen7(true)} />
                <OptionCard label="That's all my courses" selected={false} onPress={() => handleScreen7(false)} />
              </View>
            )}

            {screen === 8 && (
              <View style={styles.optionsWrap}>
                {[
                  { label: "📖 Reading notes", value: "notes" },
                  { label: "🃏 Flashcards", value: "flashcards" },
                  { label: "✍️ Practice problems", value: "practice" },
                  { label: "👥 Study groups", value: "groups" },
                  { label: "🎧 Videos / lectures", value: "videos" },
                ].map((opt) => (
                  <OptionCard key={opt.value} label={opt.label} selected={studyPrefs.includes(opt.value)} onPress={() => togglePref(opt.value)} />
                ))}
              </View>
            )}

            {screen === 9 && (
              <View style={styles.optionsWrap}>
                <OptionCard label="Sounds good, I need this" selected={studyMode === "deep"} onPress={() => handleScreen9("deep")} />
                <OptionCard label="Maybe later" selected={studyMode === "focus"} onPress={() => handleScreen9("focus")} />
              </View>
            )}

            {screen === 10 && (
              <View style={styles.rewardWrap}>
                {showXpBurst && (
                  <Animated.Text style={[styles.xpBurst, { transform: [{ translateY: xpAnim }], opacity: xpOpacity }]}>
                    +50 XP
                  </Animated.Text>
                )}
                {showBadge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Onboarding Complete</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* CTA Button */}
      {screen !== 7 && screen !== 9 && showContent && canAdvance() && (
        <View style={styles.ctaWrap}>
          <TouchableOpacity style={styles.ctaBtn} onPress={handleCta} activeOpacity={0.8}>
            <Text style={styles.ctaBtnText}>{getCtaText()}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  backBtn: {
    position: "absolute",
    top: 56,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  backBtnText: {
    color: colors.text2,
    fontSize: 15,
    fontWeight: "500",
  },
  mascotArea: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  bubbleArea: {
    position: "absolute",
    top: -10,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 10,
  },
  mascotWrap: {
    alignItems: "center",
    marginTop: 60,
  },
  mascot: {
    width: 280,
    height: 280,
  },
  contentWrap: {
    marginTop: 16,
  },
  optionsWrap: {
    gap: 10,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.text1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  helperText: {
    color: colors.text3,
    fontSize: 13,
    fontWeight: "400",
    textAlign: "center",
  },
  skipText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    paddingVertical: 8,
  },
  topicInputRow: {
    flexDirection: "row",
    gap: 10,
  },
  addTopicBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    width: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  addTopicBtnText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700",
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  chip: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chipText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
  },
  courseCount: {
    color: colors.primaryLight,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  rewardWrap: {
    alignItems: "center",
    paddingTop: 20,
  },
  xpBurst: {
    fontSize: 40,
    fontWeight: "800",
    color: colors.gold,
    textAlign: "center",
  },
  badge: {
    backgroundColor: "rgba(155,109,255,0.15)",
    borderRadius: radii.pill,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  badgeText: {
    color: colors.primaryLight,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  ctaWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
    backgroundColor: colors.bg,
  },
  ctaBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 18,
    alignItems: "center",
  },
  ctaBtnText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
