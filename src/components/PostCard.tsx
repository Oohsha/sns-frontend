'use client';

import Link from 'next/link';
import { Post } from '@/types';
import { Heart, MessageCircle } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      {/* 카드 헤더: 프로필 사진 & 닉네임 */}
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex-shrink-0"></div>
        <div className="ml-4">
          <Link href={`/profile/${post.author.nickname}`} className="font-semibold text-gray-800 dark:text-gray-100 hover:underline">
            {post.author.nickname}
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(post.createdAt).toLocaleString('ko-KR')}
          </p>
        </div>
      </div>
      
      {/* 카드 본문: 이미지 및 내용 */}
      <Link href={`/posts/${post.id}`}>
        <div className="block cursor-pointer">
          {post.imageUrl && (
            <div className="w-full bg-gray-100 dark:bg-gray-900">
              {/* 이미지 비율을 유지하면서 컨테이너에 맞춤 */}
              <img src={post.imageUrl} alt={`Post by ${post.author.nickname}`} className="w-full h-auto max-h-[70vh] object-contain" />
            </div>
          )}
          {post.content && (
            <p className="p-4 text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
              {post.content}
            </p>
          )}
        </div>
      </Link>

      {/* 카드 푸터: 좋아요, 댓글 버튼 */}
      <div className="p-4 flex items-center space-x-4 text-gray-500 dark:text-gray-400">
        <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
          <Heart size={22} />
          {/* <span className="font-semibold text-sm">0</span> */}
        </button>
        <Link href={`/posts/${post.id}`} className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
          <MessageCircle size={22} />
          {/* <span className="font-semibold text-sm">0</span> */}
        </Link>
      </div>
    </div>
  );
}