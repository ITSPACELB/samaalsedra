<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { PhArrowUpRight } from "@phosphor-icons/vue";
import { nextTick } from 'vue';

// دالة مساعدة للتعامل مع مفاتيح الترجمة المفقودة
function safeTranslate(t: Function, key: string, fallback: string): string {
  try {
    const result = t(key);
    return result !== key ? result : fallback;
  } catch (e) {
    console.error(`Translation error for key "${key}":`, e);
    return fallback;
  }
}

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
  cutDuration: "",
  availableHours: "",
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
    { group: safeTranslate(t, 'calculator.chisag', 'Chisag'), items: [
        safeTranslate(t, 'calculator.battery.chisag5', 'Chisag 5 kWh'),
        safeTranslate(t, 'calculator.battery.chisag8', 'Chisag 8 kWh'),
        safeTranslate(t, 'calculator.battery.chisag10', 'Chisag 10 kWh'),
        safeTranslate(t, 'calculator.battery.chisag16', 'Chisag 16 kWh')
      ] },
    { group: safeTranslate(t, 'calculator.etel', 'Etel'), items: [
        safeTranslate(t, 'calculator.battery.etel2_5', 'Etel 2.5 kWh'),
        safeTranslate(t, 'calculator.battery.etel5_12', 'Etel 5-12 kWh'),
        safeTranslate(t, 'calculator.battery.etel10', 'Etel 10 kWh'),
        safeTranslate(t, 'calculator.battery.etel14_33', 'Etel 14.33 kWh')
      ] },
    { group: safeTranslate(t, 'calculator.cospower', 'Cospower'), items: [
        safeTranslate(t, 'calculator.battery.cospower2_5', 'Cospower 2.5 kWh'),
        safeTranslate(t, 'calculator.battery.cospower5_12', 'Cospower 5-12 kWh'),
        safeTranslate(t, 'calculator.battery.cospower10', 'Cospower 10 kWh'),
        safeTranslate(t, 'calculator.battery.cospower14_3', 'Cospower 14.3 kWh'),
        safeTranslate(t, 'calculator.battery.cospower16', 'Cospower 16 kWh')
      ] },
    { group: safeTranslate(t, 'calculator.sofar', 'Sofar'), items: [
        safeTranslate(t, 'calculator.battery.sofar5', 'Sofar 5 kWh')
      ] },
    { group: safeTranslate(t, 'calculator.dynes', 'Dynes'), items: [
        safeTranslate(t, 'calculator.battery.dynes5', 'Dynes 5 kWh'),
        safeTranslate(t, 'calculator.battery.dynes10', 'Dynes 10 kWh'),
        safeTranslate(t, 'calculator.battery.dynes14_36', 'Dynes 14.36 kWh')
      ] }
  ];
});

const inverterOptions = computed(() => {
  return [
    safeTranslate(t, 'calculator.inverter.chisag6', 'Chisag 6 kW'),
    safeTranslate(t, 'calculator.inverter.chisag8', 'Chisag 8 kW'),
    safeTranslate(t, 'calculator.inverter.chisag10', 'Chisag 10 kW'),
    safeTranslate(t, 'calculator.inverter.chisag12', 'Chisag 12 kW'),
    safeTranslate(t, 'calculator.inverter.chisag14', 'Chisag 14 kW'),
    safeTranslate(t, 'calculator.inverter.etel4', 'Etel 4 kW'),
    safeTranslate(t, 'calculator.inverter.etel6', 'Etel 6 kW'),
    safeTranslate(t, 'calculator.inverter.etel12', 'Etel 12 kW'),
    safeTranslate(t, 'calculator.inverter.cospower4', 'Cospower 4 kW'),
    safeTranslate(t, 'calculator.inverter.cospower6', 'Cospower 6 kW'),
    safeTranslate(t, 'calculator.inverter.cospower12', 'Cospower 12 kW'),
    safeTranslate(t, 'calculator.inverter.sofar20', 'Sofar 20 kW')
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
const aiMsg = ref(safeTranslate(t, 'calculator.aiStartMsg', 'ابدأ باختيار نوع النظام'));

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
      warnings.push(safeTranslate(t, 'calculator.warnings.panels', 'عدد الألواح غير متطابق'));
    }
    if (batteryCapacity < inverterCapacity * 2) {
      warnings.push(safeTranslate(t, 'calculator.warnings.battery', 'سعة البطارية غير كافية'));
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
let lastStep: number | null = null;
let lastLocale: string | null = null;

watch([() => step.value, () => locale.value], async ([newStep, newLocale]) => {
  const stepChanged = newStep !== lastStep;
  const localeChanged = newLocale !== lastLocale;

  lastStep = newStep;
  lastLocale = newLocale;

  await nextTick();

  // إضافة تأخير لضمان تحديث واجهة المستخدم
  setTimeout(async () => {
    await nextTick();

    // دالة استبدال المتغيرات داخل النصوص المترجمة
    function replacePlaceholders(str: string, replacements: Record<string, string>) {
      try {
        return str.replace(/{{(\w+)}}/g, (_: string, key: string) => replacements[key] ?? '');
      } catch (e) {
        console.error('Error in replacePlaceholders:', e);
        return str;
      }
    }

    if (newStep === 11) {
      console.log('Step 11 triggered, generating report...');
      // المدخلات
      const ampHour = Math.max(1, parseFloat(user.ampHour) || 0);
      const cycleCut = Math.max(1, parseFloat(user.cycleCut) || 0);
      const cycleSupply = Math.max(1, parseFloat(user.cycleSupply) || 0);

      // بيانات الألواح
      const panelTypes = [
        { name: safeTranslate(t, 'calculator.panel.etel', 'Etel'), watt: 610, area: 2.45 },
        { name: safeTranslate(t, 'calculator.panel.risen', 'Risen'), watt: 705, area: 3.09 }
      ];
      const selectedPanel = panelTypes[0];
      const panelWatt = selectedPanel.watt;
      const panelArea = selectedPanel.area;
      const panelName = selectedPanel.name;

      // البطارية والإنفرتر
      const inverterUser = parseFloat(user.inverter?.match(/(\d+(\.\d+)?)/)?.[0] || "0");
      const batteryUser = parseFloat(user.battery?.match(/(\d+(\.\d+)?)/)?.[0] || "0");

      // فاقد الإشعاع والتظليل
      let sunlightHours = governorateSunlight[user.governorate as keyof typeof governorateSunlight] || 5.5;
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
        consumptionNote = safeTranslate(t, 'calculator.consumptionNote', 'ملاحظة: استهلاكك منخفض جدًا');
      }

      let batteryStatus = "";
      if (batteryUser && Math.abs(batteryUser - suggestedBattery) > 0.5) {
        batteryStatus = replacePlaceholders(safeTranslate(t, 'calculator.batteryStatus', 'البطارية المختارة ({{user}} كيلوواط ساعة) غير مثالية، الموصى بها: {{recommended}} كيلوواط ساعة ({{panelName}})'), {
          user: batteryUser.toString(),
          recommended: suggestedBattery.toString(),
          panelName
        });
      }

      let inverterStatus = "";
      if (inverterUser && Math.abs(inverterUser - suggestedInverter) > 0.2) {
        inverterStatus = replacePlaceholders(safeTranslate(t, 'calculator.inverterStatus', 'الإنفرتر المختار ({{user}} كيلوواط) غير مثالي، الموصى به: {{recommended}} كيلوواط'), {
          user: inverterUser.toString(),
          recommended: suggestedInverter.toString()
        });
      }

      let efficiencyNote = "";
      if (nightCut > 6 || sunlightHours < 4 || ampHour > 12) {
        efficiencyNote = safeTranslate(t, 'calculator.efficiencyNote', 'ملاحظة: الكفاءة قد تكون منخفضة بسبب ظروف الانقطاع أو الإشعاع');
      }

      let nightOnlyNote = "";
      if (dayCut === 0 && nightCut > 0) {
        nightOnlyNote = replacePlaceholders(safeTranslate(t, 'calculator.nightOnlyNote', 'النظام يعمل ليلًا فقط، البطارية المقترحة: {{suggestedBattery}} كيلوواط ساعة لتغطية {{nightLoad}} واط ساعة'), {
          suggestedBattery: suggestedBattery.toString(),
          nightLoad: nightLoadWatt.toString()
        });
      }

      let spaceNote = "";
      if (optimalPanels > 0) {
        spaceNote = replacePlaceholders(safeTranslate(t, 'calculator.spaceNote', "المساحة المطلوبة: {{area}} متر مربع لـ {{count}} لوح بقدرة {{watt}} واط ({{panelName}})"), {
          area: totalPanelArea.toString(),
          count: optimalPanels.toString(),
          watt: panelWatt.toString(),
          panelName
        });
      }

      let largeAreaNote = "";
      if (totalPanelArea > 20) {
        largeAreaNote = replacePlaceholders(safeTranslate(t, 'calculator.largeAreaNote', "المساحة المطلوبة كبيرة: {{area}} متر مربع"), {
          area: totalPanelArea.toString()
        });
      }

      const lossNote = safeTranslate(t, 'calculator.lossNote', 'ملاحظة: الحسابات تأخذ بعين الاعتبار فاقد الكفاءة');

      const scheduleNote = replacePlaceholders(safeTranslate(t, 'calculator.scheduleSummary', "جدول الانقطاع: مدة القطع {{cutDuration}} ساعة، ساعات التوفر {{availableHours}} ساعة، عدد الدورات يوميًا: {{cycles}}"), {
        cutDuration: cycleCut.toString(),
        availableHours: cycleSupply.toString(),
        cycles: cyclesPerDay.toString()
      });

      // توليد التقرير النهائي
      let details = `🔆 **${safeTranslate(t, 'calculator.planTitle', 'خطة الطاقة الشمسية')}**\n\n`;
      if (consumptionNote) details += `${consumptionNote}\n\n`;
      details += `**${safeTranslate(t, 'calculator.consumptionHeader', 'الاستهلاك')}**\n`;
      details += `${scheduleNote}\n`;
      details += `• ${safeTranslate(t, 'calculator.totalConsumption', 'إجمالي الاستهلاك')}: **${totalConsumptionWatt} ${safeTranslate(t, 'calculator.wattHour', 'واط ساعة')}** (${totalConsumptionAmp} ${safeTranslate(t, 'calculator.ampHour', 'أمبير ساعة')})\n`;
      details += `• ${safeTranslate(t, 'calculator.nightConsumption', 'الاستهلاك الليلي')}: **${nightLoadWatt} ${safeTranslate(t, 'calculator.wattHour', 'واط ساعة')}** (${nightLoadAmp} ${safeTranslate(t, 'calculator.ampHour', 'أمبير ساعة')} - ${Math.round(nightCut)} ${safeTranslate(t, 'calculator.hours', 'ساعات')})\n`;
      details += `• ${safeTranslate(t, 'calculator.dayConsumption', 'الاستهلاك النهاري')}: **${dayLoadWatt} ${safeTranslate(t, 'calculator.wattHour', 'واط ساعة')}** (${dayLoadAmp} ${safeTranslate(t, 'calculator.ampHour', 'أمبير ساعة')} - ${Math.round(dayCut)} ${safeTranslate(t, 'calculator.hours', 'ساعات')})\n\n`;
      details += `**${safeTranslate(t, 'calculator.systemComponents', 'مكونات النظام')}**\n`;
      details += `• ${safeTranslate(t, 'calculator.suggestedBattery', 'البطارية المقترحة')}: **${suggestedBattery} ${safeTranslate(t, 'calculator.kwh', 'كيلوواط ساعة')} (${panelName})**\n`;
      details += `• ${safeTranslate(t, 'calculator.suggestedInverter', 'الإنفرتر المقترح')}: **${suggestedInverter} ${safeTranslate(t, 'calculator.kw', 'كيلوواط')}**\n`;
      if (optimalPanels > 0) {
        details += `• ${safeTranslate(t, 'calculator.requiredPanels', 'الألواح المطلوبة')}: **${optimalPanels} × ${panelWatt} ${safeTranslate(t, 'calculator.watt', 'واط')} (${panelName})**\n`;
        details += `• ${safeTranslate(t, 'calculator.panelArea', 'مساحة الألواح')}: **${totalPanelArea} ${safeTranslate(t, 'calculator.squareMeter', 'متر مربع')}**\n`;
      }
      details += `\n${lossNote}\n`;
      if (batteryStatus || inverterStatus || efficiencyNote || nightOnlyNote || largeAreaNote) {
        details += `\n**${safeTranslate(t, 'calculator.warningsHeader', 'تحذيرات')}**\n`;
        if (batteryStatus) details += `${batteryStatus}\n`;
        if (inverterStatus) details += `${inverterStatus}\n`;
        if (efficiencyNote) details += `${efficiencyNote}\n`;
        if (nightOnlyNote) details += `${nightOnlyNote}\n`;
        if (largeAreaNote) details += `${largeAreaNote}\n`;
      }
      if (spaceNote) details += `\n${spaceNote}\n`;
      details += `\n🟢 ${safeTranslate(t, 'calculator.supportNote', 'للحصول على دعم إضافي، تواصلوا معنا')}`;
      details += `\n\n— ${safeTranslate(t, 'calculator.teamSignature', 'فريق سدرة')} —`;

      aiMsg.value = details;
      console.log('Step 11 report generated:', aiMsg.value);
    } else if (newStep >= 1 && newStep <= 10) {
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
        "calculator.questionInverter"
      ];
      aiMsg.value = safeTranslate(t, questionKeys[newStep - 1], `سؤال الخطوة ${newStep}`);
      if (newStep === 7) {
        if (errors.cycleCut || errors.cycleSupply) {
          aiMsg.value += `\n${safeTranslate(t, 'calculator.fixErrors', 'يرجى تصحيح الأخطاء')}`;
          if (errors.cycleCut) aiMsg.value += `\n- ${errors.cycleCut}`;
          if (errors.cycleSupply) aiMsg.value += `\n- ${errors.cycleSupply}`;
        } else if (user.cycleCut && user.cycleSupply) {
          aiMsg.value += `\n` + replacePlaceholders(safeTranslate(t, 'calculator.scheduleSummary', "جدول الانقطاع: مدة القطع {{cutDuration}} ساعة، ساعات التوفر {{availableHours}} ساعة، عدد الدورات يوميًا: {{cycles}}"), {
            cutDuration: user.cycleCut,
            availableHours: user.cycleSupply,
            cycles: Math.floor(24 / (parseFloat(user.cycleCut) + parseFloat(user.cycleSupply))).toString()
          });
        }
      }
    } else {
      aiMsg.value = safeTranslate(t, 'calculator.aiStartMsg', 'ابدأ باختيار نوع النظام');
    }
  }, 0);
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
  cutDuration: "",
  availableHours: ""
});

// تحقق فوري من ampHour
watch(() => user.ampHour, (val) => {
  nextTick(() => {
    errors.ampHour = validateNumeric(val, 1, 1000, safeTranslate(t, 'calculator.errors.ampHour', 'يجب أن يكون الأمبير/ساعة بين 1 و1000'));
  });
});

// تحقق من باقي القيم داخل user
watch(user, () => {
  errors.cycleCut = validateNumeric(user.cycleCut, 1, 24, safeTranslate(t, 'calculator.errors.cycleCut', 'يجب أن تكون مدة القطع بين 1 و24 ساعة'));
  errors.cycleSupply = validateNumeric(user.cycleSupply, 1, 24, safeTranslate(t, 'calculator.errors.cycleSupply', 'يجب أن تكون ساعات التوفر بين 1 و24 ساعة'));
  errors.phone = user.phone && !/^[0-9]{10,15}$/.test(user.phone) ? safeTranslate(t, 'calculator.errors.phone', 'رقم الهاتف غير صالح') : "";
});

// تحديث التحقق من cycleCut وcycleSupply
watch([() => user.cycleCut, () => user.cycleSupply], () => {
  errors.cycleCut = validateNumeric(user.cycleCut, 1, 24, safeTranslate(t, 'calculator.errors.cycleCut', 'يجب أن تكون مدة القطع بين 1 و24 ساعة'));
  errors.cycleSupply = validateNumeric(user.cycleSupply, 1, 24, safeTranslate(t, 'calculator.errors.cycleSupply', 'يجب أن تكون ساعات التوفر بين 1 و24 ساعة'));
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
    alert(safeTranslate(t, 'calculator.errors.phone', 'رقم الهاتف غير صالح'));
    return;
  }

  const summary = aiMsg.value?.trim() ? aiMsg.value : safeTranslate(t, 'calculator.defaultSummary', 'ملخص الخطة الشمسية');

  let msg = `مرحبا، أحتاج خطة طاقة شمسية:\n
- نوع المنظومة: ${user.systemType}
- المحافظة: ${safeTranslate(t, `calculator.iraqGovernorates.${user.governorate}`, user.governorate)}
- شمس جيدة: ${user.goodSunlight ? safeTranslate(t, 'calculator.yes', 'نعم') : safeTranslate(t, 'calculator.no', 'لا')}
- مبانٍ عالية: ${user.highBuildings ? safeTranslate(t, 'calculator.yes', 'نعم') : safeTranslate(t, 'calculator.no', 'لا')}
- الأولوية: ${user.priority}
- الأمبير/ساعة: ${user.ampHour}
- مدة القطع: ${user.cycleCut} ${safeTranslate(t, 'calculator.hours', 'ساعات')}
- ساعات التوفر: ${user.cycleSupply} ${safeTranslate(t, 'calculator.hours', 'ساعات')}
- فترة القطع: ${user.cutPeriod === 'day' ? safeTranslate(t, 'calculator.cutPeriodDay', 'نهار فقط') : user.cutPeriod === 'night' ? safeTranslate(t, 'calculator.cutPeriodNight', 'ليل فقط') : safeTranslate(t, 'calculator.cutPeriodDayNight', 'نهار وليل')}
- البطارية: ${user.battery}
- الإنفرتر: ${user.inverter}
- الألواح المقدرة: ${estimatedPanels.value}
- رقم الهاتف: ${user.phone}

${summary}`;

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
  aiMsg.value = safeTranslate(t, 'calculator.aiStartMsg', 'ابدأ باختيار نوع النظام');
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
      <div class="calculator-title-main">{{ safeTranslate(t, 'calculator.title', 'حاسبة الطاقة الشمسية') }}</div>
      <div class="step-indicator">
        <span v-for="i in 11" :class="{ active: step === i }">{{ i }}</span>
        <button class="reset-btn" type="button" @click="resetCalculator">{{ safeTranslate(t, 'calculator.reset', 'إعادة تعيين') }}</button>
      </div>
      <form @submit.prevent="nextStep" class="sama-calc-form" autocomplete="off">
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
              @click="sendWhatsApp"
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
            type="button"
            @click="nextStep"
            :disabled="Boolean(isNextDisabled)"
            :title="isNextDisabled ? safeTranslate(t, 'calculator.fixErrors', 'يرجى تصحيح الأخطاء') : ''"
          >
            {{ safeTranslate(t, 'calculator.next', 'التالي') }}
          </button>
          <button
            v-if="step > 1"
            class="calc-btn-secondary"
            type="button"
            @click="prevStep"
          >
            {{ safeTranslate(t, 'calculator.back', 'السابق') }}
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
  background: linear-gradient(135deg, rgb(117, 246, 121) 0%, rgb(18, 21, 70) 100%);
  padding: 8px 10px;
  border-radius: 12px;
  margin: 10px auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: auto;
  min-height: 120px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: height 0.3s ease;
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
  min-height: 100px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(76, 175, 80, 0.15);
  font-size: 0.85rem;
  color: #1e3212;
  font-weight: 500;
  text-align: right;
  padding: 10px 12px;
  line-height: 1.6;
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
  font-size: 1.3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  max-width: 100%;
}

/* مؤشر الخطوات */
.step-indicator {
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.step-indicator span {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 0.8rem;
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
  gap: 8px;
  align-items: center;
  width: 100%;
  overflow: hidden;
}

/* مجموعات الراديو */
.calc-radio-group {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.calc-radio-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #ffffff;
  font-size: 0.9rem;
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
  width: 16px;
  height: 16px;
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
  width: 10px;
  height: 10px;
  background: #ffffff;
  border-radius: 50%;
}

/* حقول الإدخال */
.input-wrapper {
  position: relative;
  width: 100%;
  max-width: 200px;
}

.calc-input, select.calc-input {
  width: 100%;
  height: 36px;
  border-radius: 8px;
  font-size: 0.75rem;
  text-align: right;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: #ffffff;
  padding: 12px 10px 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 500;
  transition: all 0.2s ease;
  outline: none;
  line-height: 1.2;
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
  background-position: left 10px center;
  background-size: 16px;
  padding-left: 30px;
  padding-right: 10px;
}

.floating-label {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #999;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 20px);
}

.calc-input:focus + .floating-label,
.calc-input:not(:placeholder-shown) + .floating-label,
select.calc-input:not([value=""]) + .floating-label {
  top: 6px;
  font-size: 0.65rem;
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
  max-width: 200px;
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
  gap: 10px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
}

/* مجموعة الأزرار */
.button-group {
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 6px;
  justify-content: center;
  flex-wrap: wrap;
}

.calc-btn, .calc-btn-secondary, .reset-btn, .whatsapp-btn {
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 8px 16px;
  border: none;
  height: 34px;
  min-width: 80px;
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
  min-width: 65px;
  font-size: 0.8rem;
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
  gap: 10px;
  width: 100%;
  overflow: hidden;
}

/* تحسينات للشاشات الكبيرة */
@media (min-width: 992px) {
  .calculator-bar {
    height: auto;
    min-height: 140px;
    padding: 12px 15px;
  }

  .sama-ai-box-ai {
    font-size: 0.9rem;
    padding: 12px 15px;
  }

  .calculator-title-main {
    font-size: 1.4rem;
    margin-bottom: 8px;
  }

  .step-indicator span {
    width: 24px;
    height: 24px;
    font-size: 0.85rem;
  }

  .input-wrapper {
    max-width: 220px;
  }

  .calc-input, select.calc-input {
    height: 38px;
    font-size: 0.8rem;
    padding: 12px 12px 6px;
  }

  .floating-label {
    font-size: 0.85rem;
  }

  .calc-input:focus + .floating-label,
  .calc-input:not(:placeholder-shown) + .floating-label,
  select.calc-input:not([value=""]) + .floating-label {
    top: 6px;
    font-size: 0.7rem;
  }

  .calc-radio-group label {
    font-size: 0.95rem;
    padding: 10px 16px;
  }

  .button-group {
    gap: 10px;
  }

  .calc-btn, .calc-btn-secondary, .whatsapp-btn {
    height: 36px;
    min-width: 90px;
    font-size: 0.9rem;
  }

  .reset-btn {
    min-width: 70px;
  }

  .cost-section {
    gap: 12px;
  }
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
    max-width: 160px;
  }

  .calc-input, select.calc-input {
    height: 32px;
    font-size: 0.7rem;
    padding: 10px 8px 4px;
  }

  .floating-label {
    font-size: 0.7rem;
  }

  .calc-input:focus + .floating-label,
  .calc-input:not(:placeholder-shown) + .floating-label,
  select.calc-input:not([value=""]) + .floating-label {
    top: 4px;
    font-size: 0.55rem;
  }

  .error-tooltip {
    font-size: 0.65rem;
    max-width: 160px;
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
    height: 30px;
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
    max-width: 140px;
  }

  .calc-input, select.calc-input {
    height: 30px;
    font-size: 0.65rem;
    padding: 10px 8px 4px;
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
    height: 28px;
  }
}
</style>