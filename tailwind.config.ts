import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          100: "#f3f4f6",
          950: "#08090c",
          900: "#0e1014",
          850: "#141720",
          800: "#1b1f2a",
          700: "#272c39",
          600: "#3a4150",
          500: "#525a6b",
          400: "#78808f",
          300: "#a6adba",
          200: "#ccd1da",
        },
        profit: {
          DEFAULT: "#22c55e",
          dim: "#16653d",
          bg: "rgba(34,197,94,0.12)",
        },
        loss: {
          DEFAULT: "#f43f5e",
          dim: "#7f1d1d",
          bg: "rgba(244,63,94,0.12)",
        },
        accent: {
          DEFAULT: "#22d3ee",
          2: "#8b5cf6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -8px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(34,211,238,0.2), 0 10px 40px -12px rgba(34,211,238,0.35)",
      },
      keyframes: {
        "pop": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.04)" },
          "100%": { transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pop: "pop 220ms ease-out",
        "slide-up": "slide-up 220ms ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
