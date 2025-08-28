// src/app/explore/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { User } from '@/types'; // 전역 타입 사용

export default function ExplorePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`);
        setUsers(response.data);
      } catch (error) {
        console.error('사용자 목록을 불러오는 데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">로딩 중...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">탐색</h1>
      <div className="bg-white rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {users.map(user => (
            <li key={user.id}>
              <Link href={`/profile/${user.nickname}`}>
                <div className="p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-indigo-500"></div>
                  <span className="font-semibold text-gray-800">{user.nickname}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}