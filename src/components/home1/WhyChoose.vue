<script setup lang="ts">
import { PhArrowUpRight } from "@phosphor-icons/vue"
import { useI18n } from "vue-i18n"
const { t, locale } = useI18n()
</script>

<template>
  <section class="whychoose position-relative" id="whychoose">
    <div class="right-text d-none d-xl-block">
      <h2 class="vertical">{{ t("whychoose.vertical") }}</h2>
    </div>
    <div class="line"></div>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="reveal reveal--right">
            <div class="whychoose-card">
              <!-- ✅ العنوان -->
              <h2
                class="pb-1 fade_up_anim"
                :dir="locale === 'ar' ? 'rtl' : 'ltr'"
                :style="{ textAlign: locale === 'ar' ? 'right' : 'left' }"
              >
                {{ t("whychoose.title") }}
              </h2>

              <!-- ✅ النص -->
              <p
                class="pb-2 pb-lg-3 fade_up_anim small"
                data-delay=".3"
                :dir="locale === 'ar' ? 'rtl' : 'ltr'"
                :style="{ textAlign: locale === 'ar' ? 'right' : 'left' }"
              >
                {{ t("whychoose.descFinal") }}
              </p>

              <!-- ✅ زر واتساب -->
              <a
                class="primary-btn d-inline-flex align-items-center gap-2"
                href="https://wa.me/+9647749992888"
                target="_blank"
                rel="noopener"
              >
                {{ locale === 'ar' ? 'اتصل بنا' : 'Contact Us' }}
                <PhArrowUpRight size="20" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
