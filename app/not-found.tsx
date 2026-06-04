/**
 * 404 Not Found 페이지
 * 존재하지 않는 경로에 접근했을 때 표시됩니다.
 */

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        {/* 로고 */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg font-bold">D</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">DayTask</span>
        </div>

        {/* 에러 내용 */}
        <h1 className="text-6xl font-bold text-gray-200 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          페이지를 찾을 수 없어요
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>

        {/* 홈으로 이동 버튼 */}
        <Link
          href="/"
          className="inline-flex items-center justify-center h-8 gap-1.5 px-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
