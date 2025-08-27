'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface PostFormProps {
  onPostCreated: (newPost: any) => void;
}

export default function PostForm({ onPostCreated }: PostFormProps) {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreview(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim() && !imageFile) {
      toast.error('내용이나 이미지를 추가해주세요.');
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('로그인이 필요합니다.');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    const promise = axios.post(
      'http://localhost:3001/posts',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    toast.promise(promise, {
      loading: '게시글을 작성하는 중...',
      success: (response) => {
        onPostCreated(response.data);
        setContent('');
        setImageFile(null);
        setImagePreview(null);
        return '성공적으로 게시되었습니다!';
      },
      error: '게시글 작성에 실패했습니다.',
    });

    setIsSubmitting(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 border dark:border-gray-700">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="무슨 생각을 하고 있나요?"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
          rows={3}
        />
        {imagePreview && ( <div className="mt-2 relative"> <img src={imagePreview} alt="Preview" className="max-h-40 rounded-md" /> <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5">&times;</button> </div> )}
        <div className="flex justify-between items-center mt-2">
          <input type="file" id="image" accept="image/*" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
            {isSubmitting ? '게시 중...' : '게시'}
          </button>
        </div>
      </form>
    </div>
  );
}