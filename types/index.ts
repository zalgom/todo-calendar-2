/**
 * DayTask 공통 타입 정의
 * 데이터베이스 스키마 기반 TypeScript 타입 모음
 */

// ────────────────────────────────────────────────────────────
// 데이터베이스 원본 타입
// ────────────────────────────────────────────────────────────

/** todos 테이블의 단일 행 타입 */
export interface Todo {
  id: string;
  content: string;
  is_done: boolean;
  date: string;          // ISO 형식: "YYYY-MM-DD"
  order_index: number;
  created_at: string;
  updated_at: string;
}

// ────────────────────────────────────────────────────────────
// API 입력 타입
// ────────────────────────────────────────────────────────────

/** 투두 생성 시 필요한 입력 타입 */
export interface CreateTodoInput {
  content: string;
  date: string;          // ISO 형식: "YYYY-MM-DD"
}

/** 투두 수정 시 필요한 입력 타입 (모든 필드 선택적) */
export interface UpdateTodoInput {
  content?: string;
  is_done?: boolean;
  order_index?: number;
}

// ────────────────────────────────────────────────────────────
// Zustand 스토어 타입
// ────────────────────────────────────────────────────────────

/** todoStore의 상태 및 액션 타입 */
export interface TodoStore {
  /** 현재 선택된 날짜의 투두 목록 */
  todos: Todo[];
  /** 현재 선택된 날짜 (ISO: "YYYY-MM-DD") */
  selectedDate: string;
  /** 투두 로딩 중 여부 */
  isLoading: boolean;
  /** 에러 메시지 (없으면 null) */
  error: string | null;
  /** 실행 취소를 위해 임시 보관된 삭제된 투두 */
  pendingDeleteTodo: Todo | null;

  // 액션
  setSelectedDate: (date: string) => void;
  fetchTodos: (date: string) => Promise<void>;
  addTodo: (input: CreateTodoInput) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  undoDelete: () => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, input: UpdateTodoInput) => Promise<void>;
  clearPendingDelete: () => void;
}

/** calendarStore의 상태 및 액션 타입 */
export interface CalendarStore {
  /** 현재 캘린더에 표시 중인 연도 */
  currentYear: number;
  /** 현재 캘린더에 표시 중인 월 (1~12) */
  currentMonth: number;
  /** 현재 선택된 날짜 (ISO: "YYYY-MM-DD") */
  selectedDate: string;
  /** 현재 월의 날짜별 투두 메타 데이터 */
  dayMetas: CalendarDayMeta[];
  /** 메타 데이터 로딩 중 여부 */
  isMetaLoading: boolean;

  // 액션
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
  setSelectedDate: (date: string) => void;
  fetchDayMetas: (year: number, month: number) => Promise<void>;
}

// ────────────────────────────────────────────────────────────
// 캘린더 관련 타입
// ────────────────────────────────────────────────────────────

/** 캘린더 날짜 셀의 투두 현황 메타 타입 */
export interface CalendarDayMeta {
  date: string;          // ISO 형식: "YYYY-MM-DD"
  totalCount: number;    // 해당 날짜의 총 투두 수
  doneCount: number;     // 완료된 투두 수
}

/** 캘린더 그리드에서 사용하는 날짜 셀 타입 */
export interface CalendarDayCell {
  date: Date;
  dateString: string;    // ISO 형식: "YYYY-MM-DD"
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  meta: CalendarDayMeta | null;
}

// ────────────────────────────────────────────────────────────
// Supabase 데이터베이스 타입
// ────────────────────────────────────────────────────────────

/** Supabase 데이터베이스 스키마 타입 (자동 생성 대용) */
export interface Database {
  public: {
    Tables: {
      todos: {
        Row: Todo;
        Insert: Omit<Todo, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Todo, 'id'>>;
      };
    };
  };
}
