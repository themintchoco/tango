import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  resolve: {
    alias: {
      '@/types': path.resolve(__dirname, "./src/@types")
    }
  },
  plugins: [react()],
})
