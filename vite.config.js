import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 注意：將 'your-repo-name' 替換為您的 GitHub Repository 名稱
  // 例如您的 repo 叫 "cantonese-app"，這裡就填 "/cantonese-app/"
  base: '/cantonese-app/', 
})