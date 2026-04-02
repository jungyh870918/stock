import React from "react";

/* ── Section label (monospace, uppercase) ── */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] tracking-[0.15em] uppercase mb-3"
      style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#4a5580" }}
    >
      {children}
    </p>
  );
}

/* ── Group heading with left border ── */
export function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[15px] font-bold mt-7 mb-3.5 pl-2.5"
      style={{ color: "#8fb3ff", borderLeft: "3px solid #8fb3ff" }}
    >
      {children}
    </h2>
  );
}

/* ── Card wrapper ── */
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[14px] p-5 mb-3 ${className}`}
      style={{ background: "#111526", border: "1px solid #1e2740" }}
    >
      {children}
    </div>
  );
}

/* ── Card title ── */
export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14px] font-bold mb-2.5" style={{ color: "#c8d4ff" }}>
      {children}
    </p>
  );
}

/* ── Body text ── */
export function BodyText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[13px] leading-[1.8] my-2 ${className}`} style={{ color: "#9aa3c8" }}>
      {children}
    </p>
  );
}

/* ── Highlight block ── */
type HlVariant = "default" | "danger" | "warn" | "green";
const hlStyles: Record<HlVariant, { borderColor: string; bg: string; color: string }> = {
  default: { borderColor: "#8fb3ff", bg: "rgba(143,179,255,0.07)", color: "#c8d4ff" },
  danger: { borderColor: "#ff7b7b", bg: "rgba(255,123,123,0.07)", color: "#ffb3b3" },
  warn: { borderColor: "#ffcc5c", bg: "rgba(255,204,92,0.07)", color: "#ffe5a0" },
  green: { borderColor: "#6ce88a", bg: "rgba(108,232,138,0.07)", color: "#a8ffbe" },
};
export function Hl({ children, variant = "default", className = "" }: { children: React.ReactNode; variant?: HlVariant; className?: string }) {
  const s = hlStyles[variant];
  return (
    <span
      className={`block my-2.5 px-3.5 py-2.5 text-[13px] font-medium leading-7 ${className}`}
      style={{ borderLeft: `3px solid ${s.borderColor}`, background: s.bg, color: s.color, borderRadius: "0 8px 8px 0" }}
    >
      {children}
    </span>
  );
}

/* ── Scene / example box ── */
export function SceneBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-[10px] p-4 my-2.5"
      style={{ background: "#0e1220", border: "1px solid #252d50" }}
    >
      <p
        className="text-[10px] tracking-[0.12em] uppercase mb-2"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#4a5580" }}
      >
        {label}
      </p>
      <p className="text-[13px] leading-[1.8]" style={{ color: "#8a93b8" }}>
        {children}
      </p>
    </div>
  );
}

/* ── Mini card (inside split grid) ── */
export function MiniCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[10px] p-3 ${className}`}
      style={{ background: "#161c34", border: "1px solid #1e2740" }}
    >
      {children}
    </div>
  );
}

/* ── Split 2-col grid ── */
export function Split2({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2.5">{children}</div>
  );
}

/* ── Horizontal divider ── */
export function Divider() {
  return <div className="my-4" style={{ height: "1px", background: "#1a2038" }} />;
}

/* ── Tag variants ── */
export function Tag({ children, variant = "blue" }: { children: React.ReactNode; variant?: "blue" | "red" | "green" }) {
  const styles = {
    blue: { bg: "rgba(143,179,255,0.15)", color: "#8fb3ff" },
    red: { bg: "rgba(255,123,123,0.15)", color: "#ff9f9f" },
    green: { bg: "rgba(108,232,138,0.15)", color: "#7bf09a" },
  };
  const s = styles[variant];
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-[11px] font-medium mx-0.5"
      style={{ background: s.bg, color: s.color }}
    >
      {children}
    </span>
  );
}

/* ── Alloc bar segment ── */
export function AllocBar({ segments }: { segments: { pct: number; color: string; label: string }[] }) {
  return (
    <div className="flex rounded-lg overflow-hidden h-7 my-3">
      {segments.map((seg, i) => (
        <div
          key={i}
          className="flex items-center justify-center text-[10px] font-bold transition-all duration-500"
          style={{ width: `${seg.pct}%`, background: seg.color, color: seg.pct > 10 ? "#0c0f1a" : "transparent" }}
        >
          {seg.pct > 10 ? seg.label : ""}
        </div>
      ))}
    </div>
  );
}
