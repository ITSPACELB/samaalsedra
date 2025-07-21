```vue
<script setup lang="ts">
import Lines from "../shared/Lines.vue"
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const location = ref("")
const temperature = ref("")
const icon = ref("")
const conditionText = ref("")
const wind = ref("")
const humidity = ref("")
const forecastIcon = ref("")
const forecastText = ref("")
const isLoading = ref(true)
const error = ref<string | null>(null)
const currentLat = ref<number>(0)
const currentLon = ref<number>(0)



// Compute alt text for accessibility
const currentIconAlt = computed(() => {
  return `${t('weather.currentIconAlt')} ${conditionText.value || ''}`
})
const forecastIconAlt = computed(() => {
  return `${t('weather.forecastIconAlt')} ${forecastText.value || ''}`
})

// Partner data
const partners = [
  {
    nameKey: "chint.title",
    logo: "/images/partners/chint-logo.png",
  },
  {
    nameKey: "easun.title",
    logo: "/images/partners/easun-logo.png",
  },
  {
    nameKey: "cospower.title",
    logo: "/images/partners/cospower-logo.png",
  },
  {
    nameKey: "sofar.title",
    logo: "/images/partners/sofar-logo.png",
  },
  {
    nameKey: "dyness.title",
    logo: "/images/partners/dyness-logo.png",
  },
  {
    nameKey: "risen.title",
    logo: "/images/partners/risen-logo.png",
  },
]

const fetchWeather = async (lat: number, lon: number, retries = 2) => {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=15170182d3574b5faf921917251107&q=${lat},${lon}&days=2&lang=en`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (!response.ok) throw new Error("API request failed")
    const data = await response.json()

    const cacheData = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem("weatherCache", JSON.stringify(cacheData))

    location.value = data.location.name
    temperature.value = `${data.current.temp_c}°C`
    icon.value = 'https:' + data.current.condition.icon
    conditionText.value = data.current.condition.text
    wind.value = `${data.current.wind_kph} km/h`
    humidity.value = `${data.current.humidity}%`
    forecastIcon.value = 'https:' + data.forecast.forecastday[1].day.condition.icon
    forecastText.value = data.forecast.forecastday[1].day.condition.text
    isLoading.value = false
    error.value = null
  } catch (err) {
    if (retries > 0) {
      setTimeout(() => fetchWeather(lat, lon, retries - 1), 2000)
    } else {
      error.value = t('weather.error')
      isLoading.value = false
    }
  }
}

onMounted(() => {
  const cached = localStorage.getItem("weatherCache")
  if (cached) {
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp < 10 * 60 * 1000) {
      location.value = data.location.name
      temperature.value = `${data.current.temp_c}°C`
      icon.value = 'https:' + data.current.condition.icon
      conditionText.value = data.current.condition.text
      wind.value = `${data.current.wind_kph} km/h`
      humidity.value = `${data.current.humidity}%`
      forecastIcon.value = 'https:' + data.forecast.forecastday[1].day.condition.icon
      forecastText.value = data.forecast.forecastday[1].day.condition.text
      isLoading.value = false
      return
    }
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(2)
        const lon = position.coords.longitude.toFixed(2)
        await fetchWeather(Number(lat), Number(lon))
      },
      () => {
        error.value = t('weather.geolocationError')
        isLoading.value = false
      },
      { timeout: 10000 }
    )
  } else {
    error.value = t('weather.geolocationNotSupported')
    isLoading.value = false
  }
})
</script>

<template>
  <section id="banner" class="banner space-header">
    <video muted loop autoplay playsinline>
      <source src="/images/home-1-video.webm" type="video/webm" />
    </video>

    <!-- 🌌 Galactic Decor -->
    <div class="galaxy-left"></div>
    <div class="galaxy-right"></div>

    <div class="side-text d-none d-xl-flex flex-column align-items-center gap-5">
      <h2 class="vertical">{{ t('banner.solarMadeEnergy') }}</h2>
    </div>

    <Lines />

    <div class="container">
      <div class="row banner-content z-2">
        <div class="col-12">
          <h1 class="hero-main-title fade_up_anim" style="color:#fff;">
            {{ t('site.companyFullName') }}
          </h1>
        </div>
        <div class="col-12">
          <h2 class="hero-sub-title fade_up_anim" style="color:#fff; font-size:1.35rem; font-weight:600; text-align:center;">
            {{ t('site.companySlogan') }}
          </h2>
          <div class="company-tagline fade_up_anim">{{ t('site.companyTagline') }}</div>
        </div>

        <!-- ✅ Weather (Below Titles) -->
        <div class="col-12 d-flex justify-content-center mt-4">
          <div class="weather-box-modern" role="region" aria-label="Current weather information">
            <div v-if="isLoading" class="weather-loading" role="status">
              <div class="loading-spinner" aria-hidden="true"></div>
              <span>{{ t('weather.loading') }}</span>
            </div>
            <div v-else-if="error" class="weather-error" role="alert">
              <span>{{ error }}</span>
<button
@click="() => fetchWeather(Number(currentLat), Number(currentLon))"
  class="retry-button"
  :aria-label="t('weather.retry')"
>
                {{ t('weather.retry') }}
              </button>
            </div>
            <div v-else class="weather-content" tabindex="0">
              <div class="weather-current">
                <div class="weather-icon-container">
                  <img v-if="icon" :src="icon" :alt="currentIconAlt" class="weather-icon" />
                  <div class="cloud-overlay cloud-1" aria-hidden="true"></div>
                  <div class="cloud-overlay cloud-2" aria-hidden="true"></div>
                  <div class="sun-moon" aria-hidden="true"></div>
                </div>
                <div class="weather-temp" aria-label="Current temperature">{{ temperature }}</div>
              </div>
              <div class="weather-details-modern">
                <div class="weather-day-label today-glow" aria-label="Current weather">{{ t('weather.today') }}</div>
                <div class="weather-location" aria-label="Location">{{ location }}</div>
                <div class="weather-info" aria-label="Weather condition">{{ conditionText }}</div>
                <div class="weather-extra">
                  <span class="wind-indicator" aria-label="Wind speed">💨 {{ wind }}</span>
                  <span aria-label="Humidity">💧 {{ humidity }}</span>
                </div>
              </div>
              <div class="weather-forecast">
                <div class="weather-day-label" aria-label="Tomorrow's weather">{{ t('weather.tomorrow') }}</div>
                <img v-if="forecastIcon" :src="forecastIcon" :alt="forecastIconAlt" class="forecast-icon" />
                <div class="cloud-overlay cloud-3" aria-hidden="true"></div>
                <span>{{ forecastText }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 🖼️ Partners Ticker -->
    <div class="partners-ticker" role="marquee">
      <div class="ticker-track">
        <!-- Repeated for continuous scroll effect -->
        <div class="ticker-set" v-for="n in 2" :key="'set-' + n">
          <div
            class="ticker-item"
            v-for="(partner, i) in partners"
            :key="`partner-${n}-${i}`"
          >
            <img
              :src="partner.logo"
              :alt="t('partners.' + partner.nameKey)"
              class="ticker-logo"
            />
            <div class="ticker-content">
              <span class="ticker-name">{{ t('partners.' + partner.nameKey) }}</span>
              <div class="rating-stars" aria-label="Five star rating">
                <span class="star" aria-hidden="true">★</span>
                <span class="star" aria-hidden="true">★</span>
                <span class="star" aria-hidden="true">★</span>
                <span class="star" aria-hidden="true">★</span>
                <span class="star" aria-hidden="true">★</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
:root {
  --ticker-item-width: 150px;
  --ticker-item-count: 6;
  --ticker-total-width: calc(var(--ticker-item-width) * var(--ticker-item-count));
  --ticker-animation-duration: 18s;
  --weather-scale: 100%; /* Adjust this percentage to scale all weather elements */
}

.hero-main-title {
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 900;
  text-shadow: 0 2px 15px rgba(30,50,80,0.23);
  letter-spacing: 0.2px;
  margin-bottom: 0.3rem;
  text-align: center;
font-family: 'Inter', Arial, sans-serif !important;
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

/* 🌤️ Weather Styling */
.weather-box-modern {
  display: flex;
  gap: clamp(16px, 3vw, 24px);
  align-items: center;
  color: #ffffff;
  font-family: 'Inter', Arial, sans-serif;
  position: relative;
  max-width: 100%;
  padding: 12px;
  box-sizing: border-box;
  transform: scale(calc(var(--weather-scale) / 100));
  transform-origin: center;
}

.weather-content {
  display: flex;
  gap: clamp(16px, 3vw, 24px);
  align-items: center;
  outline: none;
}

.weather-content:focus {
  outline: 2px solid #ffffff;
  outline-offset: 4px;
}

.weather-loading {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ffffff;
  font-size: clamp(1rem, 2.5vw, 1.2rem);
}

.weather-error {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ffffff;
  font-size: clamp(1rem, 2.5vw, 1.2rem);
}

.retry-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.retry-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #ffffff;
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.weather-current {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
}

.weather-icon-container {
  position: relative;
  width: clamp(60px, 10vw, 80px);
  height: clamp(60px, 10vw, 80px);
}

.weather-icon {
  width: 100%;
  height: 100%;
  z-index: 2;
  position: relative;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.7));
}

.cloud-overlay {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  z-index: 1;
}

.cloud-1 {
  width: clamp(30px, 5vw, 40px);
  height: clamp(15px, 2.5vw, 20px);
  top: 10px;
  left: -20px;
  animation: drift 8s ease-in-out infinite;
}

.cloud-2 {
  width: clamp(40px, 6vw, 50px);
  height: clamp(20px, 3vw, 25px);
  top: 30px;
  right: -15px;
  animation: drift 10s ease-in-out infinite 2s;
}

.cloud-3 {
  width: clamp(25px, 4vw, 30px);
  height: clamp(12px, 2vw, 15px);
  top: 10px;
  left: 50px;
  animation: drift 12s ease-in-out infinite 1s;
}

@keyframes drift {
  0%, 100% { transform: translateX(0); opacity: 0.3; }
  50% { transform: translateX(20px); opacity: 0.5; }
}

.sun-moon {
  position: absolute;
  width: clamp(25px, 4vw, 30px);
  height: clamp(25px, 4vw, 30px);
  background: radial-gradient(circle, #ffd700 0%, #ffeb3b 70%, transparent 100%);
  border-radius: 50%;
  top: -10px;
  right: -10px;
  z-index: 0;
  animation: pulse 6s ease-in-out infinite;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 1; }
}

.weather-temp {
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 800;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.8);
}

.weather-details-modern {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}

.weather-day-label {
  font-size: clamp(1.1rem, 2.5vw, 1.3rem);
  font-weight: 600;
  color: #ffffff;
}

.today-glow {
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.9), 0 0 20px rgba(255, 255, 255, 0.7);
  animation: glow 3s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.9), 0 0 20px rgba(255, 255, 255, 0.7); }
  50% { text-shadow: 0 0 15px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.9); }
}

.weather-location {
  font-size: clamp(1.2rem, 3vw, 1.4rem);
  font-weight: 500;
  color: #ffffff;
}

.weather-info {
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  color: #ffffff;
}

.weather-extra {
  display: flex;
  gap: clamp(12px, 2vw, 16px);
  font-size: clamp(0.9rem, 2vw, 1rem);
  color: #ffffff !important;
}

.weather-extra .wind-indicator,
.weather-extra span {
  color: #ffffff !important;
}

.wind-indicator {
  position: relative;
  animation: wind-blow 2s ease-in-out infinite;
}

@keyframes wind-blow {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
}

.weather-forecast {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  position: relative;
}

.forecast-icon {
  width: clamp(40px, 7vw, 50px);
  height: clamp(40px, 7vw, 50px);
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
}

.weather-forecast span {
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  color: #ffffff;
}

/* 🌐 Partners Ticker Styling */
.partners-ticker {
  position: absolute;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(90deg, rgba(0, 88, 69, 0.9), rgba(0, 194, 132, 0.9));
  backdrop-filter: blur(12px);
  padding: 4px 0;
  z-index: 3;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 -1px 6px rgba(0, 0, 0, 0.15);
}

.ticker-track {
  display: flex;
  width: fit-content;
  animation: ticker-scroll 30s linear infinite;
}

@keyframes ticker-scroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.ticker-set {
  display: flex;
  flex-shrink: 0;
}

.ticker-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  min-width: clamp(110px, 15vw, 150px);
  white-space: nowrap;
}

.ticker-logo {
  width: clamp(22px, 4vw, 30px);
  height: clamp(22px, 4vw, 30px);
  object-fit: contain;
  background: #fff;
  border-radius: 6px;
}

.ticker-name {
  color: white;
  font-size: clamp(0.7rem, 1.5vw, 0.8rem);
  font-weight: 500;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ffd700;
  font-size: clamp(0.55rem, 1.2vw, 0.7rem);
}

.ticker-item:hover .star {
  transform: scale(1.1);
}

@keyframes ticker {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* ✅ Responsive */
@media (max-width: 767px) {
  .weather-box-modern {
    flex-direction: column;
    align-items: center;
    padding: 10px;
  }

  .weather-content {
    flex-direction: column;
    text-align: center;
  }

  .weather-extra {
    justify-content: center;
  }

  .weather-forecast {
    flex-direction: row;
    align-items: center;
    gap: 8px; /* Adjusted for horizontal spacing on mobile */
  }

  .ticker-item {
    min-width: clamp(100px, 14vw, 130px);
  }
}

@media (max-width: 476px) {
  .weather-box-modern {
    padding: 8px;
  }

  .ticker-item {
    min-width: clamp(90px, 13vw, 110px);
  }
}
</style>
```