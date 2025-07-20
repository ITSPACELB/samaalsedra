<script setup lang="ts">
import { PhArrowLeft, PhArrowRight, PhStar, PhStarHalf, PhWhatsappLogo } from "@phosphor-icons/vue"
import quote from "/images/quote.png"
import { Autoplay, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/vue"
import { useI18n } from "vue-i18n"
const { t, locale } = useI18n()

// 30 رأي، ترتيبهم مهم! (في ملف الترجمة)
function getCurrentTestimonialIndexes() {
  // يعرض 4 آراء مختلفة كل شهر
  const now = new Date();
  const base = (now.getMonth() + now.getFullYear()) % 30; // يتغير حسب الشهر
  // حلقة حتى ما نتجاوز 30 إذا قربنا عالنهاية
  let idxs = [];
  for (let i = 0; i < 4; i++) {
    idxs.push((base + i) % 30);
  }
  return idxs;
}

const indexes = getCurrentTestimonialIndexes();
const clients = indexes.map((i) => ({
  id: i + 1,
  text: t(`testimonials.slides.${i}`),
}));

const whatsapp = {
  img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg", // أيقونة واتساب SVG واضحة
  link: "https://wa.me/009647800530333",
};
</script>

<template>
  <section class="testimonial pt-120 pb-120">
    <div class="left-text" :dir="locale === 'ar' ? 'rtl' : 'ltr'" :style="{ textAlign: locale === 'ar' ? 'right' : 'left' }">
      <h2 class="vertical">{{ t("testimonials.vertical") }}</h2>
    </div>
    <div class="line"></div>
    <div class="container" :dir="locale === 'ar' ? 'rtl' : 'ltr'" :style="{ textAlign: locale === 'ar' ? 'right' : 'left' }">
      <div class="row">
        <div class="col-lg-10 col-xl-9 col-xxl-8">
          <div class="reveal reveal--right reveal--overlay">
            <div class="testimonial-inner">
              <h2 class="fade_up_anim">{{ t("testimonials.title") }}</h2>
              <p class="mb-4 mb-lg-5 pb-lg-2 fade_up_anim" data-delay=".3">{{ t("testimonials.desc") }}</p>
              <Swiper
                :navigation="{
                  nextEl: '.client-prev',
                  prevEl: '.client-next',
                }"
                :modules="[Navigation, Autoplay]"
                loop
                autoplay
                class="swiper clientSwiper"
              >
                <SwiperSlide v-for="client in clients" :key="client.id">
                  <div class="testimonial-card">
                    <div class="text-yellow d-flex gap-2 stars">
                      <PhStar weight="fill" />
                      <PhStar weight="fill" />
                      <PhStar weight="fill" />
                      <PhStar weight="fill" />
                      <PhStarHalf weight="fill" />
                    </div>
                    <p class="mt-3 pb-2 mb-3 mb-lg-4">{{ client.text }}</p>
                    <div class="d-flex gap-3 align-items-center">
                      <a :href="whatsapp.link" target="_blank" rel="noopener" class="d-flex align-items-center gap-2" style="text-decoration:none;">
                        <img :src="whatsapp.img" alt="whatsapp" width="36" height="36" style="border-radius:50%;background:#25d366;padding:2px;box-shadow:0 1px 4px #cbead1;">
                        <span class="whatsapp-feedback-text fw-bold" style="color:#075e54;font-size:1.07rem;">{{ t("testimonials.whatsappFeedback") }}</span>
                      </a>
                    </div>
                    <img class="quote" :src="quote" alt="" />
                  </div>
                </SwiperSlide>
              </Swiper>
              <div class="btns-client mt-4 pt-lg-2">
                <button class="client-prev">
                  <PhArrowLeft />
                </button>
                <button class="client-next">
                  <PhArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.whatsapp-feedback-text {
  transition: color 0.15s;
}
a:hover .whatsapp-feedback-text {
  color: #128c7e;
  text-decoration: underline;
}
</style>
