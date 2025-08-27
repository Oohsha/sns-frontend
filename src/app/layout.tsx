import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google'; // 1. Google Font import
import './globals.css';
import Header from '@/components/Header';
import { Toaster } from 'react-hot-toast'; // 2. react-hot-toast import

// 폰트 설정
const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'My SNS Project',
  description: 'Full-stack SNS project with Next.js and NestJS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.className} bg-gray-50 text-gray-900 dark:bg-black dark:text-gray-100`}>
        <Toaster // 3. Toaster 컴포넌트 추가
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
        <Header />
        <main className="pt-4 pb-12">{children}</main>
      </body>
    </html>
  );
}