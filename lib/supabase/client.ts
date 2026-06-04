/**
 * Supabase 브라우저 클라이언트 생성 모듈
 * 클라이언트 컴포넌트에서 사용
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types';

/**
 * 브라우저 환경에서 Supabase 클라이언트를 생성합니다.
 * 클라이언트 컴포넌트('use client')에서만 호출하세요.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
