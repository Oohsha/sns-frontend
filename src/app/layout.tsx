import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { Toaster } from 'react-hot-toast';

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
        <Toaster
          position="top-right"
          toastOptions={{ duration: 3000 }}
        />
        {/* Header를 children 위에 배치하는 것이 올바른 구조입니다. */}
        <Header />
        {/* children을 main 태그로 감싸서 시맨틱 HTML을 유지합니다. */}
        <main className="pt-4 pb-12">
          {children}
        </main>
      </body>
    </html>
  );
}