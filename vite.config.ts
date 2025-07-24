import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import autoprefixer from 'autoprefixer' // إضافة Autoprefixer

// https://vite.dev/config/
export default defineConfig({
  base: './', // ✅ الحل الحقيقي لمشكلة اختلاف الشكل بين Vercel والمحلي
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
        autoprefixer(), // ✅ يضمن تنسيق CSS على كل المتصفحات
      ],
    },
  },
  build: {
    target: 'esnext', // ✅ يضمن أحدث ميزات JS وDOM
    cssTarget: 'chrome100', // ✅ يحاكي بيئة حقيقية للمتصفح
    outDir: 'dist', // ✅ مجلد الإخراج
    emptyOutDir: true, // ✅ تنظيف تلقائي قبل كل build
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
