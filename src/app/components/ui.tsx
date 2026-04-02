import React from "react";
import { THEME, useTheme, type Theme } from "@/app/context/ThemeContext";

export function useC() {
  const { theme } = useTheme();
  return THEME[theme];
}

export function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const c = useC();
  return (
    <p className={className} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px", color: c.textFaint }}>
      {children}
    </p>
  );
}

export function GroupHeading({ children }: { children: React.ReactNode }) {
  const c = useC();
  return (
    <h2 style={{ fontSize: "15px", fontWeight: 700, marginTop: "28px", marginBottom: "14px", paddingLeft: "10px", borderLeft: `3px solid ${c.accent}`, color: c.accent }}>
      {children}
    </h2>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const c = useC();
  return (
    <div className={className} style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "14px", padding: "20px", marginBottom: "12px" }}>
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  const c = useC();
  return <p style={{ fontSize: "14px", fontWeight: 700, marginBottom: "10px", color: c.accentText }}>{children}</p>;
}

export function BodyText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const c = useC();
  return <p className={className} style={{ fontSize: "13px", lineHeight: "1.8", margin: "8px 0", color: c.textSub }}>{children}</p>;
}

type HlVariant = "default" | "danger" | "warn" | "green";
export function Hl({ children, variant = "default", className = "" }: { children: React.ReactNode; variant?: HlVariant; className?: string }) {
  const c = useC();
  const styles: Record<HlVariant, { borderColor: string; bg: string; color: string }> = {
    default: { borderColor: c.accent, bg: c.hlBlueBg, color: c.accentText },
    danger: { borderColor: c.red, bg: c.hlRedBg, color: c.redLight },
    warn: { borderColor: c.yellow, bg: c.hlYellowBg, color: c.yellowLight },
    green: { borderColor: c.green, bg: c.hlGreenBg, color: c.greenLight },
  };
  const s = styles[variant];
  return (
    <span className={className} style={{ display: "block", margin: "10px 0", padding: "10px 14px", borderLeft: `3px solid ${s.borderColor}`, background: s.bg, color: s.color, borderRadius: "0 8px 8px 0", fontSize: "13px", fontWeight: 500, lineHeight: 1.7 }}>
      {children}
    </span>
  );
}

export function SceneBox({ label, children }: { label: string; children: React.ReactNode }) {
  const c = useC();
  return (
    <div style={{ background: c.sceneBg, border: `1px solid ${c.sceneBorder}`, borderRadius: "10px", padding: "14px 16px", margin: "10px 0" }}>
      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: c.textFaint, marginBottom: "8px" }}>{label}</p>
      <p style={{ fontSize: "13px", lineHeight: "1.8", color: c.textMuted }}>{children}</p>
    </div>
  );
}

export function MiniCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const c = useC();
  return (
    <div className={className} style={{ background: c.panel2, border: `1px solid ${c.line}`, borderRadius: "10px", padding: "12px 14px" }}>
      {children}
    </div>
  );
}

export function Split2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>{children}</div>;
}

export function Divider() {
  const c = useC();
  return <div style={{ height: "1px", background: c.line, margin: "18px 0" }} />;
}

export function Tag({ children, variant = "blue" }: { children: React.ReactNode; variant?: "blue" | "red" | "green" }) {
  const c = useC();
  const s = {
    blue: { bg: c.tagBlueBg, color: c.tagBlueColor },
    red: { bg: c.tagRedBg, color: c.tagRedColor },
    green: { bg: c.tagGreenBg, color: c.tagGreenColor },
  }[variant];
  return <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 500, margin: "2px", background: s.bg, color: s.color }}>{children}</span>;
}
