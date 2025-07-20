// composables/useWeather.ts
import { ref, onMounted } from "vue"

export function useWeather() {
  const location = ref("")
  const temperature = ref("")
  const icon = ref("")
  const conditionText = ref("")
  const wind = ref("")
  const humidity = ref("")
  const forecastIcon = ref("")
  const forecastText = ref("")
  const error = ref("")

  onMounted(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude.toFixed(2)
            const lon = position.coords.longitude.toFixed(2)
            const apiKey = import.meta.env.VITE_WEATHER_API_KEY
            const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=2&lang=en`
            const response = await fetch(url)
            const data = await response.json()

            location.value = data.location.name
            temperature.value = `${data.current.temp_c}°C`
            icon.value = 'https:' + data.current.condition.icon
            conditionText.value = data.current.condition.text
            wind.value = `${data.current.wind_kph} km/h`
            humidity.value = `${data.current.humidity}%`
            forecastIcon.value = 'https:' + data.forecast.forecastday[1].day.condition.icon
            forecastText.value = data.forecast.forecastday[1].day.condition.text
          } catch (err) {
            error.value = "Failed to fetch weather data."
            console.error(err)
          }
        },
        (err) => {
          error.value = "Location access denied."
        }
      )
    } else {
      error.value = "Geolocation is not supported."
    }
  })

  return {
    location,
    temperature,
    icon,
    conditionText,
    wind,
    humidity,
    forecastIcon,
    forecastText,
    error
  }
}
