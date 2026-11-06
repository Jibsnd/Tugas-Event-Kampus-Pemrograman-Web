import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/nama-repo-kamu/', // Ganti dengan nama repositori GitHub-mu
})