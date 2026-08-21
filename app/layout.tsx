import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "캠퍼스픽 | 충남대 생명정보학과 인턴 파인더",
  description: "재학생이 지원할 수 있는 충청권 바이오·헬스케어 데이터 분석 인턴을 찾아보세요.",
  openGraph: {
    title: "캠퍼스픽 | 대학생 맞춤 채용공고",
    description: "충남대 생명정보학과 3학년을 위한 충청권 인턴 파인더.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "캠퍼스픽 — 첫 커리어, 헤매지 않도록." }],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "캠퍼스픽 | 대학생 맞춤 채용공고",
    description: "충남대 생명정보학과 3학년을 위한 충청권 인턴 파인더.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
