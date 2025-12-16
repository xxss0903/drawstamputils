import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/', // 生产环境使用根路径
  build: {
    outDir: "dist", // Cloudflare Pages 默认使用 dist 目录
    minify: 'esbuild', // 生产环境启用压缩
    sourcemap: false // 生产环境不生成 sourcemap
  }
})

