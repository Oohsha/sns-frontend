/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {}, // 이 부분만 수정
    autoprefixer: {},
  },
};
export default config;