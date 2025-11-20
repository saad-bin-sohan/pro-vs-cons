import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase chunk warning limit to avoid noisy warnings from large vendor bundles
    chunkSizeWarningLimit: 1500,
  },
})
