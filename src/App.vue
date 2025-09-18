<script setup lang="ts">
import { RouterView } from "vue-router"
import RootLayout from "./layouts/RootLayout.vue"
import "@/assets/styles/main.scss"
import { onMounted, watch } from "vue"
import { useI18n } from "vue-i18n"
import SamaGPTChat from "@/components/SamaGPTChat.vue"

const { locale } = useI18n()

onMounted(() => {
  document.documentElement.lang = locale.value

  // ✅ CSS without any animations or transitions - completely static
  const style = document.createElement("style")
  style.innerHTML = `
    /* Fixed chat position - no animations */
    .sama-gpt-fixed {
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      z-index: 999999 !important;
      /* Removed all transitions and animations */
    }

    /* Mobile responsive - no animations */
    @media (max-width: 600px) {
      .sama-gpt-fixed {
        width: 56px !important;
        height: 56px !important;
        bottom: 16px !important;
        right: 16px !important;
        /* Removed pulse animation */
      }
    }

    /* General fixes */
    html, body, #app {
      transform: none !important;
      contain: none !important;
      overflow: visible !important;
    }
  `
  document.head.appendChild(style)

  // ✅ Removed all scroll-based animations and opacity changes
  // Chat window remains completely static now
})

watch(locale, (newLang) => {
  document.documentElement.lang = newLang
})
</script>

<template>
  <component :is="$route.meta.layout || RootLayout">
    <RouterView />
  </component>
  <!-- ✅ Fixed chat component - completely static -->
  <div class="sama-gpt-fixed">
    <SamaGPTChat />
  </div>
</template>