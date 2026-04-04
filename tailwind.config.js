// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#0C0C10",
        surface: { DEFAULT: "#141418", 2: "#1C1C22", 3: "#242430" },
        border: "#2E2E3E",
        primary: { DEFAULT: "#9B6DFF", light: "#B99BFF", dark: "#6B3FD4" },
        mauve: "#C4A4FF",
        gold: { DEFAULT: "#F5C842", dark: "#C49A1A" },
        text1: "#F0EFF8",
        text2: "#9896AA",
        text3: "#5C5B6E",
        danger: "#FF5757",
        success: "#4EFFB4",
      },
    },
  },
  plugins: [],
};
