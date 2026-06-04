/**
 * 날짜 관련 유틸리티 함수 모음
 * DayTask 전반에서 날짜 처리에 사용됩니다.
 */

// ────────────────────────────────────────────────────────────
// 날짜 포맷팅
// ────────────────────────────────────────────────────────────

/**
 * Date 객체를 ISO 날짜 문자열로 변환합니다.
 *
 * @param date - 변환할 Date 객체
 * @returns "YYYY-MM-DD" 형식의 문자열
 */
export function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 오늘 날짜를 ISO 날짜 문자열로 반환합니다.
 *
 * @returns "YYYY-MM-DD" 형식의 오늘 날짜
 */
export function getTodayString(): string {
  return toDateString(new Date());
}

/**
 * ISO 날짜 문자열을 한국어 형식으로 포맷합니다.
 *
 * @param dateString - "YYYY-MM-DD" 형식의 날짜
 * @param options - 포맷 옵션 (기본: 연/월/일/요일 모두 표시)
 * @returns 한국어 포맷 날짜 문자열 (예: "2026년 6월 4일 (목)")
 */
export function formatDateKo(
  dateString: string,
  options: {
    showYear?: boolean;
    showDay?: boolean;
    showWeekday?: boolean;
  } = { showYear: true, showDay: true, showWeekday: true }
): string {
  const date = new Date(dateString + 'T00:00:00');
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = weekdays[date.getDay()];

  let result = '';

  if (options.showYear !== false) {
    result += `${year}년 `;
  }

  result += `${month}월`;

  if (options.showDay !== false) {
    result += ` ${day}일`;
  }

  if (options.showWeekday !== false) {
    result += ` (${weekday})`;
  }

  return result.trim();
}

/**
 * ISO 날짜 문자열로부터 연/월을 한국어로 포맷합니다.
 *
 * @param year - 연도
 * @param month - 월 (1~12)
 * @returns "YYYY년 M월" 형식의 문자열
 */
export function formatYearMonthKo(year: number, month: number): string {
  return `${year}년 ${month}월`;
}

// ────────────────────────────────────────────────────────────
// 캘린더 날짜 계산
// ────────────────────────────────────────────────────────────

/**
 * 특정 연월의 캘린더 그리드에 필요한 날짜 배열을 생성합니다.
 * 일요일 시작 기준, 6주(42일) 형태로 반환합니다.
 *
 * @param year - 연도
 * @param month - 월 (1~12)
 * @returns 캘린더 그리드용 Date 배열 (42개)
 */
export function getCalendarDays(year: number, month: number): Date[] {
  // 해당 월의 1일
  const firstDay = new Date(year, month - 1, 1);
  // 해당 월의 마지막 날
  const lastDay = new Date(year, month, 0);

  // 1일의 요일 (0: 일요일 ~ 6: 토요일)
  const startWeekday = firstDay.getDay();

  // 그리드 시작 날짜 (이전 달 날짜 포함)
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - startWeekday);

  // 42일(6주) 분량의 날짜 생성
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + i);
    days.push(day);
  }

  // 마지막 주가 모두 다음 달이면 제거 (5주로 줄임)
  const lastWeekStart = days[35];
  if (lastWeekStart.getMonth() !== lastDay.getMonth()) {
    return days.slice(0, 35);
  }

  return days;
}

/**
 * 특정 날짜가 오늘인지 확인합니다.
 *
 * @param dateString - "YYYY-MM-DD" 형식의 날짜
 * @returns 오늘이면 true
 */
export function isToday(dateString: string): boolean {
  return dateString === getTodayString();
}

/**
 * 두 날짜 문자열이 같은 월인지 확인합니다.
 *
 * @param dateString - "YYYY-MM-DD" 형식의 날짜
 * @param year - 비교할 연도
 * @param month - 비교할 월 (1~12)
 * @returns 같은 월이면 true
 */
export function isSameMonth(
  dateString: string,
  year: number,
  month: number
): boolean {
  const date = new Date(dateString + 'T00:00:00');
  return date.getFullYear() === year && date.getMonth() + 1 === month;
}

// ────────────────────────────────────────────────────────────
// 날짜 이동 계산
// ────────────────────────────────────────────────────────────

/**
 * 이전 달의 연도와 월을 계산합니다.
 *
 * @param year - 현재 연도
 * @param month - 현재 월 (1~12)
 * @returns 이전 달의 { year, month }
 */
export function getPrevMonth(
  year: number,
  month: number
): { year: number; month: number } {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }
  return { year, month: month - 1 };
}

/**
 * 다음 달의 연도와 월을 계산합니다.
 *
 * @param year - 현재 연도
 * @param month - 현재 월 (1~12)
 * @returns 다음 달의 { year, month }
 */
export function getNextMonth(
  year: number,
  month: number
): { year: number; month: number } {
  if (month === 12) {
    return { year: year + 1, month: 1 };
  }
  return { year, month: month + 1 };
}
