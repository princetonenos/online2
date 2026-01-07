import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/online2/',
  plugins: [vue()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  }
})

