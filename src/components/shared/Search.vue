<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue"
import { PhX } from "@phosphor-icons/vue"

type Props = {
  search: boolean
  closeSearch: () => void
}

const props = defineProps<Props>()

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    props.closeSearch()
  }
}

onMounted(() => {
  // Add event listener for Escape key to close search popup
  document.addEventListener("keydown", handleKeydown)
})

onBeforeUnmount(() => {
  // Remove event listener when the component is unmounted
  document.removeEventListener("keydown", handleKeydown)
})
</script>

<template>
  <div :class="['search-popup', { show: search }]">
    <div class="search-popup-inner">
      <span class="close-text">Press Esc to Close</span>
      <button aria-label="search close" @click="closeSearch" class="search-popup-close">
        <PhX />
      </button>
      <form action="#" class="search-form">
        <input type="text" class="effect" placeholder="Type and Hit Enter..." />
        <span class="focus-border"></span>
      </form>
    </div>
  </div>
</template>
