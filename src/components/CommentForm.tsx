// src/components/CommentForm.tsx
'use client';

import { useState } from 'react';

interface CommentFormProps {
  postId: number;
  onCommentCreated: () => void; // 댓글 생성 성공 시 부모에게 알릴 함수
}

export default function CommentForm({ postId, onCommentCreated }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const axios = require('axios'); // axios import for local scope

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('댓글을 작성하려면 로그인이 필요합니다.');
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        `http://localhost:3001/posts/${postId}/comments`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent('');
      onCommentCreated(); // 부모에게 댓글이 생성되었음을 알림
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 남겨보세요..."
        className="w-full p-2 border border-gray-300 rounded-md"
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