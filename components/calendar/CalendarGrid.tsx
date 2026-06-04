/**
 * CalendarGrid 컴포넌트
 * 요일 라벨과 날짜 셀 그리드(7열 × 5~6행)를 렌더링합니다.
 */

'use client';

import CalendarDay from './CalendarDay';
import { getCalendarDays, toDateString, isToday } from '@/lib/dateUtils';
import type { CalendarDayMeta } from '@/types';

// 요일 레이블 (일요일 시작)
const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

interface CalendarGridProps {
  /** 현재 표시 중인 연도 */
  year: number;
  /** 현재 표시 중인 월 (1~12) */
  month: number;
  /** 현재 선택된 날짜 (ISO: "YYYY-MM-DD") */
  selectedDate: string;
  /** 날짜별 투두 메타 데이터 */
  dayMetas: CalendarDayMeta[];
  /** 날짜 선택 핸들러 */
  onSelectDate: (dateString: string) => void;
}

/**
 * 캘린더 그리드 컴포넌트
 * 요일 헤더 + 날짜 셀 그리드를 렌더링합니다.
 */
export default function CalendarGrid({
  year,
  month,
  selectedDate,
  dayMetas,
  onSelectDate,
}: CalendarGridProps) {
  // 캘린더 그리드 날짜 배열 생성
  const calendarDays = getCalendarDays(year, month);

  // 날짜별 메타 데이터를 빠르게 조회하기 위한 Map
  const metaMap = new Map<string, CalendarDayMeta>(
    dayMetas.map((meta) => [meta.date, meta])
  );

  return (
    <div role="grid" aria-label={`${year}년 ${month}월 캘린더`}>
      {/* 요일 라벨 행 */}
      <div
        role="row"
        className="grid grid-cols-7 mb-1"
      >
        {WEEKDAY_LABELS.map((label, index) => (
          <div
            key={label}
            role="columnheader"
            className={`
              text-center text-xs font-medium py-1
              ${index === 0 ? 'text-red-500' : ''}
              ${index === 6 ? 'text-blue-500' : ''}
              ${index !== 0 && index !== 6 ? 'text-gray-500' : ''}
            `}
            aria-label={['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][index]}
          >
            {label}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div
        role="rowgroup"
        className="grid grid-cols-7 gap-0.5"
      >
        {calendarDays.map((date) => {
          const dateStr = toDateString(date);
          const isCurrentMonth = date.getMonth() + 1 === month;
          const meta = metaMap.get(dateStr) ?? null;

          return (
            <div key={dateStr} role="gridcell">
              <CalendarDay
                day={date.getDate()}
                dateString={dateStr}
                isCurrentMonth={isCurrentMonth}
                isToday={isToday(dateStr)}
                isSelected={dateStr === selectedDate}
                meta={meta}
                onClick={isCurrentMonth ? onSelectDate : () => {}}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
