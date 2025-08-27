'use client';

import axios from 'axios'; // 👈 require 대신 import 사용
import toast from 'react-hot-toast';
import { User, Comment } from '@/types';
import Link from 'next/link';

interface CommentListProps {
  comments: Comment[];
  currentUser: User | null;
  onCommentDeleted: (commentId: number) => void;
}

export default function CommentList({ comments, currentUser, onCommentDeleted }: CommentListProps) {

  const handleDelete = async (commentId: number) => {
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
        toast.error('로그인이 필요합니다.');
        return;
    }

    const promise = axios.delete(`http://localhost:3001/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    toast.promise(promise, {
        loading: '삭제 중...',
        success: () => {
            onCommentDeleted(commentId);
            return '댓글이 삭제되었습니다.';
        },
        error: '댓글 삭제에 실패했습니다.',
    });
  };

  if (comments.length === 0) {
    return <div className="mt-6 text-gray-500">아직 댓글이 없습니다.</div>;
  }

  return (
    <div className="mt-6 space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="border-t pt-4 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <Link href={`/profile/${comment.author.nickname}`} className="font-semibold hover:underline">
                {comment.author.nickname}
              </Link>
              <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString('ko-KR')}</p>
            </div>
            {currentUser?.id === comment.author.id && (
              <button onClick={() => handleDelete(comment.id)} className="text-xs text-red-500 hover:text-red-700">
                삭제
              </button>
            )}
          </div>
          <p className="mt-2 text-gray-800 dark:text-gray-200">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}