/**
 * TodoList 컴포넌트
 * 투두 목록을 렌더링합니다.
 * 로딩 상태, 빈 상태, 에러 상태를 처리합니다.
 */

'use client';

import { useEffect } from 'react';
import { ClipboardList } from 'lucide-react';
import TodoItem from './TodoItem';
import { Skeleton } from '@/components/ui/skeleton';
import { useTodoStore } from '@/store/todoStore';
import { useCalendarStore } from '@/store/calendarStore';
import { toast } from 'sonner';

// ────────────────────────────────────────────────────────────
// 스켈레톤 UI (로딩 중)
// ────────────────────────────────────────────────────────────

/** 로딩 중 표시할 스켈레톤 UI */
function TodoListSkeleton() {
  return (
    <ul className="space-y-1 px-2" aria-label="투두 목록 로딩 중">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 px-3 py-2.5">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 flex-1 rounded" />
        </li>
      ))}
    </ul>
  );
}

// ────────────────────────────────────────────────────────────
// 빈 상태 UI
// ────────────────────────────────────────────────────────────

/** 투두가 없을 때 표시할 UI */
function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 text-center"
      aria-label="이 날의 할 일이 없습니다"
    >
      <ClipboardList className="h-10 w-10 text-gray-300 mb-3" aria-hidden />
      <p className="text-sm font-medium text-gray-400">
        이 날의 할 일이 없어요
      </p>
      <p className="text-xs text-gray-300 mt-1">
        아래 입력창으로 할 일을 추가해보세요
      </p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ────────────────────────────────────────────────────────────

/**
 * 투두 목록 컴포넌트
 * - todoStore에서 투두 목록, 로딩/에러 상태를 구독
 * - 삭제 시 5초 실행 취소 토스트 표시
 * - 완료 토글, 내용 수정 기능 제공
 */
export default function TodoList() {
  const {
    todos,
    isLoading,
    error,
    pendingDeleteTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    undoDelete,
    clearPendingDelete,
  } = useTodoStore();

  const { fetchDayMetas, currentYear, currentMonth } = useCalendarStore();

  // ── 삭제 실행 취소 토스트 (5초) ──
  useEffect(() => {
    if (!pendingDeleteTodo) return;

    // 5초 후 pending 상태 초기화
    const timer = setTimeout(() => {
      clearPendingDelete();
      // 캘린더 메타 데이터 갱신 (인디케이터 업데이트)
      fetchDayMetas(currentYear, currentMonth);
    }, 5000);

    // 실행 취소 토스트 표시
    toast('할 일을 삭제했습니다.', {
      action: {
        label: '실행 취소',
        onClick: () => {
          clearTimeout(timer);
          undoDelete().then(() => {
            // 취소 후 캘린더 메타 데이터 갱신
            fetchDayMetas(currentYear, currentMonth);
          });
        },
      },
      duration: 5000,
      id: `delete-${pendingDeleteTodo.id}`,
    });

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingDeleteTodo?.id]);

  // ── 에러 토스트 ──
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // ── 핸들러 함수들 ──

  const handleToggle = async (id: string) => {
    await toggleTodo(id);
    fetchDayMetas(currentYear, currentMonth);
  };

  const handleDelete = (id: string) => {
    deleteTodo(id);
  };

  const handleUpdate = (id: string, content: string) => {
    updateTodo(id, { content });
  };

  // ── 렌더링 ──

  if (isLoading) {
    return <TodoListSkeleton />;
  }

  if (todos.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul
      className="space-y-0.5 px-2"
      aria-label="투두 목록"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </ul>
  );
}
