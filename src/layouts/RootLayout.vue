<template>
  <div class="ultimate-wrapper">
    <slot />
  </div>
</template>

<script setup lang="ts">
// مافي حاجة لشي هون
</script>

<style scoped>
.ultimate-wrapper {
  width: 100vw !important;
  max-width: 100vw !important;
  min-width: 100vw !important;
  height: 100% !important;
  overflow-x: hidden !important;
  transform: none !important;
  zoom: 1 !important;
  padding: 0 !important;
  margin: 0 !important;
  display: block;
  position: relative;
  font-family: 'Tajawal', sans-serif !important;
  font-size: 16px;
  box-sizing: border-box;
}
</style>
