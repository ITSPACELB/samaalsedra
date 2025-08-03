<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="container">
    <div class="row banner-content z-2">
      <div class="col-12">
        <div class="titles-wrapper">
          <h1 class="hero-main-title fade_up_anim" style="color:#fff;">
            {{ t('site.companyFullName') }}
          </h1>
          <h2 class="hero-sub-title fade_up_anim" style="color:#fff; font-size:1.35rem; font-weight:600; text-align:center;">
            {{ t('site.companySlogan') }}
          </h2>
          <div class="company-tagline fade_up_anim">{{ t('site.companyTagline') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.hero-main-title {
  font-size: clamp(2.5rem, 8vw, 10rem);
  font-weight: 900;
  text-shadow: 0 2px 15px rgba(30,50,80,0.23);
  letter-spacing: 0.2px;
  margin-bottom: 0.3rem;
  text-align: center;
}

.hero-sub-title {
  margin-bottom: 0.3rem;
}

.company-tagline {
  font-family: 'Inter', 'Tajawal', Arial, sans-serif;
  color: #ffffff;
  font-size: clamp(0.9rem, 2vw, 1rem);
  font-weight: 400;
  text-align: center;
  margin-top: 0.5rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6);
  animation: glow-pulse 2.5s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6);
    opacity: 0.9;
  }
  50% {
    text-shadow: 0 0 15px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.9);
    opacity: 1;
  }
}

.titles-wrapper {
  transform: translateY(-35vh); /* ارفع بمقدار نسبي من ارتفاع الشاشة */
  text-align: center;
}

/* ✅ الأجهزة الصغيرة: خفف الرفع */
@media (max-width: 767px) {
  .titles-wrapper {
    transform: translateY(-10vh); /* بس شوي صغير لفوق */
  }

}

</style>
