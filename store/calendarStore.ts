/**
 * 캘린더 Zustand 스토어
 * 현재 표시 중인 월, 선택된 날짜, 날짜별 투두 메타 데이터를 관리합니다.
 */

'use client';

import { create } from 'zustand';
import type { CalendarStore, CalendarDayMeta } from '@/types';
import { fetchDayMetas } from '@/lib/services/todoService';
import {
  getTodayString,
  getPrevMonth,
  getNextMonth,
} from '@/lib/dateUtils';

const today = new Date();

/**
 * 캘린더 스토어 생성
 * 초기값: 오늘 날짜가 속한 연/월, 오늘 날짜 선택
 */
export const useCalendarStore = create<CalendarStore>((set, get) => ({
  // ────────────────────────────────────────────────────────────
  // 초기 상태
  // ────────────────────────────────────────────────────────────
  currentYear: today.getFullYear(),
  currentMonth: today.getMonth() + 1,
  selectedDate: getTodayString(),
  dayMetas: [] as CalendarDayMeta[],
  isMetaLoading: false,

  // ────────────────────────────────────────────────────────────
  // 액션: 월 이동
  // ────────────────────────────────────────────────────────────

  /** 이전 달로 이동하고 해당 월의 메타 데이터를 조회합니다. */
  goToPrevMonth: () => {
    const { currentYear, currentMonth } = get();
    const { year, month } = getPrevMonth(currentYear, currentMonth);
    set({ currentYear: year, currentMonth: month });
    get().fetchDayMetas(year, month);
  },

  /** 다음 달로 이동하고 해당 월의 메타 데이터를 조회합니다. */
  goToNextMonth: () => {
    const { currentYear, currentMonth } = get();
    const { year, month } = getNextMonth(currentYear, currentMonth);
    set({ currentYear: year, currentMonth: month });
    get().fetchDayMetas(year, month);
  },

  /** 오늘 날짜로 이동하고 오늘이 속한 달의 메타 데이터를 조회합니다. */
  goToToday: () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const todayStr = getTodayString();
    set({ currentYear: year, currentMonth: month, selectedDate: todayStr });
    get().fetchDayMetas(year, month);
  },

  // ────────────────────────────────────────────────────────────
  // 액션: 날짜 선택
  // ────────────────────────────────────────────────────────────

  /** 날짜를 선택합니다. (투두 패널에 해당 날짜의 투두 표시) */
  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
  },

  // ────────────────────────────────────────────────────────────
  // 액션: 메타 데이터 조회
  // ────────────────────────────────────────────────────────────

  /**
   * 특정 연월의 날짜별 투두 현황 메타 데이터를 조회합니다.
   * Supabase 설정이 없으면 빈 배열 반환 (graceful degradation)
   */
  fetchDayMetas: async (year: number, month: number) => {
    // Supabase 환경변수가 없으면 스킵
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return;
    }

    set({ isMetaLoading: true });
    try {
      const metas = await fetchDayMetas(year, month);
      set({ dayMetas: metas });
    } catch (error) {
      console.error('캘린더 메타 데이터 조회 실패:', error);
      // 에러 발생 시 빈 배열 유지
    } finally {
      set({ isMetaLoading: false });
    }
  },
}));
