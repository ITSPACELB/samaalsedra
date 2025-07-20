<script setup lang="ts">
import companies from "@/assets/data/companies.ts"
import { Autoplay } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/vue"
defineProps<{
  box?: boolean
}>()
</script>
<template>
  <div>
    <div class="brand-slider overflow-x-hidden">
      <div class="container-fluid">
        <div class="row g-4 align-items-center">
          <div class="col-lg-5 col-xl-4 left-col">
            <p class="mb-0 ms-lg-2 px-3 px-xl-0">We have worked with major brands worldwide___</p>
          </div>
          <div class="col-lg-7 col-xl-8">
            <Swiper loop autoplay :spaceBetween="16" :slidesPerView="'auto'" :modules="[Autoplay]" class="swiper brand-swiper">
              <SwiperSlide v-for="(company, i) in companies" :key="i" class="swiper-slide">
                <div v-if="box" class="img-wrapper">
                  <img :src="company" alt="brand icon" />
                </div>
                <img v-else :src="company" alt="brand icon" />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
