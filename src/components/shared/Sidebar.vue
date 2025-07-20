<script setup lang="ts">
import { PhFacebookLogo, PhInstagramLogo, PhLinkedinLogo, PhTwitchLogo, PhTwitterLogo, PhX } from "@phosphor-icons/vue"

const images = [{ src: "/images/showcase-1.webp" }, { src: "/images/showcase-2.webp" }, { src: "/images/showcase-3.webp" }, { src: "/images/showcase-4.webp" }, { src: "/images/showcase-1.webp" }, { src: "/images/showcase-2.webp" }]
defineProps<{
  sidebarOpen: boolean
  toggleSidebar: () => void
}>()
</script>
<template>
  <div :class="`left-sidebar ${sidebarOpen ? 'open' : ''}`" :tabIndex="-1">
    <div class="offcanvas-body d-flex flex-column align-items-center text-center">
      <div class="d-flex justify-content-end w-100 mb-5">
        <button @click="toggleSidebar" class="bg-transparent text-primary border-0 fs-4 left-sidebar-close" aria-label="Close sidebar">
          <PhX />
        </button>
      </div>

      <img src="/images/logo.png" alt="" />
      <p class="text-white">Welcome to sama alsedra, where our team of experienced attorneys is dedicated to providing you with the best</p>
      <h5 class="fw-semibold text-white">Gallery</h5>
      <div class="row g-3 gallery" id="gallery">
        <div v-for="(image, index) in images" :key="index" class="col-4" style="cursor: pointer">
          <img class="w-100" :width="98" :height="98" :src="image.src" :alt="`Image ${index + 1}`" />
        </div>
      </div>
      <h5 class="fw-semibold text-white">Follow</h5>
      <ul class="social-links p-0">
        <li>
          <a href="#" aria-label="social-link">
            <PhFacebookLogo />
          </a>
        </li>
        <li>
          <a href="#" aria-label="social-link">
            <PhTwitterLogo />
          </a>
        </li>
        <li>
          <a href="#" aria-label="social-link">
            <PhInstagramLogo />
          </a>
        </li>
        <li>
          <a href="#" aria-label="social-link">
            <PhLinkedinLogo />
          </a>
        </li>
        <li>
          <a href="#" aria-label="social-link">
            <PhTwitchLogo />
          </a>
        </li>
      </ul>
    </div>
  </div>
  <div class="left-sidebar-overlay" @click="toggleSidebar"></div>
  <!-- <Lightbox open={open} close={() => setOpen(false)} slides={images} index={currentIndex} /> -->
</template>
