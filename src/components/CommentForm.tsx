'use client';

import { useState } from 'react';
import axios from 'axios'; // 👈 require 대신 import 사용
import toast from 'react-hot-toast';

interface CommentFormProps {
  postId: number;
  onCommentCreated: () => void;
}

export default function CommentForm({ postId, onCommentCreated }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('댓글을 작성하려면 로그인이 필요합니다.');
      setIsSubmitting(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const promise = axios.post(
      `${apiUrl}/posts/${postId}/comments`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.promise(promise, {
        loading: '댓글 등록 중...',
        success: () => {
            setContent('');
            onCommentCreated();
            return '댓글이 등록되었습니다!';
        },
        error: '댓글 등록에 실패했습니다.',
    });
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 남겨보세요..."
        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
        rows={2}
        required
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md disabled:bg-gray-400"
        >
          {isSubmitting ? '등록 중...' : '댓글 등록'}
        </button>
      </div>
    </form>
  );
}