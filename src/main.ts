import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'bootstrap'
import App from './App.vue'
import router from './router'

import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ar from './locales/ar.json'

const i18n = createI18n({
  legacy: false,          // ضروري للترجمة الحديثة
  globalInjection: true,  // حتى تشتغل $t بكل مكان
  locale: 'ar',           // اللغة الافتراضية
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
// أهم سطر: أحيانا بصلّح مشكلة الcontext!
app.provide('i18n', i18n)

app.mount('#app')
