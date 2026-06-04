import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url);
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const cookieStore = await cookies();
  const supabase = createServerClient(
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
            // 쿠키 설정 실패 무시
          }
        },
      },
    }
  );

  // 세션 확인
  const { data: { user } } = await supabase.auth.getUser();

  // 비로그인 사용자 → /login으로 리다이렉트
  if (!user && requestUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 로그인한 사용자 → /login에서 /로 리다이렉트
  if (user && requestUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 쿠키 변경사항 반영
  response.headers.set('set-cookie', cookieStore.toString());

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
