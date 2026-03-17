import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // env load karega (.env, .env.development, etc.)
  const env = loadEnv(mode, process.cwd())
  const proxyTarget = env.VITE_API_URL || 'http://localhost:5000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget, // env se URL lega; warna local backend
          changeOrigin: true,
          secure: proxyTarget.startsWith('https://'),
        },
      },
    },
  }
})