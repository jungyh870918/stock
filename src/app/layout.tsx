import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "기술 기반 투자 전략 대시보드",
  description: "투자 철학 정리 및 실전 판단 도구",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
