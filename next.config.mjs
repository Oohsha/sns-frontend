// 1. 필요한 모듈을 import 합니다.
import path from 'path';
import { fileURLToPath } from 'url';

// 2. ESM 환경에서 __dirname을 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 3. experimental 밖으로 꺼내서 최상위 레벨로 이동
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;