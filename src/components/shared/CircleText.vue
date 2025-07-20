<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { PhArrowUpRight } from '@phosphor-icons/vue'

const defaultText = 'Sama Alsedra . Sama Alsedra . '

const props = defineProps({
  dataText: {
    type: String,
    default: '',
  },
})

const circularText = ref<string>(props.dataText || defaultText)

onMounted(() => {
  const texts = document.querySelectorAll<HTMLElement>('.text')

  texts.forEach((text) => {
    const str = props.dataText || defaultText
    text.innerHTML = '' // Clear existing content

    for (let i = 0; i < str.length; i++) {
      const span = document.createElement('span')
      span.innerHTML = str[i]
      text.appendChild(span)
      span.style.transform = `rotate(${12 * i}deg)`
    }
  })
})

watch(
  () => props.dataText,
  (newVal) => {
    circularText.value = newVal || defaultText
  },
)
</script>

<template>
  <router-link to="/services" class="circular-text-big order-2 order-md-1">
    <p class="text" :data-text="props.dataText"></p>
    <div class="inner">
      <button>
        <PhArrowUpRight />
      </button>
    </div>
  </router-link>
</template>
