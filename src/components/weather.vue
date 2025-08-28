<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

// ✅ استخدم i18n العالمي + رقعة مفاتيح الطقس للإنكليزي
const { t, locale, getLocaleMessage } = useI18n({ useScope: "global" });

const ensureWeatherKeys = (lng: string) => {
  const msgs = getLocaleMessage(lng) || {};
  if (!msgs.weather) {
    const patch = {
      weather: {
        loading: "Loading weather data...",
        error: "Failed to load weather data, please try again later",
        geolocationError: "Unable to access your location, please check location settings",
        geolocationNotSupported: "Geolocation is not supported by your browser",
        retry: "Retry",
        currentIconAlt: "Current weather icon:",
        forecastIconAlt: "Forecast weather icon:",
        today: "Today",
        tomorrow: "Tomorrow"
      }
    };
    // @ts-ignore — نستخدم setLocaleMessage من النطاق العالمي لدمج الرسائل بأمان
    const { setLocaleMessage } = (useI18n as any)({ useScope: "global" });
    setLocaleMessage(lng, { ...msgs, ...patch });
  }
};

// نضمن وجود مفاتيح EN حتى لو تم الكتابة فوقها بمكان آخر
ensureWeatherKeys("en");
ensureWeatherKeys("en-US");

const location = ref("");
const temperature = ref("");
const icon = ref("");
const conditionText = ref("");
const wind = ref("");
const humidity = ref("");
const forecastIcon = ref("");
const forecastText = ref("");
const isLoading = ref(true);
const error = ref<string | null>(null);

// Compute alt text for accessibility
const currentIconAlt = computed(() => {
  return `${t('weather.currentIconAlt')} ${conditionText.value || ''}`;
});
const forecastIconAlt = computed(() => {
  return `${t('weather.forecastIconAlt')} ${forecastText.value || ''}`;
});

const fetchWeather = async (lat: number, lon: number, retries = 2) => {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=15170182d3574b5faf921917251107&q=${lat},${lon}&days=2&lang=en`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();

    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem("weatherCache", JSON.stringify(cacheData));

    location.value = data.location.name;
    temperature.value = `${data.current.temp_c}°C`;
    icon.value = 'https:' + data.current.condition.icon;
    conditionText.value = data.current.condition.text;
    wind.value = `${data.current.wind_kph} km/h`;
    humidity.value = `${data.current.humidity}%`;
    forecastIcon.value = 'https:' + data.forecast.forecastday[1].day.condition.icon;
    forecastText.value = data.forecast.forecastday[1].day.condition.text;
    isLoading.value = false;
    error.value = null;
  } catch (err) {
    if (retries > 0) {
      setTimeout(() => fetchWeather(lat, lon, retries - 1), 2000);
    } else {
      error.value = t('weather.error');
      isLoading.value = false;
    }
  }
};

const loadWeather = () => {
  isLoading.value = true;
  error.value = null;

  const cached = localStorage.getItem("weatherCache");
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 10 * 60 * 1000) {
        location.value = "Iraq"; // ✅ نجبرها تظهر العراق دائماً بالفallback
        temperature.value = `${data.current.temp_c}°C`;
        icon.value = 'https:' + data.current.condition.icon;
        conditionText.value = data.current.condition.text;
        wind.value = `${data.current.wind_kph} km/h`;
        humidity.value = `${data.current.humidity}%`;
        forecastIcon.value = 'https:' + data.forecast.forecastday[1].day.condition.icon;
        forecastText.value = data.forecast.forecastday[1].day.condition.text;
        isLoading.value = false;
        return;
      }
    } catch (e) {
      console.error("Failed to parse cached weather data", e);
    }
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(2);
        const lon = position.coords.longitude.toFixed(2);
        await fetchWeather(Number(lat), Number(lon));
      },
      async () => {
        // ✅ لو انرفض اللوكيشن → fallback مباشر للعراق
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=15170182d3574b5faf921917251107&q=Iraq&days=2&lang=en`
        );
        const data = await response.json();

        location.value = "Iraq"; // ✅ تثبيت العراق بدل بغداد
        temperature.value = `${data.current.temp_c}°C`;
        icon.value = 'https:' + data.current.condition.icon;
        conditionText.value = data.current.condition.text;
        wind.value = `${data.current.wind_kph} km/h`;
        humidity.value = `${data.current.humidity}%`;
        forecastIcon.value = 'https:' + data.forecast.forecastday[1].day.condition.icon;
        forecastText.value = data.forecast.forecastday[1].day.condition.text;
        isLoading.value = false;
      },
      { timeout: 10000 }
    );
  } else {
    // ✅ fallback مباشر للعراق إذا ما في geolocation
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=15170182d3574b5faf921917251107&q=Iraq&days=2&lang=en`)
      .then(res => res.json())
      .then(data => {
        location.value = "Iraq";
        temperature.value = `${data.current.temp_c}°C`;
        icon.value = 'https:' + data.current.condition.icon;
        conditionText.value = data.current.condition.text;
        wind.value = `${data.current.wind_kph} km/h`;
        humidity.value = `${data.current.humidity}%`;
        forecastIcon.value = 'https:' + data.forecast.forecastday[1].day.condition.icon;
        forecastText.value = data.forecast.forecastday[1].day.condition.text;
        isLoading.value = false;
      });
  }
};

onMounted(() => {
  loadWeather();
});
</script>

<template>
  <div class="weather-box-modern" role="region" aria-label="Current weather information">
    <div v-if="isLoading" class="weather-loading" role="status">
      <div class="loading-spinner" aria-hidden="true"></div>
      <span>{{ t('weather.loading') }}</span>
    </div>
    <div v-else-if="error" class="weather-error" role="alert">
      <span>{{ error }}</span>
      <button
        @click="loadWeather"
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
</template>

<style scoped>
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
    gap: 8px;
  }
}

@media (max-width: 476px) {
  .weather-box-modern {
    padding: 8px;
  }
}
</style>