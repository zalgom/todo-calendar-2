/**
 * Supabase 서버 클라이언트 생성 모듈
 * 서버 컴포넌트, Route Handler, Server Action에서 사용
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types';

/**
 * 서버 환경에서 Supabase 클라이언트를 생성합니다.
 * 서버 컴포넌트 또는 Route Handler에서만 호출하세요.
 *
 * @returns Supabase 서버 클라이언트 인스턴스
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // 서버 컴포넌트에서 쿠키 설정 시 발생할 수 있는 에러 무시
            // (읽기 전용 서버 컴포넌트에서는 setAll이 호출되지 않음)
          }
        },
      },
    }
  );
}
