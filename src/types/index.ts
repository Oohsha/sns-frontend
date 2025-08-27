// src/types/index.ts
export interface User {
  id: number;
  email?: string;
  nickname: string;
}

export interface Post {
  id: number;
  content: string;
  createdAt: string;
  imageUrl?: string;
  authorId: number;
  author: {
    id: number;
    nickname: string;
  };
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: User;
}