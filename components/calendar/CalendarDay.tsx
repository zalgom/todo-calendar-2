/**
 * CalendarDay 컴포넌트
 * 캘린더 그리드의 단일 날짜 셀을 렌더링합니다.
 * 선택 상태, 오늘 여부, 투두 인디케이터 등을 시각적으로 표현합니다.
 */

'use client';

import { cn } from '@/lib/utils';
import type { CalendarDayMeta } from '@/types';

interface CalendarDayProps {
  /** 날짜 숫자 (1~31) */
  day: number;
  /** ISO 형식 날짜 문자열 (YYYY-MM-DD) */
  dateString: string;
  /** 현재 표시 중인 달의 날짜인지 여부 */
  isCurrentMonth: boolean;
  /** 오늘 날짜인지 여부 */
  isToday: boolean;
  /** 현재 선택된 날짜인지 여부 */
  isSelected: boolean;
  /** 해당 날짜의 투두 메타 데이터 (없으면 null) */
  meta: CalendarDayMeta | null;
  /** 날짜 클릭 핸들러 */
  onClick: (dateString: string) => void;
}

/**
 * 단일 날짜 셀 컴포넌트
 *
 * 시각적 상태:
 * - 오늘: 파란 배경 + 흰 텍스트
 * - 선택됨: 파란 테두리
 * - 다른 달: 회색 (opacity 50%)
 * - 투두 있음: 주황 점 하단 표시
 * - 모두 완료: 초록 점 하단 표시
 */
export default function CalendarDay({
  day,
  dateString,
  isCurrentMonth,
  isToday,
  isSelected,
  meta,
  onClick,
}: CalendarDayProps) {
  // 투두 인디케이터 유형 계산
  const hasTodos = meta !== null && meta.totalCount > 0;
  const isAllDone = hasTodos && meta.doneCount === meta.totalCount;

  return (
    <button
      type="button"
      onClick={() => onClick(dateString)}
      aria-label={`${dateString}${isToday ? ' (오늘)' : ''}${isSelected ? ' (선택됨)' : ''}`}
      aria-selected={isSelected}
      aria-current={isToday ? 'date' : undefined}
      className={cn(
        // 기본 스타일: 최소 터치 영역 40x40px, 반응형 크기
        'relative flex flex-col items-center justify-center',
        'w-full aspect-square rounded-lg',
        'text-sm font-medium transition-colors duration-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',

        // 현재 달이 아닌 날짜
        !isCurrentMonth && 'text-gray-300 cursor-default',

        // 현재 달 날짜의 기본 스타일
        isCurrentMonth && !isToday && 'text-gray-700 hover:bg-gray-100 cursor-pointer',

        // 오늘 날짜
        isToday && 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer',

        // 선택된 날짜 (오늘이 아닌 경우에만 테두리 표시)
        isSelected && !isToday && 'ring-2 ring-blue-500 ring-inset bg-blue-50 text-blue-700'
      )}
    >
      {/* 날짜 숫자 */}
      <span className="leading-none">{day}</span>

      {/* 투두 인디케이터 점 */}
      {hasTodos && (
        <span
          className={cn(
            'absolute bottom-1 left-1/2 -translate-x-1/2',
            'w-1 h-1 rounded-full',
            // 모두 완료: 초록, 일부 있음: 주황
            isAllDone
              ? isToday
                ? 'bg-green-300'
                : 'bg-green-500'
              : isToday
              ? 'bg-orange-300'
              : 'bg-orange-400'
          )}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
