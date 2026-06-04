-- ============================================================
-- DayTask 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요.
-- ============================================================

-- ── todos 테이블 생성 ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS todos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content     TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 200),
  is_done     BOOLEAN NOT NULL DEFAULT FALSE,
  date        DATE NOT NULL,                    -- 투두가 속한 날짜 (YYYY-MM-DD)
  order_index INTEGER NOT NULL DEFAULT 0,       -- 순서 관리용
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,  -- 투두 소유자
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 조회 최적화 인덱스 ────────────────────────────────────

-- 사용자 + 날짜별 투두 조회 (가장 빈번한 쿼리, RLS 필터링 최적화)
CREATE INDEX IF NOT EXISTS idx_todos_user_date ON todos(user_id, date);

-- 사용자 + 날짜 + 순서 조회 (목록 정렬)
CREATE INDEX IF NOT EXISTS idx_todos_user_date_order ON todos(user_id, date, order_index);

-- 기존 인덱스 (여전히 유효하지만 복합 인덱스가 더 효율적)
CREATE INDEX IF NOT EXISTS idx_todos_date ON todos(date);
CREATE INDEX IF NOT EXISTS idx_todos_date_order ON todos(date, order_index);

-- ── updated_at 자동 갱신 트리거 ───────────────────────────

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- todos 테이블에 트리거 연결
CREATE OR REPLACE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ── Row Level Security (RLS) 설정 ─────────────────────────
-- 사용자 인증 기반 격리: 각 사용자는 자신의 투두만 접근 가능

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 본인 투두만 조회 가능
CREATE POLICY "todos_select_own"
  ON todos FOR SELECT
  USING (auth.uid() = user_id);

-- 본인 투두만 생성 가능
CREATE POLICY "todos_insert_own"
  ON todos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 본인 투두만 수정 가능
CREATE POLICY "todos_update_own"
  ON todos FOR UPDATE
  USING (auth.uid() = user_id);

-- 본인 투두만 삭제 가능
CREATE POLICY "todos_delete_own"
  ON todos FOR DELETE
  USING (auth.uid() = user_id);

-- ── 샘플 데이터 (선택적, 개발 테스트용) ──────────────────

-- 아래 주석을 해제하면 오늘 날짜 기준으로 샘플 투두가 삽입됩니다.
-- INSERT INTO todos (content, date, order_index) VALUES
--   ('기획서 작성하기', CURRENT_DATE, 0),
--   ('팀 미팅 준비', CURRENT_DATE, 1),
--   ('이메일 회신', CURRENT_DATE, 2);
