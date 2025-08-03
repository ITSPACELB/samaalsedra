<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
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

const tickerTrack = ref<HTMLElement | null>(null);

onMounted(() => {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent); // ✅ كشف الجهاز

  let posX = 0;
  let velX = 0;
  let rotY = 0;
  let velRot = 0;
  let shake = 0; // 🔥 قوة الاهتزاز
  let isMoving = false;

  const applyTransform = () => {
    if (tickerTrack.value) {
      tickerTrack.value.style.transform = `
        perspective(800px)
        translateX(${posX + shake}px)
        rotateY(${rotY}deg)
      `;
    }
  };

  // 🎯 الموبايل - إحساس السقوط + اهتزاز
  const handleOrientation = (e: DeviceOrientationEvent) => {
    if (!isMobile) return;
    if (e.gamma !== null) {
      isMoving = true;
      const tilt = e.gamma; // ميل الموبايل
      velX += tilt * 0.6;
      velRot += tilt * 0.25;

      // 🔥 اهتزاز لما الميلان قوي (إحساس سقوط)
      if (Math.abs(tilt) > 15) {
        shake = (Math.random() - 0.5) * 8; // اهتزاز قوي
      } else if (Math.abs(tilt) > 8) {
        shake = (Math.random() - 0.5) * 4; // اهتزاز خفيف
      } else {
        shake = 0;
      }
    }
  };

// 🎯 الكمبيوتر - حركة يمين وشمال لكل العناصر مع الماوس
const handleMouseMove = (e: MouseEvent) => {
  if (isMobile) return;

  const screenCenterX = window.innerWidth / 2;

  // احسب إزاحة الماوس عن الوسط
  const offsetX = (e.clientX - screenCenterX) / 50; // كل ما الرقم أصغر، الحركة أخف

  // حرك كل الشريط يمين وشمال بشكل انسيابي
  if (tickerTrack.value) {
    tickerTrack.value.style.transform = `
      translateX(${offsetX * 8}px)
    `;
  }
};

  // 🌀 فيزياء السقوط (موبايل فقط)
  const physicsLoop = () => {
    if (!isMobile) {
      requestAnimationFrame(physicsLoop);
      return;
    }

    if (!isMoving) {
      velX *= 0.94;
      velRot *= 0.9;
      shake *= 0.85; // اهتزاز يخف تدريجياً
    } else {
      isMoving = false;
    }

    posX += velX;
    rotY += velRot;

    // حدود الميلان
    posX = Math.max(Math.min(posX, 150), -150);
    rotY = Math.max(Math.min(rotY, 20), -20);

    applyTransform();
    requestAnimationFrame(physicsLoop);
  };

  physicsLoop();

  // ✅ Event Listeners
  if (isMobile) {
    window.addEventListener("deviceorientation", handleOrientation, true);
  } else {
    window.addEventListener("mousemove", handleMouseMove);
  }

  onBeforeUnmount(() => {
    if (isMobile) {
      window.removeEventListener("deviceorientation", handleOrientation);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
    }
  });
});
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

    <!-- Partners Ticker -->
<div class="partners-ticker" role="marquee">
  <div class="ticker-track" ref="tickerTrack">
    <!-- النسخة الأولى -->
    <div class="ticker-set">
      <div
        class="ticker-item"
        v-for="(partner, i) in partners"
        :key="'a-' + i"
      >
        <img :src="partner.logo" :alt="t('partners.' + partner.nameKey)" class="ticker-logo" />
        <div class="ticker-content">
          <span class="ticker-name">{{ t('partners.' + partner.nameKey) }}</span>
          <div class="rating-stars">
            <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span>
          </div>
        </div>
      </div>
    </div>
    <!-- النسخة الثانية -->
    <div class="ticker-set">
      <div
        class="ticker-item"
        v-for="(partner, i) in partners"
        :key="'b-' + i"
      >
        <img :src="partner.logo" :alt="t('partners.' + partner.nameKey)" class="ticker-logo" />
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

/* ✅ شريط الشركاء */
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

.ticker-track {
  display: flex;
  width: max-content;
  transform-style: preserve-3d;
  transition: transform 0.05s linear;
  will-change: transform;
}

.ticker-set {
  display: flex;
}

@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
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

/* ✅ الطقس */
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
