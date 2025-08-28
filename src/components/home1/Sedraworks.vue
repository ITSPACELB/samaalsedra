<script setup lang="ts">
import { Autoplay, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/vue"
import { PhArrowLeft, PhArrowRight } from "@phosphor-icons/vue"
import { useI18n } from "vue-i18n"

const { t, locale, getLocaleMessage, availableLocales, mergeLocaleMessage } = useI18n({ useScope: "global" })

// ✅ نضمن وجود مفاتيح الأعمال بالإنجليزي حتى لو تم الكتابة فوق رسائل en في مكان آخر
const ensureWorksKeys = (lng: string) => {
  const msgs = getLocaleMessage(lng) || {}
  if (!msgs.worksSection) {
    const patch = {
      worksSection: {
        title: "Projects Executed by Sama Al-Sedra in Iraq",
        line1: "We deliver carefully engineered solar solutions tailored to local needs across Iraq, with a full commitment to quality and reliability.",
        line2: "Here is a selection of our on-site projects, executed professionally with dedicated post-delivery support."
      }
    }
    // دمج آمن لا يضيع الرسائل الموجودة
    // (لو في مكان آخر عامل setLocaleMessage وخربط، هالسطور تصلّح الوضع)
    // @ts-ignore
    const { setLocaleMessage } = (useI18n as any)({ useScope: "global" })
    setLocaleMessage(lng, { ...msgs, ...patch })
  }
}

// نضمن EN دائماً (وإذا بتستعمل en-US انسخه كمان)
ensureWorksKeys("en")
ensureWorksKeys("en-US")

// صور الأعمال: sedra1.png .. sedra15.png من /public/images/partners
const worksImages = Array.from({ length: 15 }, (_, i) => ({
  src: `/images/partners/sedra${i + 1}.png`,
  alt: `Sama Al-Sedra Project ${i + 1}`,
}))
</script>

<template>
  <section class="partners-slider" id="works">
    <div class="container">
      <div class="row align-items-end g-4 section-title">
        <div class="col-lg-8">
          <h2
            class="mb-3 fade_up_anim"
            :class="[
              { 'text-end': locale === 'ar', 'text-start': locale !== 'ar' },
              locale === 'ar' ? 'rtl-text' : 'ltr-text'
            ]"
          >
            {{ t("worksSection.title") }}
          </h2>

          <p
            class="fade_up_anim product-desc"
            :class="[
              { 'text-end': locale === 'ar', 'text-start': locale !== 'ar' },
              locale === 'ar' ? 'rtl-text' : 'ltr-text'
            ]"
            data-delay=".2"
          >
            {{ t("worksSection.line1") }}
          </p>
          <p
            class="fade_up_anim product-desc"
            :class="[
              { 'text-end': locale === 'ar', 'text-start': locale !== 'ar' },
              locale === 'ar' ? 'rtl-text' : 'ltr-text'
            ]"
            data-delay=".3"
          >
            {{ t("worksSection.line2") }}
          </p>
        </div>

        <div class="col-lg-4 d-flex justify-content-end">
          <div class="btns">
            <button class="partner-prev" aria-label="Previous"><PhArrowLeft /></button>
            <button class="partner-next" aria-label="Next"><PhArrowRight /></button>
          </div>
        </div>
      </div>

      <!-- سلايدر الأعمال -->
      <Swiper
        loop
        :autoplay="{ delay: 2500, disableOnInteraction: false }"
        :modules="[Navigation, Autoplay]"
        :navigation="{ nextEl: '.partner-next', prevEl: '.partner-prev' }"
        :breakpoints="{
          320:  { slidesPerView: 1 },
          576:  { slidesPerView: 2, spaceBetween: 16 },
          992:  { slidesPerView: 3, spaceBetween: 24 }
        }"
        class="swiper partnerSwiper"
      >
        <SwiperSlide v-for="img in worksImages" :key="img.src">
          <div class="partner-card">
            <img
              :src="img.src"
              :alt="img.alt"
              class="img-fill"
              loading="lazy"
              decoding="async"
            />
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
  height: auto; /* ما منجبر الكرت على ارتفاع محدد */
}
.partner-card:hover {
  transform: translateY(-6px);
}

/* ✅ عرض الصورة بالطول الحقيقي من دون قصّ */
.partner-card .img-fill {
  width: 100%;
  height: auto;        /* المفتاح: خلّي الارتفاع تلقائي */
  object-fit: contain; /* أو احذفها نهائياً؛ contain يضمن كل الصورة تظهر */
  display: block;
}

/* أزرار التحكم */
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

/* وصف */
.product-desc {
  font-size: 1rem;
  line-height: 1.7;
  color: #555;
  max-width: 100%;
  margin-bottom: 6px;
}

/* RTL/LTR — تغيير اتجاه النص فقط */
.rtl-text { direction: rtl; }
.ltr-text { direction: ltr; }
</style>
