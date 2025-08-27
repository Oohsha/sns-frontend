'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // useEffect는 페이지 이동 시에도 로그인 상태를 체크하기 위해 조금 더 개선할 수 있지만,
  // 현재 구조에서는 최초 로드 시 한 번만 체크합니다.
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []); // 비어있는 의존성 배열은 컴포넌트 마운트 시 한 번만 실행됨을 의미

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    alert('로그아웃 되었습니다.');
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 dark:bg-gray-800">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          My SNS
        </Link>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            // --- 로그인 상태 메뉴 ---
            <>
              {/* 👇 '탐색' 메뉴가 추가되었습니다. */}
              <Link href="/explore" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
                탐색
              </Link>
              <Link href="/my-page" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
                마이페이지
              </Link>
              <button onClick={handleLogout} className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
                로그아웃
              </button>
            </>
          ) : (
            // --- 로그아웃 상태 메뉴 ---
            <>
              <Link href="/login" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
                로그인
              </Link>
              <Link href="/signup" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
                회원가입
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}