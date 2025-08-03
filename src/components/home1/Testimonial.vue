<script setup lang="ts">
import { PhArrowLeft, PhArrowRight, PhStar, PhStarHalf } from "@phosphor-icons/vue"
import quote from "/images/quote.png"
import { Autoplay, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/vue"
import { useI18n } from "vue-i18n"
import { computed } from "vue"

const { t, locale } = useI18n()

// دالة لاختيار 4 آراء مختلفة كل شهر
function getCurrentTestimonialIndexes() {
  const now = new Date()
  const base = (now.getMonth() + now.getFullYear()) % 30
  let idxs = []
  for (let i = 0; i < 4; i++) {
    idxs.push((base + i) % 30)
  }
  return idxs
}

const indexes = getCurrentTestimonialIndexes()

// ✅ إعادة توليد الآراء ديناميكياً حسب اللغة
const clients = computed(() =>
  indexes.map((i) => ({
    id: i + 1,
    text: t(`testimonials.slides.${i}`),
  }))
)

const whatsapp = {
  img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
  link: "https://wa.me/+9647749992888",
}
</script>

<template>
  <section class="testimonial pt-120 pb-120">
    <div
      class="left-text"
      :dir="locale === 'ar' ? 'rtl' : 'ltr'"
      :style="{ textAlign: locale === 'ar' ? 'right' : 'left' }"
    >
      <h2 class="vertical">{{ t("testimonials.vertical") }}</h2>
    </div>
    <div class="line"></div>
    <div
      class="container"
      :dir="locale === 'ar' ? 'rtl' : 'ltr'"
      :style="{ textAlign: locale === 'ar' ? 'right' : 'left' }"
    >
      <div class="row">
        <div class="col-12">
          <div class="reveal reveal--right reveal--overlay">
            <div class="testimonial-inner">
              <h2 class="fade_up_anim">{{ t("testimonials.title") }}</h2>
              <p class="mb-4 mb-lg-5 pb-lg-2 fade_up_anim" data-delay=".3">
                {{ t("testimonials.desc") }}
              </p>

              <!-- ✅ Swiper مع إعادة البناء عند تغيير اللغة -->
              <Swiper
                :key="locale"
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
                      <a
                        :href="whatsapp.link"
                        target="_blank"
                        rel="noopener"
                        class="d-flex align-items-center gap-2"
                        style="text-decoration:none;"
                      >
                        <img
                          :src="whatsapp.img"
                          alt="whatsapp"
                          width="36"
                          height="36"
                          style="border-radius:50%;background:#25d366;padding:2px;box-shadow:0 1px 4px #cbead1;"
                        />
                        <span
                          class="whatsapp-feedback-text fw-bold"
                          style="color:#075e54;font-size:1.07rem;"
                        >
                          {{ t("testimonials.whatsappFeedback") }}
                        </span>
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
