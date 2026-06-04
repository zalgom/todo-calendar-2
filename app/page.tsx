/**
 * DayTask 메인 페이지
 * 캘린더 + 투두 패널을 2컬럼 레이아웃으로 렌더링합니다.
 */

import AppLayout from '@/components/layout/AppLayout';
import Calendar from '@/components/calendar/Calendar';
import TodoPanel from '@/components/todo/TodoPanel';

/**
 * 메인 페이지 (서버 컴포넌트)
 * AppLayout에 Calendar와 TodoPanel을 주입합니다.
 * 실제 상태 관리는 각 클라이언트 컴포넌트 내부에서 처리합니다.
 */
export default function HomePage() {
  return (
    <AppLayout
      left={<Calendar />}
      right={<TodoPanel />}
    />
  );
}
