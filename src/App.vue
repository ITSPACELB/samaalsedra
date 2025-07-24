<script setup lang="ts">
import { RouterView } from "vue-router"
import RootLayout from "./layouts/RootLayout.vue"
import "@/assets/styles/main.scss"
import SamaGPTChat from "@/components/SamaGPTChat.vue"

import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

onMounted(() => {
  // ✅ تحديد لغة الصفحة
  document.documentElement.lang = locale.value

})

watch(locale, (newLang) => {
  document.documentElement.lang = newLang
})
</script>

<template>
  <component :is="$route.meta.layout || RootLayout">
    <RouterView />
  </component>
  <SamaGPTChat />
</template>

<style>
/* ===== إصلاح مشاكل العرض العام بكل المتصفحات ===== */
:root {
  font-size: 16px;
}

html, body {
  margin: 0;
  padding: 0;
  overflow-x: visible !important;
  max-width: 100vw;
  font-family: 'Tajawal', sans-serif;
  scroll-behavior: smooth;
}

* {
  box-sizing: border-box;
}

.container,
.row,
.section {
  overflow: visible !important;
  position: relative;
}

.side-text, .vertical-text, .floating-title {
  position: absolute;
  z-index: 5;
}
</style>
