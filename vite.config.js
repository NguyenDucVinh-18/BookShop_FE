import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      // Load environment variables properly
      'process.env.REACT_APP_GOOGLE_AI_API_KEY': JSON.stringify(env.REACT_APP_GOOGLE_AI_API_KEY),
      'process.env.REACT_APP_API_BASE_URL': JSON.stringify(env.REACT_APP_API_BASE_URL),
      'process.env.REACT_APP_ENV': JSON.stringify(env.REACT_APP_ENV)
    }
  }
})
