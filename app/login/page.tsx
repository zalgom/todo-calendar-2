/**
 * 로그인 페이지
 * 중앙 카드 레이아웃으로 로그인 폼을 렌더링합니다.
 */

import LoginForm from './LoginForm';

export const metadata = {
  title: 'DayTask - 로그인',
  description: '날짜별 할 일 관리 서비스에 로그인하세요',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* 로고 영역 */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-lg font-bold">D</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DayTask</h1>
          <p className="text-gray-600">날짜별 할 일 관리</p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
