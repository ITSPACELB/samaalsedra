<script setup lang="ts">
import { ref } from 'vue'
import { PhStar } from '@phosphor-icons/vue'

const rating = ref(0)
const hoverRating = ref(0)

const handleRating = (value: number) => {
  rating.value = value // Save the rating on click
}

const handleMouseEnter = (value: number) => {
  hoverRating.value = value // Update hover rating
}

const handleMouseLeave = () => {
  hoverRating.value = 0 // Reset hover rating when not hovering
}
</script>

<template>
  <div class="rating d-flex gap-2 fs-4 mb-3 mb-xl-4 text-secondary">
    <PhStar v-for="value in [1, 2, 3, 4, 5]" :key="value" :weight="value <= (hoverRating || rating) ? 'fill' : 'regular'" @click="handleRating(value)" @mouseenter="handleMouseEnter(value)" @mouseleave="handleMouseLeave" style="cursor: pointer" />
  </div>
</template>
