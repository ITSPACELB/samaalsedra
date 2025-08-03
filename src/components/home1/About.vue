```vue
<script setup lang="ts">
import { ref, computed, watch, nextTick, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { PhArrowUpRight } from "@phosphor-icons/vue";
import { watchDebounced } from '@vueuse/core';
import { storeToRefs } from "pinia";

import { safeTranslate, replacePlaceholders } from "../calculator/utils";
import { governorateKeys, governorateSunlight, getBatteryOptions, getInverterOptions } from "../calculator/data";
import { generateReport } from "../calculator/reportGenerator";
import { userSchema } from "../calculator/validations";
import { nextStep, prevStep, sendWhatsApp, resetCalculator } from "../calculator/handlers";
import { useUserStore } from "../calculator/stores/userStore";

const store = useUserStore();
const { user, step, resetCount } = storeToRefs(store);
const { t, locale } = useI18n();

const errors = reactive({
  ampHour: "",
  cycleCut: "",
  cycleSupply: "",
  phone: "",
  cutDuration: "",
  availableHours: ""
});

// ✅ التالي
const handleNext = async () => {
  console.log('handleNext called', { step: step.value, user: user.value, errors });
  await nextTick();
  nextStep(step, user.value, errors);
  store.saveProgress();
};

// ✅ السابق
const handlePrev = () => {
  console.log('handlePrev called', { step: step.value });
  prevStep(step, user.value);
  store.saveProgress();
};

// ✅ إعادة تعيين
const handleReset = () => {
  console.log('handleReset called');
  step.value = 1;  // إعادة تعيين الخطوة إلى 1 عند إعادة تعيين الحاسبة
  
  // إعادة تعيين الحاسبة
  resetCalculator(user.value, step, aiMsg, resetCount.value, t);

  // تحديد النص وفقًا للغة النشطة
  aiMsg.value = safeTranslate(
    t,
    locale.value === 'ar' ? 'calculator.startQuestion' : 'calculator.startQuestion',
    locale.value === 'ar' ? 'ابدأ بإدخال بياناتك لتصميم نظامك الشمسي!' : 'Start by entering your data to design your solar system!'
  );
};

// ✅ خيارات البطاريات والإنفرترات
const batteryOptions = computed(() => getBatteryOptions(t));
const inverterOptions = computed(() => getInverterOptions(t));

const filteredBatteryOptions = computed(() => {
  if (!user.value.inverter) return batteryOptions.value;
  const invMatch = user.value.inverter.match(/(\d+(\.\d+)?)/);
  if (!invMatch) return batteryOptions.value;
  const inverterCapacity = parseFloat(invMatch[0]);
  return batteryOptions.value.map(group => ({
    ...group,
    items: group.items.filter(item => {
      const batteryCapacity = parseFloat(item.match(/(\d+(\.\d+)?)/)?.[0] || "0");
      return batteryCapacity >= inverterCapacity * 2;
    })
  }));
});

const estimatedPanels = computed(() => {
  const inv = user.value.inverter?.match(/(\d+(\.\d+)?)/);
  return inv ? Math.ceil(parseFloat(inv[0]) * 1.5) : "";
});

// ✅ AI Message
const aiLoading = ref(false);
const aiMsg = ref(safeTranslate(t, 'calculator.aiStartMsg', 'ابدأ باختيار نوع النظام'));

// ✅ Debounce AI (إصدار مُحسن)
watchDebounced(
  [() => step.value, () => locale.value],
  async ([newStep]) => {
    console.log("watchDebounced triggered", { newStep, locale: locale.value });
    await nextTick();

    // إذا كانت الخطوة 1 مباشرة بعد إعادة التعيين، قم بتحديث الرسالة مباشرة
    if (newStep === 1) {
      aiMsg.value = safeTranslate(
        t,
        'calculator.startQuestion',
        'ابدأ بإدخال بياناتك لتصميم نظامك الشمسي!'
      );
      return;
    }

    // ✅ عند الخطوة الأخيرة: توليد التقرير
    if (newStep === 11) {
      aiMsg.value = generateReport(user.value, t, governorateSunlight);
      return;
    }

    // ✅ الخطوات 1-10: عرض الأسئلة
    if (newStep >= 1 && newStep <= 10) {
      const questionKeys = [
        "calculator.questionSystemType",
        "calculator.questionGovernorate",
        "calculator.questionGoodSunlight",
        "calculator.questionHighBuildings",
        "calculator.questionPriority",
        "calculator.questionAmpHour",
        "calculator.questionCycleCut",
        "calculator.questionCutPeriod",
        "calculator.questionBattery",
        "calculator.questionInverter",
      ];

      // ✅ تحديث الرسالة الأساسية
      aiMsg.value = safeTranslate(
        t,
        questionKeys[newStep - 1],
        `سؤال الخطوة ${newStep}`
      );

      // ✅ معالجة خاصة لخطوة جدول الانقطاع (7)
      if (newStep === 7) {
        if (errors.cycleCut || errors.cycleSupply) {
          aiMsg.value += `\n${safeTranslate(
            t,
            "calculator.fixErrors",
            "يرجى تصحيح الأخطاء"
          )}`;
          if (errors.cycleCut)
            aiMsg.value += `\n- ${errors.cycleCut}`;
          if (errors.cycleSupply)
            aiMsg.value += `\n- ${errors.cycleSupply}`;
        } else if (user.value.cycleCut && user.value.cycleSupply) {
          aiMsg.value +=
            `\n` +
            replacePlaceholders(
              safeTranslate(
                t,
                "calculator.scheduleSummary",
                "جدول الانقطاع: مدة القطع {cutDuration} ساعة، ساعات التوفر {availableHours} ساعة، عدد الدورات يوميًا: {cycles}"
              ),
              {
                cutDuration: user.value.cycleCut,
                availableHours: user.value.cycleSupply,
                cycles: Math.floor(
                  24 / (parseFloat(user.value.cycleCut) + parseFloat(user.value.cycleSupply))
                ).toString(),
              }
            );
        }
      }
      return;
    }

    // ✅ إذا رجعنا للبداية
    aiMsg.value = safeTranslate(
      t,
      "calculator.aiStartMsg",
      "ابدأ باختيار نوع النظام"
    );
  },
  { debounce: 300, maxWait: 1000 }
);

// ✅ التحقق العام بـ Zod
watch(user, () => {
  // ✅ إذا كل الحقول فاضية، نمسح كل الأخطاء ونوقف
  if (
    !user.value.ampHour &&
    !user.value.cycleCut &&
    !user.value.cycleSupply &&
    !user.value.phone
  ) {
    errors.ampHour = "";
    errors.cycleCut = "";
    errors.cycleSupply = "";
    errors.phone = "";
    return;
  }

  // ✅ تحقق ذكي لكل حقل على حدة
  try {
    // تحقق من الأمبير فقط لو فيه قيمة
    if (user.value.ampHour?.toString().trim()) {
      userSchema.pick({ ampHour: true }).parse({ ampHour: user.value.ampHour });
      errors.ampHour = "";
    } else {
      errors.ampHour = "";
    }

    // تحقق من مدة القطع لو فيه قيمة
    if (user.value.cycleCut?.toString().trim()) {
      userSchema.pick({ cycleCut: true }).parse({ cycleCut: user.value.cycleCut });
      errors.cycleCut = "";
    } else {
      errors.cycleCut = "";
    }

    // تحقق من ساعات التوفر لو فيه قيمة
    if (user.value.cycleSupply?.toString().trim()) {
      userSchema.pick({ cycleSupply: true }).parse({ cycleSupply: user.value.cycleSupply });
      errors.cycleSupply = "";
    } else {
      errors.cycleSupply = "";
    }

    // تحقق من الهاتف لو فيه قيمة
if (user.value.phone?.trim()) {
  if (user.value.phone.length >= 10) {
    try {
      userSchema.pick({ phone: true }).parse({ phone: user.value.phone });
      errors.phone = "";
    } catch (e: any) {
      errors.phone = e.issues?.find(err => err.path[0] === "phone")?.message || "";
    }
  } else {
    errors.phone = ""; // 🚩 ما نعرض خطأ لو الرقم قصير لسا
  }
} else {
  errors.phone = "";
}
  } catch (e: any) {
    // ✅ جمع الأخطاء وتوزيعها على الحقول
    if (e.issues) {
      e.issues.forEach((err: any) => {
        const field = err.path[0];
        if (field === "ampHour") errors.ampHour = err.message;
        if (field === "cycleCut") errors.cycleCut = err.message;
        if (field === "cycleSupply") errors.cycleSupply = err.message;
        if (field === "phone") errors.phone = err.message;
      });
    }
  }
}, { deep: true });

// ✅ تعطيل زر التالي
const isNextDisabled = computed(() => {
  if (step.value === 1) return !user.value.systemType;
  if (step.value === 2) return !user.value.governorate;
  if (step.value === 3) return user.value.goodSunlight === null;
  if (step.value === 4) return user.value.highBuildings === null;
  if (step.value === 5) return !user.value.priority;
  if (step.value === 6) return Boolean(errors.ampHour) || !user.value.ampHour;
  if (step.value === 7) return Boolean(errors.cycleCut || errors.cycleSupply) || !user.value.cycleCut || !user.value.cycleSupply;
  if (step.value === 8) return !user.value.cutPeriod;
  if (step.value === 9) return !user.value.battery;
  if (step.value === 10) return !user.value.inverter;
  return false;
});

const handleSend = () => {
  console.log('handleSend called');
  sendWhatsApp(user.value, t, errors, estimatedPanels, aiMsg);
};
</script>

<template>
  <section id="calculator" class="calculator" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="calculator-bar">
      <div class="ai-column">
        <div class="sama-ai-box-ai">
          <div v-if="aiLoading" class="ai-spinner">
            <span>.</span><span>.</span><span>.</span>
          </div>
          <span v-else v-html="aiMsg"></span>
        </div>
      </div>
      <div class="calculator-main-col">
        <div class="calculator-title-main">{{ safeTranslate(t, 'calculator.title', 'حاسبة الطاقة الشمسية') }}</div>
        <div class="step-indicator">
          <span v-for="i in 11" :key="i" :class="{ active: step === i }">{{ i }}</span>
          <button class="reset-btn" type="button" @click="handleReset">{{ safeTranslate(t, 'calculator.reset', 'إعادة تعيين') }}</button>
        </div>
        <form @submit.prevent="handleNext" class="sama-calc-form" autocomplete="off" style="display: flex; visibility: visible; opacity: 1;">
          <!-- الخطوة 1: نوع النظام -->
          <template v-if="step === 1">
            <div class="calc-radio-group">
              <label><input type="radio" v-model="user.systemType" value="منزل" required /> {{ safeTranslate(t, 'calculator.home', 'منزل') }}</label>
              <label><input type="radio" v-model="user.systemType" value="شركة" required /> {{ safeTranslate(t, 'calculator.company', 'شركة') }}</label>
            </div>
          </template>
          
          <!-- الخطوة 2: المحافظة -->
          <template v-else-if="step === 2">
            <div class="input-wrapper">
              <select class="calc-input" v-model="user.governorate" required>
                <option value="" disabled>{{ safeTranslate(t, 'calculator.governoratePlaceholder', 'اختر المحافظة') }}</option>
                <option v-for="key in governorateKeys" :key="key" :value="key">
                  {{ safeTranslate(t, `calculator.iraqGovernorates.${key}`, key) }}
                </option>
              </select>
              <label class="floating-label">{{ safeTranslate(t, 'calculator.governorate', 'المحافظة') }}</label>
            </div>
          </template>
          
          <!-- الخطوة 3: أشعة الشمس -->
          <template v-else-if="step === 3">
            <div class="calc-radio-group">
              <label><input type="radio" v-model="user.goodSunlight" :value="true" required /> {{ safeTranslate(t, 'calculator.yes', 'نعم') }}</label>
              <label><input type="radio" v-model="user.goodSunlight" :value="false" required /> {{ safeTranslate(t, 'calculator.no', 'لا') }}</label>
            </div>
          </template>
          
          <!-- الخطوة 4: المباني العالية -->
          <template v-else-if="step === 4">
            <div class="calc-radio-group">
              <label><input type="radio" v-model="user.highBuildings" :value="true" required /> {{ safeTranslate(t, 'calculator.yes', 'نعم') }}</label>
              <label><input type="radio" v-model="user.highBuildings" :value="false" required /> {{ safeTranslate(t, 'calculator.no', 'لا') }}</label>
            </div>
          </template>
          
          <!-- الخطوة 5: الأولوية -->
          <template v-else-if="step === 5">
            <div class="calc-radio-group">
              <label><input type="radio" v-model="user.priority" value="توفير التكلفة" required /> {{ safeTranslate(t, 'calculator.priorityCost', 'توفير التكلفة') }}</label>
              <label><input type="radio" v-model="user.priority" value="الاعتمادية" required /> {{ safeTranslate(t, 'calculator.priorityReliability', 'الاعتمادية') }}</label>
              <label><input type="radio" v-model="user.priority" value="طاقة عالية" required /> {{ safeTranslate(t, 'calculator.priorityPower', 'طاقة عالية') }}</label>
            </div>
          </template>
          
          <!-- الخطوة 6: الأمبير/ساعة -->
          <template v-else-if="step === 6">
            <div class="input-wrapper">
              <input
                type="number"
                class="calc-input"
                v-model="user.ampHour"
                placeholder=" "
                required
                min="1"
                max="1000"
                maxlength="5"
                :class="{ error: errors.ampHour }"
              />
              <label class="floating-label">{{ safeTranslate(t, 'calculator.ampHour', 'الأمبير/ساعة') }}</label>
              <span v-if="errors.ampHour" class="error-tooltip">{{ errors.ampHour }}</span>
            </div>
          </template>
          
          <!-- الخطوة 7: جدول الانقطاع -->
          <template v-else-if="step === 7">
            <div class="input-group schedule-group">
              <div class="input-wrapper">
                <input
                  type="number"
                  class="calc-input"
                  v-model="user.cycleCut"
                  placeholder=" "
                  required
                  min="1"
                  max="24"
                  maxlength="2"
                  :class="{ error: errors.cycleCut }"
                />
                <label class="floating-label">{{ safeTranslate(t, 'calculator.cycleCut', 'مدة القطع (ساعات)') }}</label>
                <span v-if="errors.cycleCut" class="error-tooltip">{{ errors.cycleCut }}</span>
              </div>
              <div class="input-wrapper">
                <input
                  type="number"
                  class="calc-input"
                  v-model="user.cycleSupply"
                  placeholder=" "
                  required
                  min="1"
                  max="24"
                  maxlength="2"
                  :class="{ error: errors.cycleSupply }"
                />
                <label class="floating-label">{{ safeTranslate(t, 'calculator.cycleSupply', 'ساعات التوفر') }}</label>
                <span v-if="errors.cycleSupply" class="error-tooltip">{{ errors.cycleSupply }}</span>
              </div>
            </div>
          </template>
          
          <!-- الخطوة 8: فترة القطع -->
          <template v-else-if="step === 8">
            <div class="calc-radio-group">
              <label><input type="radio" v-model="user.cutPeriod" value="day" required /> {{ safeTranslate(t, 'calculator.cutPeriodDay', 'نهار فقط') }}</label>
              <label><input type="radio" v-model="user.cutPeriod" value="night" required /> {{ safeTranslate(t, 'calculator.cutPeriodNight', 'ليل فقط') }}</label>
              <label><input type="radio" v-model="user.cutPeriod" value="day_night" required /> {{ safeTranslate(t, 'calculator.cutPeriodDayNight', 'نهار وليل') }}</label>
            </div>
          </template>
          
          <!-- الخطوة 9: البطارية -->
          <template v-else-if="step === 9">
            <div class="input-wrapper">
              <select class="calc-input" v-model="user.battery" required>
                <option value="" disabled>{{ safeTranslate(t, 'calculator.batteryPlaceholder', 'اختر البطارية') }}</option>
                <optgroup v-for="group in filteredBatteryOptions" :label="group.group">
                  <option v-for="item in group.items" :value="item">{{ item }}</option>
                </optgroup>
              </select>
              <label class="floating-label">{{ safeTranslate(t, 'calculator.batteryLabel', 'البطارية') }}</label>
            </div>
          </template>
          
          <!-- الخطوة 10: الإنفرتر -->
          <template v-else-if="step === 10">
            <div class="input-wrapper">
              <select class="calc-input" v-model="user.inverter" required>
                <option value="" disabled>{{ safeTranslate(t, 'calculator.inverterPlaceholder', 'اختر الإنفرتر') }}</option>
                <option v-for="option in inverterOptions" :value="option">{{ option }}</option>
              </select>
              <label class="floating-label">{{ safeTranslate(t, 'calculator.inverterLabel', 'الإنفرتر') }}</label>
            </div>
          </template>
          
          <!-- الخطوة 11: النتائج -->
          <template v-else-if="step === 11">
            <div class="cost-section">
              <div class="input-wrapper">
                <input
                  type="tel"
                  class="calc-input"
                  v-model="user.phone"
                  placeholder=" "
                  required
                  pattern="[0-9]{10,15}"
                  maxlength="15"
                  :class="{ error: errors.phone }"
                />
                <label class="floating-label">{{ safeTranslate(t, 'calculator.phone', 'رقم الهاتف') }}</label>
                <span v-if="errors.phone" class="error-tooltip">{{ errors.phone }}</span>
              </div>
              <button
                class="calc-btn whatsapp-btn"
                type="button"
                @click="handleSend"
                :disabled="!!errors.phone"
                :title="errors.phone ? safeTranslate(t, 'calculator.fixErrors', 'يرجى تصحيح الأخطاء') : ''"
              >
                {{ safeTranslate(t, 'calculator.submit', 'إرسال عبر واتساب') }}
              </button>
            </div>
          </template>
          
          <!-- أزرار التنقل -->
          <div class="button-group">
            <button
              v-if="step < 11"
              class="calc-btn"
              type="submit"
              :disabled="isNextDisabled"
              :title="isNextDisabled ? safeTranslate(t, 'calculator.fixErrors', 'يرجى تصحيح الأخطاء') : ''"
            >
              {{ safeTranslate(t, 'calculator.next', 'التالي') }}
            </button>
            <button
              v-if="step > 1"
              class="calc-btn-secondary"
              type="button"
              @click="handlePrev"
            >
              {{ safeTranslate(t, 'calculator.back', 'السابق') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style src="@/components/calculator/calculator.css"></style>
```