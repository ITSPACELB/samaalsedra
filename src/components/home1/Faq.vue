<script setup lang="ts">
import FaqItem from "../shared/FaqItem.vue";
import { useI18n } from "vue-i18n";
import { ref, computed } from "vue";

const { t, locale } = useI18n();

const showAll = ref(false);

const faqs = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  q: {
    ar: t(`faq.faqs.${i + 1}.q.ar`),
    en: t(`faq.faqs.${i + 1}.q.en`),
  },
  a: {
    ar: t(`faq.faqs.${i + 1}.a.ar`),
    en: t(`faq.faqs.${i + 1}.a.en`),
  },
}));

const visibleFaqs = computed(() => {
  return showAll.value ? faqs : faqs.slice(0, 3);
});

const opened = ref<number | null>(faqs[0]?.id ?? null);
function toggleFaq(id: number) {
  opened.value = opened.value === id ? null : id;
}
</script>

<template>
  <section class="faq faq-home py-5">
    <div class="container overflow-x-hidden">
      <div class="row flex-column flex-lg-row g-5 align-items-stretch">
        <div class="col-lg-10 mx-auto">
          <div class="about-line-2"></div>
          <h2 class="fade_up_anim mb-2 sama-title">
            {{ t('faq.title') }}
          </h2>
          <p class="mb-3 mb-xl-4 pb-2 fade_up_anim" data-delay=".3">
            {{ t('faq.description') }}
          </p>

          <div class="accordion d-flex flex-column gap-3 gap-lg-4" id="accordionExample">
            <FaqItem
              v-for="faq in visibleFaqs"
              :key="faq.id"
              :id="faq.id"
              :question="faq.q[locale as 'ar' | 'en']"
              :answer="faq.a[locale as 'ar' | 'en']"
              :opened="opened === faq.id"
              :dir="locale === 'ar' ? 'rtl' : 'ltr'"
              @toggle="toggleFaq"
            />

            <div class="text-center mt-4 fade_up_anim" data-delay=".5">
              <button class="btn btn-outline-primary px-4 py-2 rounded-3" @click="showAll = !showAll">
                {{ showAll ? t('faq.showLess') : t('faq.showMore') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/_mixins.scss";

.faq-home {
  @include preserve-layout($key: 'md');
}

.sama-title {
  color: rgb(5, 52, 12) !important;
  font-weight: 800;
}
</style>
