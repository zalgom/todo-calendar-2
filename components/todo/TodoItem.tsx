/**
 * TodoItem 컴포넌트
 * 단일 투두 항목을 렌더링합니다.
 * 체크박스, 텍스트(인라인 수정), 삭제 버튼을 포함합니다.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Todo } from '@/types';

interface TodoItemProps {
  /** 투두 데이터 */
  todo: Todo;
  /** 완료 상태 토글 핸들러 */
  onToggle: (id: string) => void;
  /** 삭제 핸들러 */
  onDelete: (id: string) => void;
  /** 내용 수정 핸들러 */
  onUpdate: (id: string, content: string) => void;
}

/**
 * 단일 투두 항목 컴포넌트
 *
 * 인터랙션:
 * - 체크박스: 완료/미완료 토글
 * - 텍스트 더블클릭: 인라인 편집 모드
 * - 편집 중 Enter: 저장
 * - 편집 중 Escape: 취소
 * - 편집 중 포커스 아웃: 저장
 * - 삭제 버튼: hover 시 표시 (항상 포커스로 접근 가능)
 */
export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}: TodoItemProps) {
  // 인라인 편집 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.content);
  const editInputRef = useRef<HTMLInputElement>(null);

  // 편집 모드 진입 시 인풋에 포커스
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      // 커서를 텍스트 끝으로 이동
      editInputRef.current.setSelectionRange(
        editValue.length,
        editValue.length
      );
    }
  }, [isEditing, editValue.length]);

  // todo.content가 외부에서 변경되면 editValue 동기화
  useEffect(() => {
    setEditValue(todo.content);
  }, [todo.content]);

  /** 편집 모드 시작 */
  const startEditing = () => {
    setEditValue(todo.content);
    setIsEditing(true);
  };

  /** 편집 저장 */
  const saveEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== todo.content) {
      onUpdate(todo.id, trimmed);
    }
    setIsEditing(false);
  };

  /** 편집 취소 */
  const cancelEdit = () => {
    setEditValue(todo.content);
    setIsEditing(false);
  };

  /** 편집 인풋 키보드 핸들러 */
  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <li
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 rounded-lg',
        'transition-colors duration-100',
        'hover:bg-gray-50',
        todo.is_done && 'opacity-60'
      )}
    >
      {/* 체크박스 */}
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.is_done}
        onCheckedChange={() => onToggle(todo.id)}
        aria-label={`"${todo.content}" ${todo.is_done ? '완료됨 - 클릭하여 미완료로 변경' : '미완료 - 클릭하여 완료로 변경'}`}
        className="shrink-0 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
      />

      {/* 투두 텍스트 / 인라인 편집 인풋 */}
      {isEditing ? (
        <input
          ref={editInputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleEditKeyDown}
          onBlur={saveEdit}
          maxLength={200}
          aria-label="투두 내용 수정"
          className={cn(
            'flex-1 text-sm bg-white border border-blue-400 rounded px-2 py-0.5',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
            'text-gray-900'
          )}
        />
      ) : (
        <label
          htmlFor={`todo-${todo.id}`}
          onDoubleClick={startEditing}
          title="더블클릭하여 수정"
          className={cn(
            'flex-1 text-sm cursor-pointer select-none',
            'text-gray-800 leading-relaxed',
            // 완료 시 취소선 + 회색
            todo.is_done && 'line-through text-gray-400'
          )}
        >
          {todo.content}
        </label>
      )}

      {/* 삭제 버튼: hover 시 표시 (포커스로도 접근 가능) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        aria-label={`"${todo.content}" 삭제`}
        className={cn(
          'shrink-0 h-7 w-7 text-gray-400',
          'hover:text-red-500 hover:bg-red-50',
          // 평상시에는 보이지 않다가 호버/포커스 시 표시
          'opacity-0 group-hover:opacity-100 focus:opacity-100',
          'transition-opacity duration-100'
        )}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </li>
  );
}
