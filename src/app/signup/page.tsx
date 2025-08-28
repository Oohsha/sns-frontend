// src/app/signup/page.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const router = useRouter();

  // "가입하기" 버튼을 눌렀을 때 실행될 함수
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // 1. 폼의 기본 동작(새로고침)을 막습니다.
    event.preventDefault();

    // 2. try...catch 블록으로 API 호출을 감쌉니다.
    try {
      // 3. 백엔드 API로 회원가입 요청을 보냅니다. (await 사용)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          email,
          password,
          nickname,
        },
      );

      // 4. 회원가입 성공 시
      if (response.status === 201) {
        alert('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
        router.push('/login'); // 로그인 페이지로 이동
      }
    } catch (error) {
      // 5. 회원가입 실패 시
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message);
      } else {
        alert('회원가입 중 알 수 없는 오류가 발생했습니다.');
      }
      console.error('회원가입 실패:', error);
    }
  }; // handleSubmit 함수는 여기서 끝납니다.

  // 화면에 보여질 JSX 부분
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이메일 입력 필드 */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          {/* 비밀번호 입력 필드 */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          {/* 닉네임 입력 필드 */}
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700"
            >
              닉네임
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          {/* 제출 버튼 */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              가입하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}