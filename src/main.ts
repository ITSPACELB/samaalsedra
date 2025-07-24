import { createApp, onMounted } from 'vue'
import { createPinia } from 'pinia'
import './assets/styles/main.scss' // 💥 أهم سطر
import 'bootstrap'
import 'normalize.css'
import App from './App.vue'
import router from './router'

import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import ar from '@/locales/ar.json'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'ar',
  fallbackLocale: 'en',
  messages: {
    en,
    ar
  }
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.provide('i18n', i18n)

app.mount('#app')

// ✅💥 الحل النهائي لتصغير الموقع على السيرفرات
const fixScale = () => {
  const width = window.innerWidth
  const designWidth = 1440 // عدّلي حسب تصميمك الأصلي
  const scale = width / designWidth

  document.body.style.transform = `scale(${scale})`
  document.body.style.transformOrigin = 'top left'
  document.documentElement.style.overflowX = 'auto'
}
fixScale()
window.addEventListener('resize', fixScale)
