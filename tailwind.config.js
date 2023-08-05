/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 解决 button `background-color: transparent;` 问题 https://www.jianshu.com/p/2162daf865d9。
  },
};
