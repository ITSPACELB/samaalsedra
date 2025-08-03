<script setup lang="ts">
// ✅ تعديل بسيط لإجبار Vercel على إعادة النشر 🚀

import { Swiper, SwiperSlide } from "swiper/vue"
import service1 from "/images/service-1.png"
import service2 from "/images/service-2.png"
import service3 from "/images/service-3.png"
import { Autoplay, Navigation } from "swiper/modules"
import { PhArrowLeft, PhArrowRight } from "@phosphor-icons/vue"
import { useI18n } from "vue-i18n"

const { t, locale } = useI18n()

const services = [
  {
    id: 1,
    img: service1,
    title: "solarPanelInstallationTitle",
    description: "solarPanelInstallationDesc",
    benefit: "solarPanelInstallationBenefit",
  },
  {
    id: 2,
    img: service2,
    title: "maintenanceTitle",
    description: "maintenanceDesc",
    benefit: "maintenanceBenefit",
  },
  {
    id: 3,
    img: service3,
    title: "residentialTitle",
    description: "residentialDesc",
    benefit: "residentialBenefit",
  },
  {
    id: 4,
    img: service2,
    title: "maintenanceTitle",
    description: "maintenanceDesc",
    benefit: "maintenanceBenefit",
  },
  {
    id: 5,
    img: service3,
    title: "residentialTitle",
    description: "residentialDesc",
    benefit: "residentialBenefit",
  },
]
</script>

<template>
  <section class="services" id="services">
    <div class="left-text d-none d-xl-block">
      <h2 class="vertical-white">{{ t("services.verticalLabel") }}</h2>
    </div>
    <div class="container">
      <div class="row align-items-end g-3 gx-xl-4 section-title">
        <div class="col-lg-6">
          <!-- النصوص الرئيسية -->
          <h2 
            class="mb-3 fade_up_anim text-dir" 
            :class="locale === 'ar' ? 'rtl-text' : 'ltr-text'"
          >
            {{ t("services.sectionTitle") }}
          </h2>
          <p 
            class="fade_up_anim text-dir" 
            data-delay=".3" 
            :class="locale === 'ar' ? 'rtl-text' : 'ltr-text'"
          >
            {{ t("services.sectionDesc") }}
          </p>
        </div>
        <div class="col-lg-6 d-flex justify-content-end">
          <div class="btns">
            <button class="service-prev">
              <PhArrowLeft />
            </button>
            <button class="service-next">
              <PhArrowRight />
            </button>
          </div>
        </div>
      </div>

      <!-- سلايدر الخدمات -->
      <Swiper
        :navigation="{
          nextEl: '.service-next',
          prevEl: '.service-prev',
        }"
        loop
        autoplay
        :modules="[Navigation, Autoplay]"
        :breakpoints="{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2, spaceBetween: 24 },
          1200: { slidesPerView: 3, spaceBetween: 24 },
        }"
        class="swiper ServiceSwiper"
      >
        <SwiperSlide v-for="(service, index) in services" :key="index">
          <div class="service-card scaled-card">
            <img :src="service.img" alt="" />
            <h4 
              class="service-title-highlight text-dir" 
              :class="locale === 'ar' ? 'rtl-text' : 'ltr-text'"
            >
              {{ t('services.' + service.title) }}
            </h4>
            <p 
              class="text-dir" 
              :class="locale === 'ar' ? 'rtl-text' : 'ltr-text'"
            >
              {{ t('services.' + service.description) }}
            </p>
            <span class="hr-line"></span>
            <div
              class="service-benefit text-dir"
              style="margin-top: 10px; color: #088"
              :class="locale === 'ar' ? 'rtl-text' : 'ltr-text'"
            >
              {{ t('services.' + service.benefit) }}
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<style scoped>
.scaled-card {
  transform: scale(1);
  transform-origin: center center;
}

.service-title-highlight {
  background-color: rgb(228, 234, 57); /* أصفر مائل للبرتقالي */
  display: inline-block;
  padding: 4px 12px;
  border-radius: 10px;
  font-weight: bold;
  color: #000;
}

/* ✅ التحكم باتجاه النص فقط */
.text-dir {
  transition: all 0.3s ease-in-out;
}

.rtl-text {
  text-align: right;
  direction: rtl;
}

.ltr-text {
  text-align: left;
  direction: ltr;
}
</style>
