/**
 * CalendarHeader 컴포넌트
 * 캘린더 상단의 연/월 표시 및 이전/다음 달 이동 버튼을 렌더링합니다.
 */

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatYearMonthKo } from '@/lib/dateUtils';

interface CalendarHeaderProps {
  /** 현재 표시 중인 연도 */
  year: number;
  /** 현재 표시 중인 월 (1~12) */
  month: number;
  /** 이전 달 이동 핸들러 */
  onPrevMonth: () => void;
  /** 다음 달 이동 핸들러 */
  onNextMonth: () => void;
  /** 오늘로 이동 핸들러 */
  onGoToToday: () => void;
}

/**
 * 캘린더 헤더 컴포넌트
 * 연월 표시 + 이전/다음 달 버튼 + 오늘 버튼
 */
export default function CalendarHeader({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
}: CalendarHeaderProps) {
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;

  return (
    <div className="flex items-center justify-between mb-4">
      {/* 이전 달 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevMonth}
        aria-label="이전 달"
        className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* 연/월 표시 + 오늘 버튼 */}
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-gray-900 tabular-nums">
          {formatYearMonthKo(year, month)}
        </h2>
        {/* 현재 달이 아닐 때만 오늘 버튼 표시 */}
        {!isCurrentMonth && (
          <Button
            variant="outline"
            size="sm"
            onClick={onGoToToday}
            className="h-6 px-2 text-xs text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            오늘
          </Button>
        )}
      </div>

      {/* 다음 달 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onNextMonth}
        aria-label="다음 달"
        className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
