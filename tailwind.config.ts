import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4F1E9",
        cream: "#FDFCF8",
        page: "#FFFDF9",
        ink: "#17150F",
        body: "#2A2620",
        muted: "#6E6858",
        faint: "#98917F",
        dust: "#B9B29C",
        line: "#E3DDCC",
        linesoft: "#ECE7D8",
        linedash: "#C9C2AC",
        accent: "#E8501A",
        moss: "#1D6B4C",
        skel: "#ECE7D8",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        pop: "4px 4px 0 #E8501A",
        "pop-sm": "3px 3px 0 #E8501A",
        "pop-ink": "3px 3px 0 #17150F",
        card: "0 2px 0 rgba(23,21,15,0.05)",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(.6)" },
          "70%": { transform: "scale(1.08)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        floatBox: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-7px) rotate(-2deg)" },
        },
      },
      animation: {
        fadeUp: "fadeUp .45s cubic-bezier(.22,1,.36,1) both",
        shimmer: "shimmer 1.4s linear infinite",
        popIn: "popIn .3s both",
        floatBox: "floatBox 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
