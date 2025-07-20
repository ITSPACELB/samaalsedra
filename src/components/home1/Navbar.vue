<script setup lang="ts">
import logoWhite from "/images/logo.png"
import { useI18n } from "vue-i18n"
const { locale, t } = useI18n()
function toggleLanguage() {
  locale.value = locale.value === "en" ? "ar" : "en"
}
type Props = {
  cls?: string
  logo?: string
}
defineProps<Props>()
</script>

<template>
  <header id="header" :class="`header w-100 ${cls}`">
    <div class="g-0 g-lg-1">
      <nav id="navbar-menu" class="d-flex justify-content-between align-items-center position-relative nav-menu-area">
        <!-- زر تبديل اللغة -->
        <button
          @click="toggleLanguage"
          class="btn btn-warning lang-switch-btn"
          aria-label="تبديل اللغة"
        >
          {{ locale === 'ar' ? 'EN' : 'ع' }}
        </button>
        <!-- Logo & Company Name -->
        <RouterLink to="/" aria-label="logo" class="d-flex flex-column align-items-center company-brand">
          <img :src="logo || logoWhite" alt="" style="max-height: 48px; max-width: 140px;" />
          <span class="company-title mt-1">{{ t('site.companyFullName') }}</span>
          <span class="company-subtitle mt-1">{{ t('site.companySlogan') }}</span>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.company-brand .company-title {
  color: #23436d;
  font-weight: 900;
  font-size: 1.3rem;
  letter-spacing: 0.2px;
  line-height: 1.2;
  text-align: center;
}
.company-brand .company-subtitle {
  color: #f7d25c;
  font-weight: 700;
  font-size: 1.02rem;
  letter-spacing: 0.15px;
  text-align: center;
  margin-top: -3px;
}
.lang-switch-btn {
  font-size: 16px !important;
  padding: 2px 12px !important;
  min-width: 36px !important;
  border-radius: 9px !important;
  height: 34px !important;
  margin-right: 2px;
  margin-left: 2px;
}
@media (max-width: 767px) {
  .company-brand .company-title {
    font-size: 0.98rem;
  }
  .company-brand .company-subtitle {
    font-size: 0.86rem;
  }
  .lang-switch-btn {
    font-size: 15px !important;
    padding: 1px 9px !important;
    min-width: 27px !important;
    height: 28px !important;
  }
}
</style>
