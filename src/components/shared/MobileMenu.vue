<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue"
import logo from "/images/logo.png"
import { useI18n } from "vue-i18n"

type Props = {
  mobileMenu: boolean
  closeMobileMenu: () => void
}
const { locale, t } = useI18n()
function toggleLanguage() {
  locale.value = locale.value === "en" ? "ar" : "en"
}
defineProps<Props>()
</script>

<template>
  <header class="mobile-menu d-lg-none mini-scrollbar" :class="{ open: mobileMenu }">
    <div class="container g-0 g-lg-1">
      <nav id="navbar-menu-mobile" class="px-2 px-lg-0">
        <div class="d-flex justify-content-between align-items-center w-100 mb-2">
          <RouterLink to="/">
            <img :src="logo" alt="" />
          </RouterLink>
          <div class="d-flex align-items-center">
            <!-- زر تبديل اللغة في الموبايل -->
            <button
              @click="toggleLanguage"
              class="btn btn-outline-light px-2 py-1 rounded border-0 me-2"
              style="font-weight:bold; min-width:38px;"
              aria-label="Change language"
            >
              {{ locale === 'ar' ? 'EN' : 'ع' }}
            </button>
            <PhX class="text-white fs-2 close-menu" @click="closeMobileMenu" />
          </div>
        </div>
        <!-- شيل كل القوائم -->
        <!--
        <ul class="mb-0 menu">
          ... كل القوائم القديمة ...
        </ul>
        <RouterLink to="/services" class="primary-btn max-w-full w-100">
          {{ t('navbar.service') }}
          <PhArrowUpRight />
        </RouterLink>
        -->
      </nav>
    </div>
  </header>
  <div class="mobile-menu-overlay d-lg-none" @click="closeMobileMenu"></div>
</template>
