"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Theme = "dark" | "light";
interface ThemeCtx { theme: Theme; toggle: () => void; }
const Ctx = createContext<ThemeCtx>({ theme: "dark", toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const s = localStorage.getItem("theme") as Theme | null;
    if (s) setTheme(s);
  }, []);
  const toggle = () => setTheme((t) => {
    const n = t === "dark" ? "light" : "dark";
    localStorage.setItem("theme", n);
    return n;
  });
  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;
}

export function useTheme() { return useContext(Ctx); }

export const THEME = {
  dark: {
    bg: "#0c0f1a", panel: "#111526", panel2: "#161c34", deep: "#0e1220",
    line: "#1e2740", line2: "#252d50",
    text: "#e8eaf6", textSub: "#9aa3c8", textMuted: "#8a93b8",
    textDim: "#5a6490", textFaint: "#4a5580",
    accent: "#8fb3ff", accentText: "#c8d4ff",
    green: "#6ce88a", greenLight: "#a8ffbe",
    yellow: "#ffcc5c", yellowLight: "#ffe5a0",
    red: "#ff7b7b", redLight: "#ffb3b3",
    chartBg: "#0e1220",
    hlBlueBg: "rgba(143,179,255,0.07)", hlGreenBg: "rgba(108,232,138,0.07)",
    hlYellowBg: "rgba(255,204,92,0.07)", hlRedBg: "rgba(255,123,123,0.07)",
    sceneBg: "#0e1220", sceneBorder: "#252d50",
    tabActiveBorder: "#8fb3ff", tagBlueBg: "rgba(143,179,255,0.15)", tagBlueColor: "#8fb3ff",
    tagRedBg: "rgba(255,123,123,0.15)", tagRedColor: "#ff9f9f",
    tagGreenBg: "rgba(108,232,138,0.15)", tagGreenColor: "#7bf09a",
  },
  light: {
    bg: "#f2f5fb", panel: "#ffffff", panel2: "#eef2fa", deep: "#e8eef8",
    line: "#d0daf0", line2: "#bccae8",
    text: "#0f1a30", textSub: "#2a3a60", textMuted: "#3a4e78",
    textDim: "#5a6a90", textFaint: "#7a8aaa",
    accent: "#2461cc", accentText: "#1a4aa0",
    green: "#1a7a40", greenLight: "#124e28",
    yellow: "#8a5800", yellowLight: "#6a4200",
    red: "#b81c1c", redLight: "#8e1414",
    chartBg: "#f8faff",
    hlBlueBg: "rgba(36,97,204,0.07)", hlGreenBg: "rgba(26,122,64,0.07)",
    hlYellowBg: "rgba(138,88,0,0.07)", hlRedBg: "rgba(184,28,28,0.07)",
    sceneBg: "#e8eef8", sceneBorder: "#bccae8",
    tabActiveBorder: "#2461cc", tagBlueBg: "rgba(36,97,204,0.12)", tagBlueColor: "#1a4aa0",
    tagRedBg: "rgba(184,28,28,0.12)", tagRedColor: "#8e1414",
    tagGreenBg: "rgba(26,122,64,0.12)", tagGreenColor: "#124e28",
  },
} as const;
