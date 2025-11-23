import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      global: "globalThis",
      'process.env.REACT_APP_GOOGLE_AI_API_KEY': JSON.stringify(env.REACT_APP_GOOGLE_AI_API_KEY),
      'process.env.REACT_APP_API_BASE_URL': JSON.stringify(env.REACT_APP_API_BASE_URL),
      'process.env.REACT_APP_ENV': JSON.stringify(env.REACT_APP_ENV)
    },
    server: {
      proxy: {
        '/chat-websocket': {
          // target: 'http://localhost:8080', // Đích đến là backend
          target: 'http://103.218.123.178:8080',
          ws: true, // Hỗ trợ WebSocket
          changeOrigin: true, // Thay đổi header Origin để tránh CORS
          secure: false // Không yêu cầu HTTPS trong môi trường phát triển
        }
      }
    }
  }
})