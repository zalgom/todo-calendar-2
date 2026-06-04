/**
 * 투두 CRUD 서비스 레이어
 * Supabase와의 모든 데이터 통신을 담당합니다.
 *
 * 참고: Supabase 자동 생성 타입(Database)이 없는 MVP 단계에서는
 * supabase-js의 테이블 타입이 'never'로 추론됩니다.
 * createClient()를 비제네릭으로 사용하고 결과를 as 단언으로 처리합니다.
 */

import { createBrowserClient } from '@supabase/ssr';
import type {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  CalendarDayMeta,
} from '@/types';

// ────────────────────────────────────────────────────────────
// Supabase 클라이언트 (타입 없이 생성하여 'never' 에러 방지)
// ────────────────────────────────────────────────────────────

/**
 * MVP 단계용 Supabase 클라이언트 생성
 * Database 제네릭 없이 사용하여 타입 추론 문제를 우회합니다.
 */
function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ────────────────────────────────────────────────────────────
// 투두 조회
// ────────────────────────────────────────────────────────────

/**
 * 특정 날짜의 투두 목록을 조회합니다.
 * order_index 기준 오름차순 정렬 후 생성일 기준 정렬합니다.
 *
 * @param date - ISO 형식 날짜 문자열 (YYYY-MM-DD)
 * @returns 투두 목록
 */
export async function fetchTodosByDate(date: string): Promise<Todo[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('date', date)
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`투두 조회 실패: ${error.message}`);
  }

  return (data ?? []) as Todo[];
}

// ────────────────────────────────────────────────────────────
// 투두 생성
// ────────────────────────────────────────────────────────────

/**
 * 새로운 투두를 생성합니다.
 * order_index는 해당 날짜의 최대값 + 1로 자동 설정됩니다.
 *
 * @param input - 투두 생성 입력 (content, date)
 * @returns 생성된 투두 항목
 */
export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const supabase = getSupabase();

  // 해당 날짜의 최대 order_index 조회
  const { data: existingRows } = await supabase
    .from('todos')
    .select('order_index')
    .eq('date', input.date)
    .order('order_index', { ascending: false })
    .limit(1);

  const existingTodos = existingRows as Array<{ order_index: number }> | null;
  const nextOrderIndex =
    existingTodos && existingTodos.length > 0
      ? existingTodos[0].order_index + 1
      : 0;

  const { data, error } = await supabase
    .from('todos')
    .insert({
      content: input.content.trim(),
      date: input.date,
      order_index: nextOrderIndex,
      is_done: false,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`투두 생성 실패: ${error.message}`);
  }

  return data as Todo;
}

// ────────────────────────────────────────────────────────────
// 투두 수정
// ────────────────────────────────────────────────────────────

/**
 * 기존 투두를 수정합니다.
 *
 * @param id - 수정할 투두의 UUID
 * @param input - 수정 내용 (content?, is_done?, order_index?)
 * @returns 수정된 투두 항목
 */
export async function updateTodo(
  id: string,
  input: UpdateTodoInput
): Promise<Todo> {
  const supabase = getSupabase();

  // content가 있으면 trim 처리
  const updateData: Record<string, string | boolean | number> = {
    updated_at: new Date().toISOString(),
  };

  if (input.content !== undefined) {
    updateData['content'] = input.content.trim();
  }
  if (input.is_done !== undefined) {
    updateData['is_done'] = input.is_done;
  }
  if (input.order_index !== undefined) {
    updateData['order_index'] = input.order_index;
  }

  const { data, error } = await supabase
    .from('todos')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`투두 수정 실패: ${error.message}`);
  }

  return data as Todo;
}

// ────────────────────────────────────────────────────────────
// 투두 삭제
// ────────────────────────────────────────────────────────────

/**
 * 특정 투두를 삭제합니다.
 *
 * @param id - 삭제할 투두의 UUID
 */
export async function deleteTodo(id: string): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase.from('todos').delete().eq('id', id);

  if (error) {
    throw new Error(`투두 삭제 실패: ${error.message}`);
  }
}

// ────────────────────────────────────────────────────────────
// 캘린더 메타 데이터 조회
// ────────────────────────────────────────────────────────────

/**
 * 특정 연월의 날짜별 투두 현황 메타 데이터를 조회합니다.
 * 캘린더 시각화(인디케이터)에 사용됩니다.
 *
 * @param year - 연도 (예: 2026)
 * @param month - 월 (1~12)
 * @returns 날짜별 메타 데이터 배열
 */
export async function fetchDayMetas(
  year: number,
  month: number
): Promise<CalendarDayMeta[]> {
  const supabase = getSupabase();

  // 월의 시작일과 종료일 계산
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const { data, error } = await supabase
    .from('todos')
    .select('date, is_done')
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) {
    throw new Error(`캘린더 메타 데이터 조회 실패: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // 날짜별로 그룹화하여 집계
  const metaMap = new Map<string, { totalCount: number; doneCount: number }>();

  const typedData = data as Array<{ date: string; is_done: boolean }>;

  for (const todo of typedData) {
    const existing = metaMap.get(todo.date) ?? { totalCount: 0, doneCount: 0 };
    metaMap.set(todo.date, {
      totalCount: existing.totalCount + 1,
      doneCount: existing.doneCount + (todo.is_done ? 1 : 0),
    });
  }

  return Array.from(metaMap.entries()).map(([date, counts]) => ({
    date,
    ...counts,
  }));
}
