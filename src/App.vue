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

  // ✅ CSS قوي يثبّت الأيقونة والحركات
  const style = document.createElement("style")
  style.innerHTML = `
    /* تثبيت الأيقونة */
    .sama-gpt-fixed {
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      z-index: 999999 !important;
      transition: all 0.3s ease !important;
    }

    /* حركة نبض على الموبايل */
    @keyframes softPulseMobile {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(159, 212, 86, 0.6); }
      70% { transform: scale(1.05); box-shadow: 0 0 0 12px rgba(159, 212, 86, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(159, 212, 86, 0); }
    }

    @media (max-width: 600px) {
      .sama-gpt-fixed {
        width: 56px !important;
        height: 56px !important;
        bottom: 16px !important;
        right: 16px !important;
        animation: softPulseMobile 8s ease-in-out infinite;
      }
    }

    /* إصلاحات عامة */
    html, body, #app {
      transform: none !important;
      contain: none !important;
      overflow: visible !important;
    }
  `
  document.head.appendChild(style)

  // ✅ حركة الأيقونة حسب السكرول
  let lastScroll = window.scrollY
  const chatWrapper = document.querySelector(".sama-gpt-fixed") as HTMLElement

  window.addEventListener("scroll", () => {
    if (!chatWrapper) return

    if (window.scrollY > lastScroll + 10) {
      chatWrapper.style.opacity = "0.5"
      chatWrapper.style.transform = "scale(0.9)"
    } else {
      chatWrapper.style.opacity = "1"
      chatWrapper.style.transform = "scale(1)"
    }
    lastScroll = window.scrollY
  })
})

watch(locale, (newLang) => {
  document.documentElement.lang = newLang
})
</script>

<template>
  <component :is="$route.meta.layout || RootLayout">
    <RouterView />
  </component>
  <!-- ✅ نسخة وحدة للشات مثبّتة -->
  <div class="sama-gpt-fixed">
    <SamaGPTChat />
  </div>
</template>
