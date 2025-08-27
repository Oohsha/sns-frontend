'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import PostForm from '@/components/PostForm';
import { useInView } from 'react-intersection-observer';
import { Post } from '@/types';
import PostCard from '@/components/PostCard'; // 👈 PostCard import

const PAGE_LIMIT = 5;

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [feedType, setFeedType] = useState<'personal' | 'global'>('global');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.5 });

  // ... (useEffect 및 fetchPosts, handlePostCreated 함수는 이전과 동일)

  const fetchPosts = useCallback(async (pageNum: number, type: 'personal' | 'global', isNewFeed: boolean) => {
    if (isNewFeed) setLoading(true);
    const token = localStorage.getItem('accessToken');
    let endpoint = '';
    if (type === 'personal' && token) {
      endpoint = `http://localhost:3001/posts/feed?page=${pageNum}&limit=${PAGE_LIMIT}`;
    } else {
      endpoint = `http://localhost:3001/posts?page=${pageNum}&limit=${PAGE_LIMIT}`;
    }
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    try {
      const response = await axios.get(endpoint, config);
      const newPosts = response.data;
      if (newPosts.length < PAGE_LIMIT) setHasMore(false);
      setPosts(prev => isNewFeed ? newPosts : [...prev, ...newPosts]);
      setPage(prev => pageNum + 1);
    } catch (error) { console.error('게시글 로딩 실패:', error); }
    finally { if (isNewFeed) setLoading(false); }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
      setFeedType('personal');
    } else {
      setIsLoggedIn(false);
      setFeedType('global');
    }
  }, []);
  
  useEffect(() => {
    if (isLoggedIn !== null) {
      setPosts([]);
      setPage(1);
      setHasMore(true);
      fetchPosts(1, feedType, true);
    }
  }, [feedType, isLoggedIn, fetchPosts]);

  useEffect(() => {
    if (inView && !loading && hasMore) {
      fetchPosts(page, feedType, false);
    }
  }, [inView, loading, hasMore, page, feedType, fetchPosts]);

  const handlePostCreated = () => {
    if (feedType !== 'personal') setFeedType('personal');
    else {
      setPosts([]);
      setPage(1);
      setHasMore(true);
      fetchPosts(1, 'personal', true);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      {/* ... (탭 UI는 이전과 동일) ... */}
      
      {isLoggedIn && (
        <div className="flex justify-center mb-6 border-b dark:border-gray-700">
          <button onClick={() => setFeedType('personal')} className={`px-6 py-3 text-base font-semibold transition-colors ${feedType === 'personal' ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}>내 피드</button>
          <button onClick={() => setFeedType('global')} className={`px-6 py-3 text-base font-semibold transition-colors ${feedType === 'global' ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}>전체 피드</button>
        </div>
      )}

      {isLoggedIn && feedType === 'personal' && <PostForm onPostCreated={handlePostCreated} />}
      
      {(loading && page === 1) ? <div className="text-center mt-10">로딩 중...</div> :
       posts.length === 0 ? <div className="text-center mt-10 text-gray-500">{isLoggedIn ? '표시할 게시글이 없습니다.' : '게시글이 없습니다.'}</div> : (
        <div className="space-y-6">
          {posts.map((post) => (
            // 👇 PostCard 컴포넌트로 교체!
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
      
      {hasMore && !loading && <div ref={ref} className="h-10"></div>}
      {!hasMore && posts.length > 0 && <div className="text-center my-4 text-gray-500">모든 게시글을 불러왔습니다.</div>}
    </div>
  );
}