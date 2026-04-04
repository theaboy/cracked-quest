// StudyQuest Design System — from moodboard v1.0
// Fonts: Sora (display/headings), DM Sans (body)
// For React Native, use system fonts as fallback until custom fonts are loaded

export const colors = {
  bg: "#0C0C10",
  surface: "#141418",
  surface2: "#1C1C22",
  surface3: "#242430",
  border: "#2E2E3E",

  primary: "#9B6DFF",
  primaryLight: "#B99BFF",
  primaryDark: "#6B3FD4",
  mauve: "#C4A4FF",

  gold: "#F5C842",
  goldDark: "#C49A1A",

  white: "#FFFFFF",
  text1: "#F0EFF8",
  text2: "#9896AA",
  text3: "#5C5B6E",

  danger: "#FF5757",
  success: "#4EFFB4",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 40,
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 50,
} as const;

export const fonts = {
  // Display: Sora — use bold system font as fallback
  display: {
    fontWeight: "800" as const,
    letterSpacing: -0.3,
  },
  heading: {
    fontWeight: "700" as const,
  },
  subhead: {
    fontWeight: "600" as const,
  },
  body: {
    fontWeight: "400" as const,
  },
  label: {
    fontWeight: "600" as const,
    letterSpacing: 1.5,
    textTransform: "uppercase" as const,
  },
} as const;
