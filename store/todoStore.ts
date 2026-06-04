/**
 * 투두 Zustand 스토어
 * 선택된 날짜의 투두 목록과 관련 액션을 관리합니다.
 */

'use client';

import { create } from 'zustand';
import type { TodoStore, Todo, CreateTodoInput, UpdateTodoInput } from '@/types';
import {
  fetchTodosByDate,
  createTodo,
  updateTodo,
  deleteTodo,
} from '@/lib/services/todoService';
import { getTodayString } from '@/lib/dateUtils';

const today = getTodayString();

/**
 * 투두 스토어 생성
 * 초기값: 오늘 날짜, 빈 투두 목록
 */
export const useTodoStore = create<TodoStore>((set, get) => ({
  // ────────────────────────────────────────────────────────────
  // 초기 상태
  // ────────────────────────────────────────────────────────────
  todos: [],
  selectedDate: today,
  isLoading: false,
  error: null,
  pendingDeleteTodo: null,

  // ────────────────────────────────────────────────────────────
  // 액션: 날짜 선택 및 투두 조회
  // ────────────────────────────────────────────────────────────

  /** 선택된 날짜를 변경합니다. */
  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
    get().fetchTodos(date);
  },

  /** 선택된 날짜의 투두 목록을 조회합니다. */
  fetchTodos: async (date: string) => {
    set({ isLoading: true, error: null });
    try {
      const todos = await fetchTodosByDate(date);
      set({ todos, selectedDate: date });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '투두 조회 실패';
      set({ error: errorMessage });
      console.error('fetchTodos 실패:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ────────────────────────────────────────────────────────────
  // 액션: 투두 CRUD
  // ────────────────────────────────────────────────────────────

  /** 새로운 투두를 생성합니다. */
  addTodo: async (input: CreateTodoInput) => {
    try {
      const newTodo = await createTodo(input);
      set({
        todos: [...get().todos, newTodo],
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '투두 생성 실패';
      set({ error: errorMessage });
      console.error('addTodo 실패:', error);
    }
  },

  /** 투두를 삭제합니다 (5초 내 실행 취소 가능). */
  deleteTodo: async (id: string) => {
    const todos = get().todos;
    const todoIndex = todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) return;

    const deletedTodo = todos[todoIndex];
    set({
      todos: todos.filter((t) => t.id !== id),
      pendingDeleteTodo: deletedTodo,
    });

    // 서버에 삭제 요청
    try {
      await deleteTodo(id);
      // 5초 후 실행 취소 버튼이 보이지 않으면 pendingDeleteTodo 초기화
      setTimeout(() => {
        set({ pendingDeleteTodo: null });
      }, 5000);
    } catch (error) {
      // 실패 시 목록으로 복원
      set({
        todos: [...todos],
        pendingDeleteTodo: null,
      });
      const errorMessage =
        error instanceof Error ? error.message : '투두 삭제 실패';
      set({ error: errorMessage });
      console.error('deleteTodo 실패:', error);
    }
  },

  /** 삭제된 투두를 복구합니다 (실행 취소). */
  undoDelete: async () => {
    const pendingDeleteTodo = get().pendingDeleteTodo;
    if (!pendingDeleteTodo) return;

    set({
      todos: [...get().todos, pendingDeleteTodo],
      pendingDeleteTodo: null,
    });
  },

  /** 투두를 토글합니다 (완료/미완료). */
  toggleTodo: async (id: string) => {
    const todos = get().todos;
    const todo = todos.find((t) => t.id === id);

    if (!todo) return;

    // 낙관적 업데이트
    set({
      todos: todos.map((t) =>
        t.id === id ? { ...t, is_done: !t.is_done } : t
      ),
    });

    // 서버에 업데이트 요청
    try {
      await updateTodo(id, { is_done: !todo.is_done });
    } catch (error) {
      // 실패 시 원래대로 복원
      set({ todos });
      const errorMessage =
        error instanceof Error ? error.message : '투두 상태 변경 실패';
      set({ error: errorMessage });
      console.error('toggleTodo 실패:', error);
    }
  },

  /** 투두를 수정합니다. */
  updateTodo: async (id: string, input: UpdateTodoInput) => {
    try {
      const updatedTodo = await updateTodo(id, input);
      set({
        todos: get().todos.map((t) => (t.id === id ? updatedTodo : t)),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '투두 수정 실패';
      set({ error: errorMessage });
      console.error('updateTodo 실패:', error);
    }
  },

  // ────────────────────────────────────────────────────────────
  // 액션: 기타
  // ────────────────────────────────────────────────────────────

  /** 실행 취소 대기 중인 투두를 초기화합니다. */
  clearPendingDelete: () => {
    set({ pendingDeleteTodo: null });
  },
}));
