import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue'],
          'vue-i18n': ['vue-i18n'],
          phosphor: ['@phosphor-icons/vue']
          // 🔴 شلنا vue3-lottie لأنو عم يطلع chunk فاضي
        }
      }
    }
  }
})
