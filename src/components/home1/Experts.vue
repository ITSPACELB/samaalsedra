<script setup lang="ts">
import { Autoplay, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/vue"
import { PhArrowLeft, PhArrowRight } from "@phosphor-icons/vue"
import { useI18n } from "vue-i18n"

import chisageImg from "/images/partners/chisage.png"
import itelImg from "/images/partners/itel.png"
import gospowerImg from "/images/partners/gospower.png"
import dynessImg from "/images/partners/dyness.png"
import megarevoImg from "/images/partners/megarevo.png"
import sofarImg from "/images/partners/sofar.png"

const { locale, t } = useI18n()

const companies = [
  { name: "CHISAGE ESS", img: chisageImg },
  { name: "ITEL",        img: itelImg },
  { name: "GOSPOWER",    img: gospowerImg },
  { name: "DYNESS",      img: dynessImg },
  { name: "MEGAREVO",    img: megarevoImg },
  { name: "SOFAR",       img: sofarImg },
]
</script>

<template>
  <section class="partners-slider" id="products">
    <div class="container">
      <div class="row align-items-end g-4 section-title">
        <div class="col-lg-8">
          <h2
            class="mb-3 fade_up_anim"
            :class="{ 'text-end': locale === 'ar', 'text-start': locale !== 'ar' }"
          >
            {{ t("productsSection.title") }}
          </h2>
          <p
            class="fade_up_anim product-desc"
            :class="{ 'text-end': locale === 'ar', 'text-start': locale !== 'ar', 'rtl-text': locale === 'ar' }"
            data-delay=".3"
          >
            {{
              locale === "ar"
                ? "منتجاتنا للطاقة الشمسية تجمع بين الجودة والكفاءة، وتأتي مع ضمانات موثوقة لحمايتك وضمان استثمارك. نحن نختار أفضل العلامات التجارية العالمية لتقديم حلول طاقة موثوقة تدوم لسنوات."
                : "Our solar energy products combine high quality with efficiency and are backed by reliable warranties. We carefully select top international brands to provide you with long-lasting and dependable energy solutions."
            }}
          </p>
        </div>
        <div class="col-lg-4 d-flex justify-content-end">
          <div class="btns">
            <button class="partner-prev"><PhArrowLeft /></button>
            <button class="partner-next"><PhArrowRight /></button>
          </div>
        </div>
      </div>

      <Swiper
        loop
        autoplay
        :modules="[Navigation, Autoplay]"
        :navigation="{ nextEl: '.partner-next', prevEl: '.partner-prev' }"
        :breakpoints="{
          320:  { slidesPerView: 1 },
          576:  { slidesPerView: 2, spaceBetween: 16 },
          992:  { slidesPerView: 3, spaceBetween: 24 },
        }"
        class="swiper partnerSwiper"
      >
        <SwiperSlide v-for="c in companies" :key="c.name">
          <div class="partner-card">
            <img :src="c.img" :alt="c.name" class="img-fill" />
            <h5 class="mt-2 text-center">{{ c.name }}</h5>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<style scoped>
.partners-slider {
  padding-block: 60px;
}
.partner-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
}
.partner-card:hover {
  transform: translateY(-6px);
}
.partner-card .img-fill {
  width: 100%;
  height: 250px;
  object-fit: cover;
}
.partner-card h5 {
  font-size: 0.9rem;
  padding: 12px 0;
  background-color: white;
  width: 100%;
  margin: 0;
  text-align: center;
}
.btns button {
  background: transparent;
  border: none;
  font-size: 1.4rem;
  color: var(--primary, #2E7D32);
  cursor: pointer;
  transition: color 0.2s ease;
}
.btns button:hover {
  color: #4CAF50;
}

/* وصف المنتجات */
.product-desc {
  font-size: 1rem;
  line-height: 1.7;
  color: #555;
  max-width: 100%;
}

/* اتجاه من اليمين لليسار */
.rtl-text {
  direction: rtl;
}
</style>
