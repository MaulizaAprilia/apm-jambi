import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendTarget = env.API_PROXY_TARGET || 'http://127.0.0.1:8000'
  const proxy = {
    '/api': {
      target: backendTarget,
      changeOrigin: true,
    },
    '/storage': {
      target: backendTarget,
      changeOrigin: true,
    },
  }

  return {
    base: '/', // <-- TAMBAHKAN INI agar path asset diawali dari root '/'
    plugins: [
      react(),
      tailwindcss()
    ],
    server: {
      port: 3000,
      host: true,
      allowedHosts: [
        'exerciser-dragonish-critter.ngrok-free.dev',
        '.ngrok-free.dev',
      ],
      proxy,
    },
    preview: {
      port: 4173,
      host: true,
      allowedHosts: [
        'exerciser-dragonish-critter.ngrok-free.dev',
        '.ngrok-free.dev',
      ],
      proxy,
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    }
  }
})