import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // حل مشكلة المسارات على Vercel
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
      ],
    },
    // في Vite ما في css.loaderOptions.css.url، إذا عندك مشكلة بالمسارات لازم تحلها بطريقة ثانية
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue'],
          'vue-i18n': ['vue-i18n'],
          phosphor: ['@phosphor-icons/vue']
        }
      }
    }
  }
})
