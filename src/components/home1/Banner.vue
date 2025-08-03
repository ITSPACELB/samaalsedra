<script setup lang="ts">
import Lines from "../shared/Lines.vue";
import { useI18n } from "vue-i18n";
import TopHead from "@/components/tophead.vue";
import Weather from "@/components/Weather.vue";

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

      <!-- Weather -->
      <div class="weather-absolute">
        <Weather />
      </div>
    </div>

    <!-- Partners Ticker -->
    <div class="partners-ticker" role="marquee">
      <div class="ticker-wrapper">
        <div class="ticker-track">
          <div
            class="ticker-item"
            v-for="(partner, i) in [...partners, ...partners]"
            :key="`partner-${i}`"
          >
            <img
              :src="partner.logo"
              :alt="t('partners.' + partner.nameKey)"
              class="ticker-logo"
            />
            <div class="ticker-content">
              <span class="ticker-name">{{ t('partners.' + partner.nameKey) }}</span>
              <div class="rating-stars">
                <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span>
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

.partners-ticker {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(90deg, rgba(0, 88, 69, 0.9), rgba(0, 194, 132, 0.9));
  backdrop-filter: blur(12px);
  padding: 4px 0;
  z-index: 3;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.ticker-wrapper {
  width: 100%;
  overflow: hidden;
}

.ticker-track {
  display: flex;
  width: max-content;
  animation: ticker-bounce 20s linear infinite alternate;
}

@keyframes ticker-bounce {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.ticker-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  min-width: clamp(140px, 18vw, 180px);
  white-space: nowrap;
}

.ticker-logo {
  width: clamp(30px, 5.5vw, 42px);
  height: clamp(30px, 5.5vw, 42px);
  object-fit: contain;
  background: #fff;
  border-radius: 6px;
}

.ticker-name {
  color: white;
  font-size: clamp(0.8rem, 1.6vw, 1rem);
  font-weight: 500;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ffd700;
  font-size: clamp(0.65rem, 1.3vw, 0.8rem);
  transition: transform 0.2s;
}

.ticker-item:hover .star {
  transform: scale(1.1);
}

.weather-absolute {
  position: absolute;
  top: 450px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  max-width: 90vw;
}

@media (max-width: 767px) {
  .weather-absolute {
    top: auto;
    bottom: 100px;
  }
  .banner {
    min-height: 700px;
  }
}

@media (max-width: 476px) {
  .ticker-item {
    min-width: clamp(110px, 16vw, 140px);
  }
}
</style>
