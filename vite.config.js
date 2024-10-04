// import { fileURLToPath, URL } from 'node:url'

// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     }
//   },
//   build: {
//     outDir: '../parkingplace-spring/src/main/resources/static'
//   },
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://www.parkingplace.store/'
//       }
//     }
//   }
// })
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  // mode에 따라 환경 변수를 로드 (development, production 등)
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd());

  console.log('vite config VITE_API_URL: ', env.VITE_API_URL);

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      outDir: 'dist',  // Vite의 빌드 결과물이 'dist' 폴더에 생성됩니다.
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL,  // 환경 변수에서 API URL을 읽음, 기본값 설정
          changeOrigin: true,  // 요청의 출처 헤더를 백엔드 주소로 변경
          secure: false,  // HTTPS 사용 시 self-signed SSL을 허용
        }
      }
    }
  };
});