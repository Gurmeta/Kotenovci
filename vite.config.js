import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is injected by the GitHub Actions workflow as /<repo-name>/ for GitHub Pages;
// falls back to '/' for local dev and other hosts.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})
