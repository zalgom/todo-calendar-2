/**
 * TodoPanel 컴포넌트
 * 투두 패널 전체를 감싸는 컨테이너입니다.
 * 날짜 헤더 + 투두 목록 + 투두 입력폼으로 구성됩니다.
 */

'use client';

import { useEffect } from 'react';
import { CalendarDays } from 'lucide-react';
import TodoList from './TodoList';
import TodoInput from './TodoInput';
import { useTodoStore } from '@/store/todoStore';
import { formatDateKo, getTodayString, isToday } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

/**
 * 투두 패널 컴포넌트
 * - 선택된 날짜 표시 (오늘인 경우 강조)
 * - 투두 목록 (스크롤 가능)
 * - 하단 투두 입력폼 (고정)
 */
export default function TodoPanel() {
  const { selectedDate, todos, fetchTodos } = useTodoStore();

  // 컴포넌트 마운트 시 오늘 날짜의 투두 초기 조회
  useEffect(() => {
    fetchTodos(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSelectedToday = isToday(selectedDate);

  // 완료된 투두 수
  const doneCount = todos.filter((t) => t.is_done).length;
  const totalCount = todos.length;

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      {/* ── 날짜 헤더 ── */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <CalendarDays
              className={cn(
                'h-4 w-4 shrink-0 mt-0.5',
                isSelectedToday ? 'text-blue-600' : 'text-gray-400'
              )}
              aria-hidden
            />
            <div>
              {/* 선택된 날짜 표시 */}
              <h2
                className={cn(
                  'text-sm font-semibold leading-tight',
                  isSelectedToday ? 'text-blue-700' : 'text-gray-800'
                )}
              >
                {formatDateKo(selectedDate)}
                {isSelectedToday && (
                  <span className="ml-2 text-xs font-medium text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                    오늘
                  </span>
                )}
              </h2>
            </div>
          </div>

          {/* 완료 현황 표시 */}
          {totalCount > 0 && (
            <div className="text-xs text-gray-400 shrink-0 mt-0.5">
              <span className={doneCount === totalCount ? 'text-green-500 font-medium' : ''}>
                {doneCount}
              </span>
              <span> / {totalCount} 완료</span>
            </div>
          )}
        </div>
      </div>

      {/* ── 투두 목록 (스크롤 영역) ── */}
      <div className="flex-1 overflow-y-auto py-2 min-h-0">
        <TodoList />
      </div>

      {/* ── 투두 입력 폼 (고정 하단) ── */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
        <TodoInput />
      </div>
    </div>
  );
}
