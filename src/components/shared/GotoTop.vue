<script setup lang="ts">
import { PhArrowUp } from '@phosphor-icons/vue'
import { onMounted, ref } from 'vue'

const scrolled = ref(false)
const gotTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
onMounted(() => {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 150) {
      scrolled.value = true
    } else {
      scrolled.value = false
    }
  })
})
</script>
<template>
  <button @click="gotTop" :class="`back-to-top ${scrolled ? 'show' : ''}`">
    <PhArrowUp />
  </button>
</template>
