/**
 * Calendar 컴포넌트 (캘린더 컨테이너)
 * CalendarHeader + CalendarGrid를 조합하고
 * calendarStore / todoStore와 연결합니다.
 */

'use client';

import { useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import { useCalendarStore } from '@/store/calendarStore';
import { useTodoStore } from '@/store/todoStore';

/**
 * 캘린더 컨테이너 컴포넌트
 * - 캘린더 스토어에서 상태 구독
 * - 날짜 선택 시 todoStore.setSelectedDate 호출
 * - 월 이동 시 캘린더 메타 데이터 재조회
 */
export default function Calendar() {
  const {
    currentYear,
    currentMonth,
    selectedDate,
    dayMetas,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    setSelectedDate: setCalendarDate,
    fetchDayMetas,
  } = useCalendarStore();

  const { setSelectedDate: setTodoDate } = useTodoStore();

  // 월이 변경되면 해당 월의 메타 데이터 조회
  useEffect(() => {
    fetchDayMetas(currentYear, currentMonth);
  }, [currentYear, currentMonth, fetchDayMetas]);

  /**
   * 날짜 클릭 핸들러
   * - 캘린더 스토어의 선택 날짜 업데이트
   * - 투두 스토어의 선택 날짜 업데이트 (투두 목록 자동 조회)
   */
  const handleSelectDate = (dateString: string) => {
    setCalendarDate(dateString);
    setTodoDate(dateString);
  };

  return (
    <div>
      {/* 캘린더 헤더: 연/월 표시 + 이동 버튼 */}
      <CalendarHeader
        year={currentYear}
        month={currentMonth}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onGoToToday={goToToday}
      />

      {/* 캘린더 그리드: 요일 라벨 + 날짜 셀 */}
      <CalendarGrid
        year={currentYear}
        month={currentMonth}
        selectedDate={selectedDate}
        dayMetas={dayMetas}
        onSelectDate={handleSelectDate}
      />

      {/* 범례 */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
          <span>할 일 있음</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          <span>모두 완료</span>
        </div>
      </div>
    </div>
  );
}
