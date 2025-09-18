<script setup lang="ts">
import Lines from "../shared/Lines.vue";
import { useI18n } from "vue-i18n";
import TopHead from "@/components/tophead.vue";
import weather from "@/components/weather.vue";

const { t } = useI18n();

// Partner data
const partners = [
  { nameKey: "chint.title", logo: "/images/partners/chint-logo.png" },
  { nameKey: "easun.title", logo: "/images/partners/easun-logo.png" },
  { nameKey: "cospower.title", logo: "/images/partners/cospower-logo.png" },
  { nameKey: "sofar.title", logo: "/images/partners/sofar-logo.png" },
  { nameKey: "dyness.title", logo: "/images/partners/dyness-logo.png" },
  { nameKey: "risen.title", logo: "/images/partners/risen-logo.png" },
  { nameKey: "powersolid.title", logo: "/images/partners/power solid-logo.png" },
];
</script>

<template>
  <section id="banner" class="banner space-header">
    <!-- Video Background -->
    <video muted loop autoplay playsinline>
      <source src="/images/home-1-video.webm" type="video/webm" />
    </video>

    <!-- Banner Content -->
    <div class="banner-content">
      <div class="side-text d-none d-xl-flex flex-column align-items-center gap-5">
        <h2 class="vertical">{{ t('banner.solarMadeEnergy') }}</h2>
      </div>
      <Lines />
      <TopHead />

      <!-- weather -->
      <div class="weather-absolute">
        <weather />
      </div>
    </div>

    <!-- Partners Ticker - حركة مستمرة من اليمين إلى اليسار -->
    <div class="partners-ticker">
      <div class="ticker-container">
        <div class="ticker-content">
          <!-- المجموعة الأولى -->
          <div class="ticker-group">
            <div
              class="ticker-item"
              v-for="(partner, i) in partners"
              :key="'group1-' + i"
            >
              <img :src="partner.logo" :alt="t('partners.' + partner.nameKey)" class="ticker-logo" />
              <div class="ticker-text">
                <span class="ticker-name">{{ t('partners.' + partner.nameKey) }}</span>
                <div class="rating-stars">
                  <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span>
                </div>
              </div>
            </div>
          </div>

          <!-- المجموعة الثانية - نسخة مطابقة تماماً -->
          <div class="ticker-group">
            <div
              class="ticker-item"
              v-for="(partner, i) in partners"
              :key="'group2-' + i"
            >
              <img :src="partner.logo" :alt="t('partners.' + partner.nameKey)" class="ticker-logo" />
              <div class="ticker-text">
                <span class="ticker-name">{{ t('partners.' + partner.nameKey) }}</span>
                <div class="rating-stars">
                  <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.banner {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.banner video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.banner-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.vertical {
  writing-mode: horizontal-tb !important;
  transform: none !important;
  font-size: 1.2rem !important;
  margin-bottom: 10px;
}

/* ======= شريط الشركاء - حركة مستمرة من اليمين إلى اليسار ======= */
.partners-ticker {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 70px;
  background: linear-gradient(90deg, rgba(0, 88, 69, 0.9), rgba(0, 194, 132, 0.9));
  backdrop-filter: blur(12px);
  z-index: 3;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.ticker-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.ticker-content {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: max-content;
  animation: scroll-rtl 40s linear infinite;
  will-change: transform;
}

/* الحركة المستمرة من اليمين إلى اليسار بدون انقطاع */
@keyframes scroll-rtl {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.ticker-group {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 100%;
}

.ticker-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 25px;
  height: 100%;
  min-width: 180px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background-color 0.3s ease;
  border-radius: 0;
}

.ticker-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.ticker-logo {
  width: 45px;
  height: 45px;
  object-fit: contain;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.ticker-item:hover .ticker-logo {
  transform: scale(1.05);
}

.ticker-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.ticker-name {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ffd700;
  font-size: 0.8rem;
  transition: transform 0.2s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.ticker-item:hover .star {
  transform: scale(1.1);
}

/* تحسينات الأداء */
.ticker-content,
.ticker-group,
.ticker-item {
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

/* ✅ الطقس */
.weather-absolute {
  position: absolute;
  top: 300px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  max-width: 90vw;
}

/* ======= استجابة للشاشات المختلفة ======= */
@media (max-width: 1200px) {
  .ticker-item {
    min-width: 160px;
    padding: 0 20px;
  }
  
  .ticker-logo {
    width: 40px;
    height: 40px;
  }
  
  .ticker-name {
    font-size: 0.95rem;
  }
}

@media (max-width: 992px) {
  .partners-ticker {
    height: 65px;
  }
  
  .ticker-item {
    min-width: 150px;
    padding: 0 18px;
    gap: 10px;
  }
  
  .ticker-logo {
    width: 38px;
    height: 38px;
  }
  
  .ticker-name {
    font-size: 0.9rem;
  }
  
  .star {
    font-size: 0.75rem;
  }
  
  .ticker-content {
    animation-duration: 35s;
  }
}

@media (max-width: 767px) {
  .weather-absolute {
    top: auto;
    bottom: 100px;
  }
  
  .banner {
    min-height: 700px;
  }
  
  .partners-ticker {
    height: 60px;
  }
  
  .ticker-item {
    min-width: 140px;
    padding: 0 15px;
    gap: 8px;
  }
  
  .ticker-logo {
    width: 35px;
    height: 35px;
    padding: 4px;
  }
  
  .ticker-name {
    font-size: 0.85rem;
  }
  
  .star {
    font-size: 0.7rem;
  }
  
  .ticker-content {
    animation-duration: 30s;
  }
}

@media (max-width: 480px) {
  .partners-ticker {
    height: 55px;
  }
  
  .ticker-item {
    min-width: 120px;
    padding: 0 12px;
  }
  
  .ticker-logo {
    width: 32px;
    height: 32px;
  }
  
  .ticker-name {
    font-size: 0.8rem;
  }
  
  .star {
    font-size: 0.65rem;
  }
  
  .ticker-content {
    animation-duration: 25s;
  }
}

/* تحسين للحركة البطيئة */
@media (prefers-reduced-motion: reduce) {
  .ticker-content {
    animation-duration: 60s;
  }
}

/* إيقاف مؤقت عند التمرير فوق الشريط */
.partners-ticker:hover .ticker-content {
  animation-play-state: paused;
}
</style>