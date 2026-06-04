/**
 * AppLayout 컴포넌트
 * DayTask의 전체 레이아웃을 담당합니다.
 * - 모바일: 단일 컬럼 (캘린더 상단, 투두 하단)
 * - 태블릿: 2컬럼 (캘린더 40%, 투두 60%)
 * - 데스크탑: 2컬럼 (캘린더 35%, 투두 65%)
 */

import React from 'react';

interface AppLayoutProps {
  /** 좌측 패널 (캘린더 영역) */
  left: React.ReactNode;
  /** 우측 패널 (투두 영역) */
  right: React.ReactNode;
}

/**
 * 서버 컴포넌트 - 반응형 2컬럼 레이아웃
 */
export default function AppLayout({ left, right }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── 헤더 ── */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          {/* 브랜드 로고 */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">D</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              DayTask
            </h1>
          </div>
          {/* 부제목 (데스크탑에서만 표시) */}
          <p className="hidden md:block text-sm text-gray-500">
            날짜별 할 일 관리
          </p>
        </div>
      </header>

      {/* ── 메인 콘텐츠 영역 ── */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-full">
          {/* ── 좌측: 캘린더 패널 ── */}
          <section
            className="
              w-full
              md:w-2/5
              lg:w-[35%]
              flex-shrink-0
            "
            aria-label="캘린더"
          >
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              {left}
            </div>
          </section>

          {/* ── 우측: 투두 패널 ── */}
          <section
            className="
              w-full
              md:w-3/5
              lg:w-[65%]
              flex-1
              min-h-0
            "
            aria-label="투두 목록"
          >
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full">
              {right}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
