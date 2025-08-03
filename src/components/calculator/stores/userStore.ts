import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  // ✅ القيم الابتدائية (بدل ما نكررها مرتين)
  const initialValues = {
    systemType: "",
    governorate: "",
    goodSunlight: null as null | boolean,
    highBuildings: null as null | boolean,
    priority: "",
    ampHour: "",
    cutPeriod: "",
    cycleCut: "",
    cycleSupply: "",
    hasSpace: null as null | boolean,
    panelArea: "",
    batteryOnlyHours: "",
    batteryOnlyAmp: "",
    battery: "",
    inverter: "",
    phone: "",
    cutDuration: "",
    availableHours: "",
  };

  // ✅ state
  const user = ref({ ...initialValues });
  const step = ref(1);
  const resetCount = ref(0);

  // ✅ استرجاع من sessionStorage (إن وجد)
  const saved = sessionStorage.getItem("solarCalculatorProgress");
  if (saved) {
    const data = JSON.parse(saved);
    user.value = { ...user.value, ...data };
    if (data.step) step.value = data.step;
  }

  // ✅ حفظ التقدم في التخزين المؤقت
  function saveProgress() {
    sessionStorage.setItem(
      "solarCalculatorProgress",
      JSON.stringify({
        ...user.value,
        step: step.value,
      })
    );
  }

  // ✅ إعادة تعيين (Reset)
  function reset() {
    user.value = { ...initialValues }; // يرجع القيم الابتدائية
    step.value = 1; // يرجع للخطوة الأولى
    resetCount.value++; // يزيد العداد
    saveProgress(); // يحفظ الحالة الفارغة
  }

  return { user, step, resetCount, saveProgress, reset };
});
