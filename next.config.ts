// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👇 이 부분을 추가합니다.
  experimental: {
    outputFileTracingRoot: __dirname,
  },
};

export default nextConfig;