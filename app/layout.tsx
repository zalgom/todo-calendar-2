/**
 * DayTask 루트 레이아웃
 * 전역 폰트, 메타데이터, Toaster를 설정합니다.
 */

import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

// ── 영문 폰트: Outfit ──
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

// ── 메타데이터 ──
export const metadata: Metadata = {
  title: 'DayTask — 날짜별 할 일 관리',
  description:
    '날짜별로 할 일을 관리하고, 캘린더로 한눈에 진행 상황을 파악할 수 있는 심플한 투두리스트 웹앱',
  keywords: ['투두', '할일', '캘린더', '일정관리', 'DayTask'],
  authors: [{ name: 'DayTask Team' }],
};

// ── 뷰포트 설정 ──
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* 토스트 알림 (shadcn/ui Sonner) */}
        <Toaster
          position="bottom-center"
          richColors
          closeButton
          toastOptions={{
            duration: 5000,
          }}
        />
      </body>
    </html>
  );
}
