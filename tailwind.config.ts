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
          100: "#f2f2f3",
          950: "#0a0a0b",
          900: "#121214",
          850: "#17181b",
          800: "#1e1f23",
          700: "#2a2b30",
          600: "#3a3c43",
          500: "#54565f",
          400: "#7a7d87",
          300: "#a4a7b0",
          200: "#cdcfd4",
        },
        profit: {
          DEFAULT: "#22c55e",
          dim: "#16653d",
          bg: "rgba(34,197,94,0.1)",
        },
        loss: {
          DEFAULT: "#ef4444",
          dim: "#7f1d1d",
          bg: "rgba(239,68,68,0.1)",
        },
        accent: {
          DEFAULT: "#eab308",
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
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -8px rgba(0,0,0,0.5)",
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
