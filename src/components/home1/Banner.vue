```vue
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
const isMotionSupported = ref(false);

onMounted(() => {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  let posX = 0;
  let velX = 0;
  let rotY = 0;
  let velRot = 0;
  let posY = 0; // Added for vertical translation
  let velY = 0; // Added for vertical velocity
  let lastGamma = 0;
  let isMoving = false;

  const applyTransform = () => {
    if (tickerTrack.value) {
      tickerTrack.value.style.transform = `
        perspective(1000px)
        translateX(${posX}px)
        translateY(${posY}px)
        rotateY(${rotY}deg)
      `;
    }
  };

  // Request motion permission on iOS
  const requestMotionPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      // @ts-ignore
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        // @ts-ignore
        const permission = await DeviceOrientationEvent.requestPermission();
        isMotionSupported.value = permission === "granted";
      } catch (error) {
        console.warn("Motion permission denied:", error);
        isMotionSupported.value = false;
      }
    } else {
      isMotionSupported.value = typeof DeviceOrientationEvent !== "undefined";
    }
  };

  // Handle mobile tilt with enhanced "falling off" effect
  const handleOrientation = (e: DeviceOrientationEvent) => {
    if (!isMotionSupported.value || e.gamma === null) return;

    isMoving = true;
    const gamma = e.gamma; // Device tilt left/right
    const deltaGamma = gamma - lastGamma; // Acceleration
    lastGamma = gamma;

    // Enhanced sensitivity for dynamic motion
    velX += gamma * 0.6 + deltaGamma * 0.3; // Increased sensitivity for horizontal movement
    velRot += gamma * 0.15; // Slightly increased rotation for 3D effect
    velY += Math.abs(gamma) * 0.1; // Vertical velocity based on tilt magnitude for "falling" effect

    // Speed limits for smooth control
    velX = Math.max(Math.min(velX, 12), -12); // Increased max speed for responsiveness
    velRot = Math.max(Math.min(velRot, 20), -20); // Increased rotation limit for dramatic effect
    velY = Math.max(Math.min(velY, 8), 0); // Vertical movement only downwards
  };

  // Physics loop for smooth motion
  const physicsLoop = () => {
    if (!isMobile || !isMotionSupported.value) {
      // Fallback motion for non-motion devices
      posX = Math.sin(Date.now() * 0.001) * 50;
      applyTransform();
      requestAnimationFrame(physicsLoop);
      return;
    }

    if (!isMoving) {
      velX *= 0.92; // Smoother damping
      velRot *= 0.9; // Smoother rotation damping
      velY *= 0.88; // Damping for vertical movement
    } else {
      isMoving = false;
    }

    posX += velX;
    rotY += velRot;
    posY += velY;

    // Motion boundaries
    posX = Math.max(Math.min(posX, 250), -250); // Wider horizontal range
    rotY = Math.max(Math.min(rotY, 25), -25); // Wider rotation range
    posY = Math.max(Math.min(posY, 50), 0); // Limited vertical range for "falling" effect

    applyTransform();
    requestAnimationFrame(physicsLoop);
  };

  // Start motion permission and physics loop
  if (isMobile) {
    requestMotionPermission().then(() => {
      if (isMotionSupported.value) {
        window.addEventListener("deviceorientation", handleOrientation, true);
      }
      physicsLoop();
    });
  } else {
    // Mouse movement for desktop
    const handleMouseMove = (e: MouseEvent) => {
      const screenCenterX = window.innerWidth / 2;
      const offsetX = (e.clientX - screenCenterX) / 50;
      if (tickerTrack.value) {
        tickerTrack.value.style.transform = `
          translateX(${offsetX * 8}px)
        `;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    onBeforeUnmount(() => {
      window.removeEventListener("mousemove", handleMouseMove);
    });
  }

  onBeforeUnmount(() => {
    if (isMobile && isMotionSupported.value) {
      window.removeEventListener("deviceorientation", handleOrientation);
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
  transition: transform 0.02s linear; /* استجابة أسرع */
  will-change: transform;
}

.ticker-set {
  display: flex;
}

.ticker-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  min-width: clamp(140px, 18vw, 180px);
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* ظل خفيف لتأثير ثلاثي الأبعاد */
  transition: box-shadow 0.2s ease;
}

.ticker-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* تأثير تفاعلي */
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
```