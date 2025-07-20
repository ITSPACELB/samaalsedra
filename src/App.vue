<script setup lang="ts">
import { RouterView } from "vue-router"
import RootLayout from "./layouts/RootLayout.vue"
import "@/assets/styles/main.scss"
import SamaGPTChat from "@/components/SamaGPTChat.vue"

import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

onMounted(() => {
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
  <!-- SamaGPT Chat دائماً موجود بكل الموقع -->
  <SamaGPTChat />
</template>
