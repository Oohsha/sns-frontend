// src/app/my-page/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// 사용자 정보 타입을 정의합니다.
interface UserProfile {
  id: number;
  email: string;
  nickname: string;
}

export default function MyPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      // 1. localStorage에서 accessToken을 가져옵니다.
      const token = localStorage.getItem('accessToken');

      if (!token) {
        // 토큰이 없으면 로그인 페이지로 리디렉션합니다.
        alert('로그인이 필요합니다.');
        router.push('/login');
        return;
      }

      try {
        // 2. 토큰을 Authorization 헤더에 담아 '내 정보 조회' API를 호출합니다.
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer 토큰 형식
          },
        });
        setUser(response.data); // 성공 시 사용자 정보를 state에 저장
      } catch (error) {
        // 토큰이 유효하지 않은 경우 (예: 만료)
        console.error('프로필 조회 실패:', error);
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('accessToken'); // 만료된 토큰 삭제
        router.push('/login');
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchUserProfile();
  }, [router]); // useEffect 의존성 배열에 router 추가

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!user) {
    // user 정보가 없는 경우 (리디렉션 되기 전 잠시 보일 수 있음)
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">마이 페이지</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>이메일:</strong> {user.email}</p>
        <p><strong>닉네임:</strong> {user.nickname}</p>
      </div>
    </div>
  );
}