import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-noto)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-mono)", "monospace"],
      },
      colors: {
        base: {
          bg: "#0c0f1a",
          panel: "#111526",
          panel2: "#161c34",
          deep: "#0e1220",
          line: "#1e2740",
          line2: "#252d50",
        },
        brand: {
          blue: "#8fb3ff",
          "blue-light": "#c8d4ff",
          "blue-dim": "#5a6490",
          green: "#6ce88a",
          "green-light": "#a8ffbe",
          yellow: "#ffcc5c",
          "yellow-light": "#ffe5a0",
          red: "#ff7b7b",
          "red-light": "#ffb3b3",
        },
        text: {
          primary: "#e8eaf6",
          secondary: "#9aa3c8",
          muted: "#8a93b8",
          dim: "#5a6490",
          faint: "#4a5580",
        },
      },
    },
  },
  plugins: [],
};

export default config;
