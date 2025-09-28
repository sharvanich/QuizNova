import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/generate-quiz': {
        target: '/api',
        changeOrigin: true,
      },
      '/validate-answer': {
        target: '/api',
        changeOrigin: true,
      },
      '/health': {
        target: '/api',
        changeOrigin: true,
      },
    },
  },
})
