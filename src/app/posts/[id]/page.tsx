'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import CommentForm from '@/components/CommentForm';
import CommentList from '@/components/CommentList';

// 타입 정의
interface User {
  id: number;
  email?: string;
  nickname: string;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: User;
}

interface Post {
  id: number;
  content: string;
  createdAt: string;
  imageUrl?: string;
  authorId: number;
  author: User;
}

export default function PostDetailPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const postPromise = axios.get(`${apiUrl}/posts/${id}`);
    const commentsPromise = axios.get(`${apiUrl}/posts/${id}/comments`);
    const userPromise = token 
      ? axios.get(`${apiUrl}/user/me`, { headers: { Authorization: `Bearer ${token}` } }) 
      : Promise.resolve(null);

    try {
      const results = await Promise.allSettled([postPromise, commentsPromise, userPromise]);

      const postResult = results[0];
      if (postResult.status === 'fulfilled') {
        setPost(postResult.value.data);
      } else {
        console.error('게시글 정보 로딩 실패:', postResult.reason);
      }
      const commentsResult = results[1];
      if (commentsResult.status === 'fulfilled') {
        setComments(commentsResult.value.data);
      } else {
        console.error('댓글 정보 로딩 실패:', commentsResult.reason);
      }
      const userResult = results[2];
      if (userResult.status === 'fulfilled' && userResult.value !== null) {
        setCurrentUser(userResult.value.data);
      } else if (userResult.status === 'rejected') {
        console.error('사용자 정보 로딩 실패:', userResult.reason);
      }
    } catch (error) {
      console.error('데이터를 불러오는 중 예기치 않은 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const refreshComments = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${apiUrl}/posts/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('댓글 목록 새로고침 실패:', error);
    }
  };

  const handleCommentDeleted = (deletedCommentId: number) => {
    setComments(prevComments => prevComments.filter(comment => comment.id !== deletedCommentId));
  };
  
  const handleDelete = async () => {
    if (!post) return;
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      const token = localStorage.getItem('accessToken');
      if (!token) { alert('로그인이 필요합니다.'); return; }
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        await axios.delete(`${apiUrl}/posts/${post.id}`, { headers: { Authorization: `Bearer ${token}` } });
        alert('게시글이 삭제되었습니다.');
        router.push('/');
      } catch (error) {
        console.error('게시글 삭제 실패:', error);
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  const handleEdit = () => {
    if (!post) return;
    setIsEditing(true);
    setEditedContent(post.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!post) return;
    const token = localStorage.getItem('accessToken');
    if (!token) { alert('로그인이 필요합니다.'); return; }
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}`,
        { content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost(response.data);
      setIsEditing(false);
      alert('게시글이 수정되었습니다.');
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글 수정에 실패했습니다.');
    }
  };

  const isOwner = currentUser && post && currentUser.id === post.authorId;

  if (loading) {
    return <div className="text-center mt-10">로딩 중...</div>;
  }

  if (!post) {
    return (
      <div className="text-center mt-10">
        <p>게시글을 찾을 수 없습니다.</p>
        <Link href="/" className="text-indigo-600 hover:underline mt-4 inline-block">피드로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-500 mr-4"></div>
            <div>
              <p className="font-semibold text-gray-800">{post.author.nickname}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          {isOwner && (
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded">저장</button>
                  <button onClick={handleCancelEdit} className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded">취소</button>
                </>
              ) : (
                <>
                  <button onClick={handleEdit} className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded">수정</button>
                  <button onClick={handleDelete} className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded">삭제</button>
                </>
              )}
            </div>
          )}
        </div>
        <div className="mt-4">
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={5}
            />
          ) : (
            <>{post.content && <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>}</>
          )}
        </div>
        {post.imageUrl && (
          <div className="mt-4">
            <img src={post.imageUrl} alt={`Post by ${post.author.nickname}`} className="max-w-full h-auto rounded-lg" />
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-4">
        <h2 className="text-xl font-bold mb-4">댓글 ({comments.length})</h2>
        {currentUser && <CommentForm postId={post.id} onCommentCreated={refreshComments} />}
        <CommentList comments={comments} currentUser={currentUser} onCommentDeleted={handleCommentDeleted} />
      </div>
    </div>
  );
}