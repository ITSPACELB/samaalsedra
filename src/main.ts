import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/styles/main.scss' // 💥 أهم سطر
import 'bootstrap'
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
