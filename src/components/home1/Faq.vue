<script setup lang="ts">
import FaqItem from "../shared/FaqItem.vue";
import { useI18n } from "vue-i18n";
import { ref, computed, onMounted } from "vue";

const { t, locale } = useI18n();

const showAll = ref(false);
const isMobile = ref(window.innerWidth < 992); // Assuming lg breakpoint for mobile vs desktop

onMounted(() => {
  const handleResize = () => {
    isMobile.value = window.innerWidth < 992;
  };
  window.addEventListener('resize', handleResize);
  // Cleanup not needed as it's a one-time component
});

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
  if (!isMobile.value) {
    return faqs;
  }
  return showAll.value ? faqs : faqs.slice(0, 3);
});

const opened = ref<number | null>(faqs[0]?.id ?? null);
function toggleFaq(id: number) {
  opened.value = opened.value === id ? null : id;
}

// For the question form
const showForm = ref(false);
const name = ref('');
const address = ref('');
const phone = ref('');
const question = ref('');

const isFormValid = computed(() => {
  return name.value.trim() !== '' && address.value.trim() !== '' && phone.value.trim() !== '' && question.value.trim() !== '';
});

function sendToWhatsapp() {
  if (!isFormValid.value) return;
  const text = `${t('faq.form.name')}: ${name.value}\n${t('faq.form.address')}: ${address.value}\n${t('faq.form.phone')}: ${phone.value}\n${t('faq.form.question')}: ${question.value}`;
  window.open(`https://wa.me/+9647749992888?text=${encodeURIComponent(text)}`, '_blank');
  // Reset form after send
  name.value = '';
  address.value = '';
  phone.value = '';
  question.value = '';
  showForm.value = false;
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

            <div class="text-center mt-4 fade_up_anim" data-delay=".5" v-if="isMobile">
              <button class="primary-btn d-inline-flex align-items-center gap-2 px-4 py-2 rounded-3" @click="showAll = !showAll">
                {{ showAll ? t('faq.showLess') : t('faq.showMore') }}
              </button>
            </div>
          </div>

          <!-- Question Form Section -->
          <div class="mt-5 fade_up_anim" data-delay=".6">
            <div v-if="isMobile" class="text-center mb-3">
              <button class="primary-btn d-inline-flex align-items-center gap-2 px-4 py-2 rounded-3" @click="showForm = !showForm">
                {{ showForm ? t('faq.form.hide') : t('faq.form.show') }}
              </button>
            </div>
            <div v-if="!isMobile || showForm" class="accordion-item border-0 shadow-sm rounded-3" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
              <div class="accordion-body p-4">
                <p class="mb-3 blink fs-5 fw-medium text-center">{{ t('faq.form.description') }}</p>
                <p class="mb-4 alert alert-warning p-3 rounded">{{ t('faq.form.alert') }}</p>
                <div class="d-flex flex-column gap-4">
                  <input type="text" v-model="name" :placeholder="t('faq.form.namePlaceholder')" class="form-control border-primary-subtle" />
                  <input type="text" v-model="address" :placeholder="t('faq.form.addressPlaceholder')" class="form-control border-primary-subtle" />
                  <input type="tel" v-model="phone" :placeholder="t('faq.form.phonePlaceholder')" class="form-control border-primary-subtle" />
                  <textarea v-model="question" :placeholder="t('faq.form.questionPlaceholder')" class="form-control border-primary-subtle" rows="5"></textarea>
                  <button class="primary-btn d-inline-flex align-items-center gap-2 px-4 py-2 rounded-3" :disabled="!isFormValid" @click="sendToWhatsapp">
                    {{ t('faq.form.submit') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sama-title {
  color: rgb(5, 52, 12) !important;
  font-weight: 800;
}

.accordion-button {
  color: rgba(29, 43, 31, 1) !important;
  font-weight: 600;
}

.accordion-body {
  font-size: 1rem;
  line-height: 1.5;
}

.form-control {
  border: 1px solid #88dbacff;
  border-radius: 0.25rem;
  padding: 0.75rem 1.25rem;
}

/* ✅ زر إرسال أو أي زر class="primary-btn" */
.primary-btn {
  background-color: rgb(5, 52, 12); /* نفس لون الزر الي عجبك */
  border-color: rgb(5, 52, 12);
  color: #fff !important;
  font-weight: 600;
  transition: all 0.3s ease-in-out;
}

.primary-btn:hover {
  background-color: rgb(4, 41, 10);
  border-color: rgb(4, 41, 10);
  color: #ffffff;
}

.primary-btn:disabled {
  background-color: #cccccc;
  border-color: #bbbbbb;
  color: #666666;
}

.no-icon::after {
  display: none !important;
}

.accordion-item {
  transition: all 0.3s ease;
}

.accordion-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

[dir="rtl"] .accordion-button::after {
  margin-right: 0;
  margin-left: 1rem;
}

[dir="ltr"] .accordion-button::after {
  margin-right: 1rem;
  margin-left: 0;
}

.accordion-button::after {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  content: "";
  background-repeat: no-repeat;
  background-size: 1.25rem;
  transition: transform 0.2s ease-in-out;
}

.accordion-button:not(.collapsed)::after {
  transform: rotate(-180deg);
}

.blink {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
