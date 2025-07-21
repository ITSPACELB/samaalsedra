<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { PhArrowUpRight } from "@phosphor-icons/vue";

// -----------------------------------
// إعداد البيانات الأساسية
// -----------------------------------
const { t, locale } = useI18n();

const step = ref(1);
const resetCount = ref(0);
const user = reactive({
  systemType: "",
  governorate: "",
  goodSunlight: null as null | boolean,
  highBuildings: null as null | boolean,
  priority: "",
  ampHour: "",
  cutPeriod: "", // يدعم: "day", "night", "day_night"
  cycleCut: "",    // عدد ساعات القطع المتتالية
  cycleSupply: "", // عدد ساعات التجهيز المتتالية
  hasSpace: null as null | boolean,
  panelArea: "",
  batteryOnlyHours: "",
  batteryOnlyAmp: "",
  battery: "",
  inverter: "",
  phone: "",
  cutDuration: "",       // ✅ حولناها من 0 إلى string
  availableHours: "",    // ✅ حولناها من 0 إلى string
});

// استرجاع التقدم المحفوظ
const saved = sessionStorage.getItem("solarCalculatorProgress");
if (saved) {
  const data = JSON.parse(saved);
  Object.assign(user, data);
  if (data.step) step.value = data.step;
}

// المحافظات العراقية
const governorateKeys = [
  "baghdad", "basra", "ninawa", "erbil", "sulaymaniyah", "duhok", "kirkuk",
  "diyala", "anbar", "babel", "karbala", "najaf", "muthanna", "qadisiyah",
  "wasit", "maysan", "dhiqar", "salahaddin"
];

// بيانات الإشعاع الشمسي
const governorateSunlight = {
  "baghdad": 5.8, "basra": 6.2, "ninawa": 5.5, "erbil": 5.4, "sulaymaniyah": 5.3,
  "duhok": 5.4, "kirkuk": 5.7, "diyala": 5.8, "anbar": 6.1, "babel": 5.9,
  "karbala": 6.0, "najaf": 6.1, "muthanna": 6.3, "qadisiyah": 5.9, "wasit": 5.8,
  "maysan": 6.2, "dhiqar": 6.3, "salahaddin": 5.6
};

// -----------------------------------
// خيارات البطاريات والإنفرترات
// -----------------------------------
const batteryOptions = computed(() => {
  return [
    { group: t('calculator.chisag'), items: [
        t('calculator.battery.chisag5'), t('calculator.battery.chisag8'),
        t('calculator.battery.chisag10'), t('calculator.battery.chisag16')
      ] },
    { group: t('calculator.etel'), items: [
        t('calculator.battery.etel2_5'), t('calculator.battery.etel5_12'),
        t('calculator.battery.etel10'), t('calculator.battery.etel14_33')
      ] },
    { group: t('calculator.cospower'), items: [
        t('calculator.battery.cospower2_5'), t('calculator.battery.cospower5_12'),
        t('calculator.battery.cospower10'), t('calculator.battery.cospower14_3'),
        t('calculator.battery.cospower16')
      ] },
    { group: t('calculator.sofar'), items: [t('calculator.battery.sofar5')] },
    { group: t('calculator.dynes'), items: [
        t('calculator.battery.dynes5'), t('calculator.battery.dynes10'),
        t('calculator.battery.dynes14_36')
      ] }
  ];
});

const inverterOptions = computed(() => {
  return [
    t('calculator.inverter.chisag6'), t('calculator.inverter.chisag8'),
    t('calculator.inverter.chisag10'), t('calculator.inverter.chisag12'),
    t('calculator.inverter.chisag14'), t('calculator.inverter.etel4'),
    t('calculator.inverter.etel6'), t('calculator.inverter.etel12'),
    t('calculator.inverter.cospower4'), t('calculator.inverter.cospower6'),
    t('calculator.inverter.cospower12'), t('calculator.inverter.sofar20')
  ];
});

// -----------------------------------
// حفظ التقدم
// -----------------------------------
watch([user, step], () => {
  sessionStorage.setItem("solarCalculatorProgress", JSON.stringify({
    ...user,
    step: step.value
  }));
});

// -----------------------------------
// تصفية خيارات البطاريات
// -----------------------------------
const filteredBatteryOptions = computed(() => {
  if (!user.inverter) return batteryOptions.value;
  const invMatch = user.inverter.match(/(\d+(\.\d+)?)/);
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

// -----------------------------------
// حساب عدد الألواح
// -----------------------------------
const estimatedPanels = computed(() => {
  let inv = user.inverter?.match(/(\d+(\.\d+)?)/);
  if (inv) {
    let power = parseFloat(inv[0]);
    return Math.ceil(power * 1.5);
  }
  return "";
});

// -----------------------------------
// إعداد نافذة الذكاء الاصطناعي
// -----------------------------------
const aiLoading = ref(false);
const aiMsg = ref(t('calculator.aiStartMsg'));

// -----------------------------------
// التحقق من النظام
// -----------------------------------
const systemValidation = computed(() => {
  const warnings: string[] = [];
  const invMatch = user.inverter?.match(/(\d+(\.\d+)?)/);
  const batMatch = user.battery?.match(/(\d+(\.\d+)?)/);
  if (invMatch && batMatch) {
    const inverterCapacity = parseFloat(invMatch[0]);
    const batteryCapacity = parseFloat(batMatch[0]);
    const expectedPanels = Math.ceil(inverterCapacity * 1.5);
    if (estimatedPanels.value !== expectedPanels) {
      warnings.push(t('calculator.warnings.panels'));
    }
    if (batteryCapacity < inverterCapacity * 2) {
      warnings.push(t('calculator.warnings.battery'));
    }
  }
  return warnings;
});

// -----------------------------------
// تقدير أداء النظام
// -----------------------------------
const estimateSystemPerformance = () => {
  const inverter = user.inverter ? parseFloat(user.inverter.match(/(\d+(\.\d+)?)/)?.[0] || "0") : 0;
  const battery = user.battery ? parseFloat(user.battery.match(/(\d+(\.\d+)?)/)?.[0] || "0") : 0;
  const ampHour = parseFloat(user.ampHour) || 0;
  
  const requiredPower = ampHour * 220;
  const batteryPower = battery * 1000;
  const panelPower = (inverter * 1.5) * 5;
  const efficiency = Math.min(100, Math.round((batteryPower + panelPower) / requiredPower * 100));
  
  return {
    requiredPower,
    batteryPower,
    panelPower,
    efficiency,
    inverter,
    battery,
    panels: estimatedPanels.value
  };
};

// -----------------------------------
// مراقبة الخطوات
// -----------------------------------
import { nextTick } from 'vue';

let lastStep: number | null = null;
let lastLocale: string | null = null;

watch([() => step.value, () => locale.value], async ([newStep, newLocale]) => {
  const stepChanged = newStep !== lastStep;
  const localeChanged = newLocale !== lastLocale;

  lastStep = newStep;
  lastLocale = newLocale;

  await nextTick();

// دالة استبدال المتغيرات داخل النصوص المترجمة
function replacePlaceholders(str: string, replacements: Record<string, string>) {
return str.replace(/{{(\w+)}}/g, (_: string, key: string) => replacements[key] ?? '');
}

if (newStep === 11) {
  // المدخلات
  const ampHour = Math.max(1, parseFloat(user.ampHour) || 0);
  const cycleCut = Math.max(1, parseFloat(user.cycleCut) || 0);
  const cycleSupply = Math.max(1, parseFloat(user.cycleSupply) || 0);

  // بيانات الألواح
  const panelTypes = [
    { name: t('calculator.panel.etel'), watt: 610, area: 2.45 },
    { name: t('calculator.panel.risen'), watt: 705, area: 3.09 }
  ];
  const selectedPanel = panelTypes[0];
  const panelWatt = selectedPanel.watt;
  const panelArea = selectedPanel.area;
  const panelName = selectedPanel.name;

  // البطارية والإنفرتر
  const inverterUser = parseFloat(user.inverter?.match(/(\d+(\.\d+)?)/)?.[0] || "0");
  const batteryUser = parseFloat(user.battery?.match(/(\d+(\.\d+)?)/)?.[0] || "0");

  // فاقد الإشعاع والتظليل
  let sunlightHours = governorateSunlight[user.governorate as keyof typeof governorateSunlight] || 5.5
  let sunlightFactor = 1;
  if (user.goodSunlight === false) sunlightFactor -= 0.25;
  if (user.highBuildings === true) sunlightFactor -= 0.15;
  sunlightHours = Math.max(2, sunlightHours * sunlightFactor);
  const panelEfficiencyLoss = 0.9;
  const batteryEfficiencyLoss = 0.85;

  // حساب عدد الدورات والانقطاع الكلي
  const totalCycle = cycleCut + cycleSupply;
  const cyclesPerDay = Math.floor(24 / totalCycle);
  const totalCutHours = cyclesPerDay * cycleCut;

  // توزيع الانقطاع نهاراً وليلاً
function distributeDayNight(cutH: number, suppH: number, cycles: number, dayStart = 6, dayEnd = 18) {
    let dayCut = 0, nightCut = 0;
    let t = dayStart;
    for (let i = 0; i < cycles; i++) {
      let cutStart = t;
      let cutEnd = t + cutH;
      let dayOverlap = Math.max(0, Math.min(cutEnd, dayEnd) - Math.max(cutStart, dayStart));
      let nightOverlap = cutH - dayOverlap;
      dayCut += dayOverlap;
      nightCut += nightOverlap;
      t = (t + cutH + suppH) % 24;
    }
    return { dayCut: Math.round(dayCut * 10) / 10, nightCut: Math.round(nightCut * 10) / 10 };
  }
  const { dayCut, nightCut } = distributeDayNight(cycleCut, cycleSupply, cyclesPerDay);

  // الاستهلاك
  const voltage = 220;
  const dayLoadWatt = Math.round(ampHour * voltage * dayCut);
  const nightLoadWatt = Math.round(ampHour * voltage * nightCut);
  const totalConsumptionWatt = dayLoadWatt + nightLoadWatt;
  const dayLoadAmp = Math.round((dayLoadWatt / voltage) * 10) / 10;
  const nightLoadAmp = Math.round((nightLoadWatt / voltage) * 10) / 10;
  const totalConsumptionAmp = Math.round((totalConsumptionWatt / voltage) * 10) / 10;

  // البطارية المطلوبة
  let recommendedBattery = Math.ceil((nightLoadWatt / 1000) * 1.2 / batteryEfficiencyLoss * 10) / 10;

  // الإنفرتر المثالي
  const optimalInverter = Math.ceil(((dayLoadWatt + nightLoadWatt) / voltage / 4) * 1.2 * 10) / 10;

  // البطارية المقترحة
  const availableBatteries = batteryOptions.value.flatMap(group =>
    group.items.map(item => parseFloat(item.match(/(\d+(\.\d+)?)/)?.[0] || "0"))
  );
  const suggestedBattery = availableBatteries.filter(x => x >= recommendedBattery).sort((a, b) => a - b)[0] || availableBatteries.sort((a, b) => a - b)[0];

  // الإنفرتر المقترح
  const availableInverters = inverterOptions.value.map(option =>
    parseFloat(option.match(/(\d+(\.\d+)?)/)?.[0] || "0")
  );
  const suggestedInverter = availableInverters.filter(x => x >= optimalInverter).sort((a, b) => a - b)[0] || availableInverters.sort((a, b) => a - b)[0];

  // عدد الألواح والمساحة
  const requiredPanelEnergy = totalConsumptionWatt / panelEfficiencyLoss;
  const panelDailyOutput = panelWatt * sunlightHours;
  let optimalPanels = Math.ceil(requiredPanelEnergy / panelDailyOutput);
  const totalPanelArea = +(optimalPanels * panelArea).toFixed(2);

  // الملاحظات
  let consumptionNote = "";
  if (!user.ampHour || ampHour < 3) {
    consumptionNote = t('calculator.consumptionNote');
  }

let batteryStatus = "";
if (batteryUser && Math.abs(batteryUser - suggestedBattery) > 0.5) {
  batteryStatus = replacePlaceholders(t('calculator.batteryStatus'), {
    user: batteryUser.toString(),
    recommended: suggestedBattery.toString(),
    panelName
  });
}

let inverterStatus = "";
if (inverterUser && Math.abs(inverterUser - suggestedInverter) > 0.2) {
  inverterStatus = replacePlaceholders(t('calculator.inverterStatus'), {
    user: inverterUser.toString(),
    recommended: suggestedInverter.toString()
  });
}

let efficiencyNote = "";
if (nightCut > 6 || sunlightHours < 4 || ampHour > 12) {
  efficiencyNote = t('calculator.efficiencyNote');
}

let nightOnlyNote = "";
if (dayCut === 0 && nightCut > 0) {
  nightOnlyNote = replacePlaceholders(t('calculator.nightOnlyNote'), {
    suggestedBattery: suggestedBattery.toString(),
    nightLoad: nightLoadWatt.toString()
  });
}

let spaceNote = "";
if (optimalPanels > 0) {
  spaceNote = replacePlaceholders(t('calculator.spaceNote'), {
    area: totalPanelArea.toString(),
    count: optimalPanels.toString(),
    watt: panelWatt.toString(),
    panelName
  });
}

let largeAreaNote = "";
if (totalPanelArea > 20) {
  largeAreaNote = replacePlaceholders(t('calculator.largeAreaNote'), {
    area: totalPanelArea.toString()
  });
}

const lossNote = t('calculator.lossNote');

const scheduleNote = replacePlaceholders(t('calculator.scheduleSummary'), {
  cutDuration: cycleCut.toString(),
  availableHours: cycleSupply.toString(),
  cycles: cyclesPerDay.toString()
});

  // توليد التقرير النهائي
  let details = `🔆 **${t('calculator.planTitle')}**\n\n`;
  if (consumptionNote) details += `${consumptionNote}\n\n`;
  details += `**${t('calculator.consumptionHeader')}**\n`;
  details += `${scheduleNote}\n`;
  details += `• ${t('calculator.totalConsumption')}: **${totalConsumptionWatt} ${t('calculator.wattHour')}** (${totalConsumptionAmp} ${t('calculator.ampHour')})\n`;
  details += `• ${t('calculator.nightConsumption')}: **${nightLoadWatt} ${t('calculator.wattHour')}** (${nightLoadAmp} ${t('calculator.ampHour')} - ${Math.round(nightCut)} ${t('calculator.hours')})\n`;
  details += `• ${t('calculator.dayConsumption')}: **${dayLoadWatt} ${t('calculator.wattHour')}** (${dayLoadAmp} ${t('calculator.ampHour')} - ${Math.round(dayCut)} ${t('calculator.hours')})\n\n`;
  details += `**${t('calculator.systemComponents')}**\n`;
  details += `• ${t('calculator.suggestedBattery')}: **${suggestedBattery} ${t('calculator.kwh')} (${panelName})**\n`;
  details += `• ${t('calculator.suggestedInverter')}: **${suggestedInverter} ${t('calculator.kw')}**\n`;
  if (optimalPanels > 0) {
    details += `• ${t('calculator.requiredPanels')}: **${optimalPanels} × ${panelWatt} ${t('calculator.watt')} (${panelName})**\n`;
    details += `• ${t('calculator.panelArea')}: **${totalPanelArea} ${t('calculator.squareMeter')}**\n`;
  }
  details += `\n${lossNote}\n`;
  if (batteryStatus || inverterStatus || efficiencyNote || nightOnlyNote || largeAreaNote) {
    details += `\n**${t('calculator.warningsHeader')}**\n`;
    if (batteryStatus) details += `${batteryStatus}\n`;
    if (inverterStatus) details += `${inverterStatus}\n`;
    if (efficiencyNote) details += `${efficiencyNote}\n`;
    if (nightOnlyNote) details += `${nightOnlyNote}\n`;
    if (largeAreaNote) details += `${largeAreaNote}\n`;
  }
  if (spaceNote) details += `\n${spaceNote}\n`;
  details += `\n🟢 ${t('calculator.supportNote')}`;
  details += `\n\n— ${t('calculator.teamSignature')} —`;

  aiMsg.value = details;
  
} else if (newStep >= 1 && newStep <= 10) {
  const questionKeys = [
    "calculator.questionSystemType",
    "calculator.questionGovernorate",
    "calculator.questionGoodSunlight",
    "calculator.questionHighBuildings",
    "calculator.questionPriority",
    "calculator.questionAmpHour",
    "calculator.questioncycleCut",
    "calculator.questionCutPeriod",
    "calculator.questionBattery",
    "calculator.questionInverter"
  ];
  aiMsg.value = t(questionKeys[newStep - 1]);
  if (newStep === 7) {
    if (errors.cutDuration || errors.availableHours) {
      aiMsg.value += `\n${t('calculator.fixErrors')}`;
      if (errors.cutDuration) aiMsg.value += `\n- ${errors.cutDuration}`;
      if (errors.availableHours) aiMsg.value += `\n- ${errors.availableHours}`;
    } else if (user.cutDuration && user.availableHours) {
      aiMsg.value += `\n` + replacePlaceholders(t('calculator.scheduleSummary'), {
        cutDuration: user.cutDuration,
        availableHours: user.availableHours,
        cycles: Math.floor(24 / (parseFloat(user.cutDuration) + parseFloat(user.availableHours))).toString()
      });
    }
  }
  
} else {
  aiMsg.value = t('calculator.aiStartMsg');
}
});
// -----------------------------------
// التحقق من المدخلات
// -----------------------------------
const validateNumeric = (value: string, min: number, max: number, errorMsg: string) => {
  if (!value || String(value).trim() === "") return "";
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max && Number.isInteger(num) ? "" : errorMsg;
};

const errors = reactive({
  ampHour: "",
  cycleCut: "",
  cycleSupply: "",
  phone: "",
  cutDuration: "",       // ✅ مضافة حديثاً
  availableHours: ""     // ✅ مضافة حديثاً
});


// تحقق فوري من ampHour
watch(() => user.ampHour, (val) => {
  nextTick(() => {
    errors.ampHour = validateNumeric(val, 1, 1000, t('calculator.errors.ampHour'));
  });
});

// تحقق من باقي القيم داخل user
watch(user, () => {
errors.cutDuration = validateNumeric(user.cutDuration.toString(), 1, 24, t('calculator.errors.cutDuration'));
  errors.availableHours = validateNumeric(user.availableHours, 1, 24, t('calculator.errors.availableHours'));
  errors.phone = user.phone && !/^[0-9]{10,15}$/.test(user.phone) ? t('calculator.errors.phone') : "";
});

const isNextDisabled = computed(() => {
  if (step.value === 6) {
    return errors.ampHour || !user.ampHour;
  } else if (step.value === 7) {
    return errors.cycleCut || errors.cycleSupply || !user.cycleCut || !user.cycleSupply;
  }
  return false;
});

// -----------------------------------
// التنقل بين الخطوات
// -----------------------------------
function nextStep() {
  if (step.value === 4 && user.highBuildings === false) {
    step.value = 6;
  } else if (step.value === 7 && (errors.cycleCut || errors.cycleSupply || !user.cycleCut || !user.cycleSupply)) {
    return;
  } else if (step.value < 11) {
    step.value++;
  }
}

function prevStep() {
  if (step.value === 6 && user.highBuildings === false) {
    step.value = 4;
  } else if (step.value > 1) {
    step.value--;
  }
}

// -----------------------------------
// إرسال بيانات عبر واتساب
// -----------------------------------
function sendWhatsApp() {
  if (errors.phone) {
    alert(t('calculator.errors.phone'));
    return;
  }

  // 🔒 حماية إذا aiMsg فاضي أو undefined
  const summary = aiMsg.value?.trim() ? aiMsg.value : t('calculator.defaultSummary');

  let msg = `مرحبا، أحتاج خطة طاقة شمسية:\n
- نوع المنظومة: ${user.systemType}
- المحافظة: ${t(`calculator.iraqGovernorates.${user.governorate}`)}
- شمس جيدة: ${user.goodSunlight ? "نعم" : "لا"}
- مبانٍ عالية: ${user.highBuildings ? "نعم" : "لا"}
- الأولوية: ${user.priority}
- الأمبير/ساعة: ${user.ampHour}
- مدة القطع: ${user.cutDuration} ساعة
- ساعات التوفر: ${user.availableHours} ساعة
- فترة القطع: ${user.cutPeriod === 'day' ? 'نهار فقط' : user.cutPeriod === 'night' ? 'ليل فقط' : 'نهار وليل'}
- البطارية: ${user.battery}
- الإنفرتر: ${user.inverter}
- الألواح المقدرة: ${estimatedPanels.value}
- رقم الهاتف: ${user.phone}

${summary}`;

  // 🔍 Debug
  console.log("WHATSAPP MSG:", msg);

  window.open(`https://wa.me/009647800530333?text=${encodeURIComponent(msg)}`, "_blank");
}

// -----------------------------------
// إعادة تعيين الحاسبة
// -----------------------------------
function resetCalculator() {
  sessionStorage.removeItem("solarCalculatorProgress");
  Object.assign(user, {
    systemType: "",
    governorate: "",
    goodSunlight: null,
    highBuildings: null,
    priority: "",
    ampHour: "",
    cutDuration: "",
    availableHours: "",
    cutPeriod: "",
    hasSpace: null,
    panelArea: "",
    batteryOnlyHours: "",
    batteryOnlyAmp: "",
    battery: "",
    inverter: "",
    phone: ""
  });
  step.value = 1;
  aiMsg.value = t('calculator.aiStartMsg');
  resetCount.value++;
}
</script>

<template>
<section id="calculator" class="calculator">
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
      <div class="calculator-title-main">{{ t('calculator.title') }}</div>
      <div class="step-indicator">
        <span v-for="i in 11" :class="{ active: step === i }">{{ i }}</span>
        <button class="reset-btn" type="button" @click="resetCalculator">{{ t('calculator.reset') }}</button>
      </div>
      <form @submit.prevent="nextStep" class="sama-calc-form" autocomplete="off">
        <!-- الخطوة 1: نوع النظام -->
        <template v-if="step === 1">
          <div class="calc-radio-group">
            <label><input type="radio" v-model="user.systemType" value="منزل" required /> {{ t('calculator.home') }}</label>
            <label><input type="radio" v-model="user.systemType" value="شركة" required /> {{ t('calculator.company') }}</label>
          </div>
        </template>
        
        <!-- الخطوة 2: المحافظة -->
        <template v-else-if="step === 2">
          <div class="input-wrapper">
            <select class="calc-input" v-model="user.governorate" required>
              <option value="" disabled>{{ t('calculator.governoratePlaceholder') }}</option>
              <option v-for="key in governorateKeys" :key="key" :value="key">
                {{ t(`calculator.iraqGovernorates.${key}`) }}
              </option>
            </select>
            <label class="floating-label">{{ t('calculator.governorate') }}</label>
          </div>
        </template>
        
        <!-- الخطوة 3: أشعة الشمس -->
        <template v-else-if="step === 3">
          <div class="calc-radio-group">
            <label><input type="radio" v-model="user.goodSunlight" :value="true" required /> {{ t('calculator.yes') }}</label>
            <label><input type="radio" v-model="user.goodSunlight" :value="false" required /> {{ t('calculator.no') }}</label>
          </div>
        </template>
        
        <!-- الخطوة 4: المباني العالية -->
        <template v-else-if="step === 4">
          <div class="calc-radio-group">
            <label><input type="radio" v-model="user.highBuildings" :value="true" required /> {{ t('calculator.yes') }}</label>
            <label><input type="radio" v-model="user.highBuildings" :value="false" required /> {{ t('calculator.no') }}</label>
          </div>
        </template>
        
        <!-- الخطوة 5: الأولوية -->
        <template v-else-if="step === 5">
          <div class="calc-radio-group">
            <label><input type="radio" v-model="user.priority" value="توفير التكلفة" required /> {{ t('calculator.priorityCost') }}</label>
            <label><input type="radio" v-model="user.priority" value="الاعتمادية" required /> {{ t('calculator.priorityReliability') }}</label>
            <label><input type="radio" v-model="user.priority" value="طاقة عالية" required /> {{ t('calculator.priorityPower') }}</label>
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
            <label class="floating-label">{{ t('calculator.ampHour') }}</label>
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
              <label class="floating-label">{{ t('calculator.cycleCut') }}</label>
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
              <label class="floating-label">{{ t('calculator.cycleSupply') }}</label>
              <span v-if="errors.cycleSupply" class="error-tooltip">{{ errors.cycleSupply }}</span>
            </div>
          </div>
        </template>
        
        <!-- الخطوة 8: فترة القطع -->
        <template v-else-if="step === 8">
          <div class="calc-radio-group">
            <label><input type="radio" v-model="user.cutPeriod" value="day" required /> {{ t('calculator.cutPeriodDay') }}</label>
            <label><input type="radio" v-model="user.cutPeriod" value="night" required /> {{ t('calculator.cutPeriodNight') }}</label>
            <label><input type="radio" v-model="user.cutPeriod" value="day_night" required /> {{ t('calculator.cutPeriodDayNight') }}</label>
          </div>
        </template>
        
        <!-- الخطوة 9: البطارية -->
        <template v-else-if="step === 9">
          <div class="input-wrapper">
            <select class="calc-input" v-model="user.battery" required>
              <option value="" disabled>{{ t('calculator.batteryPlaceholder') }}</option>
              <optgroup v-for="group in filteredBatteryOptions" :label="group.group">
                <option v-for="item in group.items" :value="item">{{ item }}</option>
              </optgroup>
            </select>
            <label class="floating-label">{{ t('calculator.batteryLabel') }}</label>
          </div>
        </template>
        
        <!-- الخطوة 10: الإنفرتر -->
        <template v-else-if="step === 10">
          <div class="input-wrapper">
            <select class="calc-input" v-model="user.inverter" required>
              <option value="" disabled>{{ t('calculator.inverterPlaceholder') }}</option>
              <option v-for="option in inverterOptions" :value="option">{{ option }}</option>
            </select>
            <label class="floating-label">{{ t('calculator.inverterLabel') }}</label>
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
              <label class="floating-label">{{ t('calculator.phone') }}</label>
              <span v-if="errors.phone" class="error-tooltip">{{ errors.phone }}</span>
            </div>
            <button
              class="calc-btn whatsapp-btn"
              type="button"
              @click="sendWhatsApp"
              :disabled="!!errors.phone"
              :title="errors.phone ? t('calculator.fixErrors') : ''"
            >
              {{ t('calculator.submit') }}
            </button>
          </div>
        </template>
        
        <!-- أزرار التنقل -->
        <div class="button-group">
          <button
            v-if="step < 11"
            class="calc-btn"
            type="button"
            @click="nextStep"
            :disabled="Boolean(isNextDisabled)"
            :title="isNextDisabled ? t('calculator.fixErrors') : ''"
          >
            {{ t('calculator.next') }}
          </button>
          <button
            v-if="step > 1"
            class="calc-btn-secondary"
            type="button"
            @click="prevStep"
          >
            {{ t('calculator.back') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</section>
</template>

<style scoped>
/* التصميم العام */
.calculator {
  font-family: 'Tajawal', sans-serif;
  direction: rtl;
  overflow-x: hidden;
  padding: 20px 0;
  background: #f8f9fa;
}

/* الشريط الأخضر */
.calculator-bar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  gap: 10px;
  background: linear-gradient(135deg,rgb(117, 246, 121) 0%,rgb(18, 21, 70) 100%);
  padding: 8px 10px;
  border-radius: 12px;
  margin: 10px auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 120px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: height 0.3s ease;
  overflow: hidden;
  max-width: 1200px;
}

/* عمود الذكاء الاصطناعي */
.ai-column {
  flex: 1 1 40%;
  display: flex;
  align-items: stretch;
}

.sama-ai-box-ai {
  background: rgba(255, 255, 255, 0.95);
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(76, 175, 80, 0.15);
  font-size: 0.8rem;
  color: #1e3212;
  font-weight: 500;
  text-align: right;
  padding: 8px 10px;
  line-height: 1.5;
  overflow-y: auto;
  white-space: pre-wrap;
  position: relative;
  z-index: 1;
}

.sama-ai-box-ai::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  background: linear-gradient(135deg, rgba(233, 246, 151, 0.53), rgba(46, 125, 50, 0.1));
  z-index: -1;
  border-radius: 11px;
}

.ai-spinner {
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.ai-spinner span {
  font-size: 1.2rem;
  color: #2E7D32;
  animation: blink 1.2s infinite both;
}

@keyframes blink {
  0% { opacity: 0.3; }
  20% { opacity: 1; }
  100% { opacity: 0.3; }
}

/* العمود الرئيسي للحاسبة */
.calculator-main-col {
  flex: 2 1 55%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}

.calculator-title-main {
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* مؤشر الخطوات */
.step-indicator {
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.step-indicator span {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.step-indicator span.active {
  background: #ffffff;
  color: #2E7D32;
  transform: scale(1.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

/* نموذج الحاسبة */
.sama-calc-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  width: 100%;
  overflow: hidden;
}

/* مجموعات الراديو */
.calc-radio-group {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.calc-radio-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #ffffff;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
}

.calc-radio-group label:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.calc-radio-group input[type="radio"] {
  appearance: none;
  width: 14px;
  height: 14px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
}

.calc-radio-group input[type="radio"]:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: #ffffff;
  border-radius: 50%;
}

/* حقول الإدخال */
.input-wrapper {
  position: relative;
  width: 100%;
  max-width: 140px;
}

.calc-input, select.calc-input {
  width: 100%;
  height: 30px;
  border-radius: 8px;
  font-size: 0.8rem;
  text-align: right;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: #ffffff;
  padding: 10px 8px 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 500;
  transition: all 0.2s ease;
  outline: none;
  overflow: hidden;
  text-overflow: ellipsis;
}

.calc-input:focus, select.calc-input:focus {
  border-color: #2E7D32;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.calc-input.error {
  border-color: #c62828;
  background: rgba(255, 235, 238, 0.1);
}

select.calc-input {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232e7d32' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: left 8px center;
  background-size: 14px;
  padding-left: 28px;
  padding-right: 8px;
}

.floating-label {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  color: #999;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 16px);
}

.calc-input:focus + .floating-label,
.calc-input:not(:placeholder-shown) + .floating-label,
select.calc-input:not([value=""]) + .floating-label {
  top: 4px;
  font-size: 0.6rem;
  color: #2E7D32;
}

/* رسائل الخطأ */
.error-tooltip {
  position: absolute;
  top: 100%;
  right: 0;
  background: #ffebee;
  color: #c62828;
  font-size: 0.7rem;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.error-tooltip::before {
  content: '⚠';
  margin-left: 4px;
  font-size: 0.65rem;
}

/* مجموعة إدخال جدول الانقطاع */
.schedule-group {
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
}

/* مجموعة الأزرار */
.button-group {
  display: flex;
  flex-direction: row;
  gap: 6px;
  margin-top: 4px;
  justify-content: center;
  flex-wrap: wrap;
}

.calc-btn, .calc-btn-secondary, .reset-btn, .whatsapp-btn {
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 14px;
  border: none;
  height: 30px;
  min-width: 75px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  z-index: 1;
  white-space: nowrap;
}

.calc-btn::after, .calc-btn-secondary::after, .reset-btn::after, .whatsapp-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: -1;
}

.calc-btn:hover::after, .calc-btn-secondary:hover::after, .reset-btn:hover::after, .whatsapp-btn:hover::after {
  transform: translateX(0);
}

.calc-btn {
  background: #2E7D32;
  color: #ffffff;
}

.calc-btn:hover {
  background: #4CAF50;
  transform: translateY(-1px);
}

.calc-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #666;
}

.calc-btn-secondary {
  background: #FFC107;
  color: #333;
}

.calc-btn-secondary:hover {
  background: #FFB300;
  transform: translateY(-1px);
}

.whatsapp-btn {
  background: linear-gradient(90deg, #25D366, #128C7E);
}

.whatsapp-btn:hover {
  background: linear-gradient(90deg, #2CEB7B, #1AA67A);
  transform: translateY(-1px);
}

.whatsapp-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #666;
}

.reset-btn {
  background: #e53935;
  color: #ffffff;
  min-width: 60px;
  font-size: 0.75rem;
}

.reset-btn:hover {
  background: #c62828;
  transform: translateY(-1px);
}

/* قسم التكلفة */
.cost-section { 
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  width: 100%;
  overflow: hidden;
}

/* تحسينات للجوال */
@media (max-width: 991px) {
  .calculator-bar {
    flex-direction: column;
    height: auto;
    min-height: 100px;
    padding: 6px;
  }

  .ai-column, .calculator-main-col {
    width: 100%;
  }

  .sama-ai-box-ai {
    min-height: 80px;
    font-size: 0.75rem;
    padding: 6px 8px;
  }

  .calculator-title-main {
    font-size: 1.1rem;
    margin-bottom: 3px;
  }

  .step-indicator {
    gap: 3px;
    margin-bottom: 3px;
  }

  .step-indicator span {
    width: 18px;
    height: 18px;
    font-size: 0.7rem;
  }

  .input-wrapper {
    max-width: 120px;
  }

  .calc-input, select.calc-input {
    height: 28px;
    font-size: 0.75rem;
  }

  .floating-label {
    font-size: 0.7rem;
  }

  .calc-input:focus + .floating-label,
  .calc-input:not(:placeholder-shown) + .floating-label,
  select.calc-input:not([value=""]) + .floating-label {
    top: 3px;
    font-size: 0.55rem;
  }

  .error-tooltip {
    font-size: 0.65rem;
    max-width: 120px;
  }

  .schedule-group {
    flex-direction: column;
    gap: 6px;
  }

  .calc-radio-group {
    gap: 6px;
  }

  .calc-radio-group label {
    padding: 5px 10px;
    font-size: 0.8rem;
  }

  .button-group {
    gap: 4px;
  }

  .calc-btn, .calc-btn-secondary, .reset-btn, .whatsapp-btn {
    height: 28px;
    min-width: 70px;
    font-size: 0.75rem;
  }

  .reset-btn {
    min-width: 55px;
  }

  .cost-section {
    flex-direction: column;
    gap: 6px;
  }
}

@media (max-width: 576px) {
  .calculator-bar {
    padding: 5px;
  }

  .sama-calc-form {
    gap: 5px;
  }

  .input-wrapper {
    max-width: 100px;
  }

  .calc-input, select.calc-input {
    height: 26px;
    font-size: 0.7rem;
  }

  .floating-label {
    font-size: 0.65rem;
  }

  .button-group {
    flex-direction: column;
    gap: 3px;
  }

  .calc-btn, .calc-btn-secondary, .reset-btn, .whatsapp-btn {
    min-width: 100%;
    height: 26px;
  }
}
</style>