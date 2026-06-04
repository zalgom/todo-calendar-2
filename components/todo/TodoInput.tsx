/**
 * TodoInput 컴포넌트
 * 새로운 투두를 입력하고 저장하는 폼 컴포넌트입니다.
 * React Hook Form + Zod로 유효성 검사를 처리합니다.
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTodoStore } from '@/store/todoStore';
import { toast } from 'sonner';

// ────────────────────────────────────────────────────────────
// Zod 유효성 검사 스키마
// ────────────────────────────────────────────────────────────

/** 투두 입력 폼 스키마 */
const todoInputSchema = z.object({
  content: z
    .string()
    .min(1, '할 일을 입력해주세요.')
    .max(200, '최대 200자까지 입력할 수 있습니다.')
    .transform((val) => val.trim()),
});

type TodoInputForm = z.infer<typeof todoInputSchema>;

// ────────────────────────────────────────────────────────────
// 컴포넌트
// ────────────────────────────────────────────────────────────

/**
 * 투두 입력 폼 컴포넌트
 * - Enter 키 또는 추가 버튼으로 저장
 * - 빈 텍스트 저장 방지 (Zod 유효성 검사)
 * - 낙관적 업데이트 후 성공/실패 피드백
 */
export default function TodoInput() {
  const { addTodo, selectedDate, isLoading } = useTodoStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TodoInputForm>({
    resolver: zodResolver(todoInputSchema),
    defaultValues: { content: '' },
  });

  /**
   * 폼 제출 핸들러
   * 낙관적 업데이트로 즉시 목록에 반영 후 저장
   */
  const onSubmit = async (data: TodoInputForm) => {
    try {
      await addTodo({
        content: data.content,
        date: selectedDate,
      });
      reset();
      // 성공 토스트는 조용하게 (사용자 경험 방해 최소화)
    } catch {
      toast.error('저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-1"
      noValidate
    >
      <div className="flex gap-2">
        {/* 투두 텍스트 입력 필드 */}
        <div className="flex-1">
          <Input
            {...register('content')}
            type="text"
            placeholder="할 일을 입력하세요..."
            disabled={isSubmitting}
            maxLength={200}
            aria-label="새 할 일 입력"
            aria-invalid={!!errors.content}
            aria-describedby={errors.content ? 'todo-input-error' : undefined}
            className={`
              h-11 text-sm
              border-gray-300 focus:border-blue-500 focus:ring-blue-500
              placeholder:text-gray-400 placeholder:italic
              disabled:opacity-60
              ${errors.content ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}
            `}
          />
        </div>

        {/* 추가 버튼 */}
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white shrink-0"
          aria-label="투두 추가"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">추가</span>
            </>
          )}
        </Button>
      </div>

      {/* 에러 메시지 */}
      {errors.content && (
        <p
          id="todo-input-error"
          role="alert"
          className="text-xs text-red-500 pl-1"
        >
          {errors.content.message}
        </p>
      )}
    </form>
  );
}
