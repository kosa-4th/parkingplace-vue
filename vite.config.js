import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    // outDir: '../parkingplace-spring/src/main/resources/static'
    outDir: 'dist', // Vite의 빌드 결과물이 'dist' 폴더에 생성됩니다.
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://parkingback.store',
        changeOrigin : true
      }
    }
  }
})
