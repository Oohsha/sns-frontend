// src/components/CommentList.tsx
'use client';

// User와 Comment 타입을 여기에 직접 정의하거나, 별도 types 파일에서 import
interface User {
  id: number;
  nickname: string;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: User;
}

interface CommentListProps {
  comments: Comment[];
  currentUser: User | null;
  onCommentDeleted: (commentId: number) => void; // 댓글 삭제 성공 시 부모에게 알릴 함수
}

export default function CommentList({ comments, currentUser, onCommentDeleted }: CommentListProps) {
  const axios = require('axios'); // axios import for local scope

  const handleDelete = async (commentId: number) => {
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }

    try {
        await axios.delete(`http://localhost:3001/comments/${commentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        onCommentDeleted(commentId); // 부모에게 댓글이 삭제되었음을 알림
    } catch (error) {
        console.error('댓글 삭제 실패:', error);
        alert('댓글 삭제에 실패했습니다.');
    }
  };

  if (comments.length === 0) {
    return <div className="mt-6 text-gray-500">아직 댓글이 없습니다.</div>;
  }

  return (
    <div className="mt-6 space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="border-t pt-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{comment.author.nickname}</p>
              <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
            </div>
            {currentUser?.id === comment.author.id && (
              <button onClick={() => handleDelete(comment.id)} className="text-xs text-red-500 hover:text-red-700">
                삭제
              </button>
            )}
          </div>
          <p className="mt-2 text-gray-800">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}