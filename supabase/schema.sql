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
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 날짜 기반 조회 최적화 인덱스 ──────────────────────────

-- 날짜별 투두 조회 (가장 빈번한 쿼리)
CREATE INDEX IF NOT EXISTS idx_todos_date ON todos(date);

-- 날짜 + 순서 조회 (목록 정렬)
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
-- MVP 단계: 인증 없이 전체 공개 (Phase 3에서 사용자 인증 후 수정 예정)

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 todos를 읽을 수 있음 (MVP: 익명 접근 허용)
CREATE POLICY "todos_select_all"
  ON todos FOR SELECT
  USING (true);

-- 모든 사용자가 todos를 추가할 수 있음 (MVP: 익명 접근 허용)
CREATE POLICY "todos_insert_all"
  ON todos FOR INSERT
  WITH CHECK (true);

-- 모든 사용자가 todos를 수정할 수 있음 (MVP: 익명 접근 허용)
CREATE POLICY "todos_update_all"
  ON todos FOR UPDATE
  USING (true);

-- 모든 사용자가 todos를 삭제할 수 있음 (MVP: 익명 접근 허용)
CREATE POLICY "todos_delete_all"
  ON todos FOR DELETE
  USING (true);

-- ── 샘플 데이터 (선택적, 개발 테스트용) ──────────────────

-- 아래 주석을 해제하면 오늘 날짜 기준으로 샘플 투두가 삽입됩니다.
-- INSERT INTO todos (content, date, order_index) VALUES
--   ('기획서 작성하기', CURRENT_DATE, 0),
--   ('팀 미팅 준비', CURRENT_DATE, 1),
--   ('이메일 회신', CURRENT_DATE, 2);
