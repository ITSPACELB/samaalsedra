<script setup lang="ts">
import { PhArrowUpRight } from "@phosphor-icons/vue"
import { useI18n } from "vue-i18n"

const { t, locale } = useI18n()
</script>

<template>
  <section class="whychoose">
    <div class="side-text d-none d-xl-flex flex-column align-items-center gap-5">
      <h2 class="vertical">{{ t("whychoose.vertical") }}</h2>
    </div>
    <div class="line"></div>
    <div class="container">
      <div class="row">
        <div class="col-lg-10 col-xl-9 position-relative">
          <div class="reveal reveal--right">
            <div class="whychoose-card">
              <!-- العنوان مع التنسيق الصحيح -->
              <h2 class="pb-1 fade_up_anim" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
                {{ t("whychoose.title") }}
              </h2>

              <!-- الفقرة الرئيسية -->
              <p class="mb-4 fade_up_anim" data-delay=".3" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
                {{ t("whychoose.descFinal") }}
              </p>

              <!-- زر الاتصال مع نص ديناميكي وتأثير ستايل محفوظ -->
              <a
                class="primary-btn"
                href="https://wa.me/009647749992888"
                target="_blank"
              >
                {{ locale === 'ar' ? 'اتصل بنا' : 'Contact Us' }}
                <PhArrowUpRight />
              </a>
            </div>
          </div>
        </div>
        <div class="d-none col-lg-2 col-xl-3 d-lg-block position-relative">
          <div class="about-line-2"></div>
          <div class="about-line-3"></div>
        </div>
      </div>
    </div>
  </section>
</template>
