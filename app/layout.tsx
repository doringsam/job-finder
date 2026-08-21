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
  title: "캠퍼스픽 | 대학생 맞춤 채용공고",
  description: "전공과 관심 분야에 꼭 맞는 인턴·신입 채용공고를 가볍게 찾아보세요.",
  openGraph: {
    title: "캠퍼스픽 | 대학생 맞춤 채용공고",
    description: "첫 커리어, 헤매지 않도록. 나에게 맞는 인턴·신입 공고를 찾아보세요.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "캠퍼스픽 — 첫 커리어, 헤매지 않도록." }],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "캠퍼스픽 | 대학생 맞춤 채용공고",
    description: "첫 커리어, 헤매지 않도록. 나에게 맞는 인턴·신입 공고를 찾아보세요.",
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
