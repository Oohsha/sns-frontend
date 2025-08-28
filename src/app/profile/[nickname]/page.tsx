'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// 타입 정의 (별도 파일로 분리했거나, 여기에 직접 정의)
interface User {
  id: number;
  nickname: string;
}
interface ProfileData {
  id: number;
  nickname: string;
  bio: string | null;
  _count: { followers: number; following: number; };
  posts: Post[];
  isFollowing: boolean;
}
interface Post {
  id: number;
  content: string;
  imageUrl?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const nickname = params.nickname as string;

  const fetchProfile = useCallback(async () => {
    if (!nickname) return;
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    try {
      const [profileResponse, userResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profiles/${nickname}`, config),
        token ? axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, config) : Promise.resolve(null),
      ]);
      setProfile(profileResponse.data);
      if (userResponse) setCurrentUser(userResponse.data);
    } catch (error) {
      console.error('프로필 정보를 불러오는 데 실패했습니다:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [nickname]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFollowToggle = async () => {
    if (!profile || !currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }
    const token = localStorage.getItem('accessToken');
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profile.nickname}/follow`;
    
    try {
      // Optimistic Update (UI 즉시 변경)
      setProfile(prev => {
        if (!prev) return null;
        const newFollowerCount = prev.isFollowing ? prev._count.followers - 1 : prev._count.followers + 1;
        return {
          ...prev,
          isFollowing: !prev.isFollowing,
          _count: { ...prev._count, followers: newFollowerCount },
        };
      });

      // API 호출
      if (profile.isFollowing) {
        await axios.delete(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (error) {
      console.error('팔로우/언팔로우 처리 실패:', error);
      alert('처리 중 오류가 발생했습니다.');
      fetchProfile(); // 에러 발생 시 원래 상태로 롤백
    }
  };
  
  if (loading) {
    return <div className="text-center mt-10">로딩 중...</div>;
  }
  if (!profile) {
    return (
      <div className="text-center mt-10">
        <p>사용자를 찾을 수 없습니다.</p>
        <Link href="/" className="text-indigo-600 hover:underline mt-4 inline-block">피드로 돌아가기</Link>
      </div>
    );
  }

  const isMyProfile = currentUser?.nickname === profile.nickname;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-indigo-500 flex-shrink-0"></div>
        <div className="flex-grow flex flex-col items-center sm:items-start w-full">
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-2xl font-light text-gray-800 dark:text-gray-100">{profile.nickname}</h1>
            
            {currentUser && !isMyProfile && (
              <button 
                onClick={handleFollowToggle}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                  profile.isFollowing 
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {profile.isFollowing ? '팔로잉' : '팔로우'}
              </button>
            )}
          </div>
          <div className="flex justify-center sm:justify-start space-x-6 mb-3 text-gray-600 dark:text-gray-300">
            <span>게시물 <strong className="font-semibold text-gray-800 dark:text-gray-100">{profile.posts.length}</strong></span>
            <span>팔로워 <strong className="font-semibold text-gray-800 dark:text-gray-100">{profile._count.followers}</strong></span>
            <span>팔로우 <strong className="font-semibold text-gray-800 dark:text-gray-100">{profile._count.following}</strong></span>
          </div>
          <p className="text-gray-700 dark:text-gray-400 text-center sm:text-left">{profile.bio || '자기소개가 없습니다.'}</p>
        </div>
      </div>
      
      {profile.posts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {profile.posts.map(post => (
            <Link href={`/posts/${post.id}`} key={post.id}>
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 group overflow-hidden border border-gray-200 dark:border-gray-600">
                {post.imageUrl ? (
                  <img src={post.imageUrl} alt={post.content || 'post image'} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"/>
                ) : (
                  <div className="flex items-center justify-center h-full p-3">
                    <p className="text-gray-600 dark:text-gray-300 text-sm text-center line-clamp-4">{post.content}</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-md">게시물이 없습니다.</div>
      )}
    </div>
  );
}