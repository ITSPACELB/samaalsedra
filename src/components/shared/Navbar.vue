<script setup lang="ts">
import logoWhite from "/images/logo.png"
import { useI18n } from "vue-i18n"

const { locale } = useI18n()

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
  <header id="header" :class="`header index-2 ${cls}`">
    <div class="container g-0 g-lg-1">
      <nav
        id="navbar-menu"
        class="d-flex justify-content-center align-items-center position-relative nav-menu-area"
        style="padding: 14px 0; position: relative;"
      >
        <!-- زر تبديل اللغة - جهة اليسار -->
        <div class="language-btn-wrapper">
          <button
            @click="toggleLanguage"
            class="language-toggle"
            aria-label="تبديل اللغة"
          >
            {{ locale === 'ar' ? 'EN' : 'AR' }}
          </button>
        </div>

        <!-- اللوغو بالنص -->
        <RouterLink to="/" aria-label="logo" class="d-flex justify-content-center">
          <img :src="logo || logoWhite" alt="logo" class="main-logo" />
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* زر اللغة بتصميم عصري وأنيق */
.language-btn-wrapper {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
}

.language-toggle {
  background: linear-gradient(135deg,rgb(80, 180, 3),rgb(217, 255, 0));
  color: #ffffff;
  border: none;
  border-radius: 14px;
  padding: 0.1px 16px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  transition: all 0.25s ease;
  cursor: pointer;
  min-width: 25px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.language-toggle:hover {
  background: linear-gradient(135deg, #2a2a2a, #3a3a3a);
  transform: scale(1.06);
}


/* تكبير اللوغو */
.main-logo {
  max-height: 85px;
  transition: all 0.3s ease;
}
@media (max-width: 768px) {
  .main-logo {
    max-height: 70px;
  }
}
</style>
