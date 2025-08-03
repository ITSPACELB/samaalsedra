import { safeTranslate } from './utils';
import { getBatteryOptions, getInverterOptions } from './data';
import { generateDynamicMessages } from './messages';

// 🔋 حساب البطارية (اعتمادية فقط)
export function calculateBatterySize(user: any, t: Function): number {
  const ampHour = parseFloat(user.ampHour) || 0;
  const cutHours = parseFloat(user.cycleCut) || 0;

  // الطاقة الليلية المطلوبة (واط)
  const energyRequired = ampHour * 220 * cutHours;

  // حجم البطارية مع مراعاة DoD والكفاءة
  const batterySize = energyRequired / (0.85 * 0.90);

  return Math.ceil(batterySize);
}

export function generateReport(user: any, t: Function, governorateSunlight: any): string {
  const ampHour = Math.max(1, parseFloat(user.ampHour) || 0);
  const cycleCut = Math.max(1, parseFloat(user.cycleCut) || 0);
  const cycleSupply = Math.max(1, parseFloat(user.cycleSupply) || 0);
  const cutPeriod = user.cutPeriod || "day_night";
  const systemType = user.systemType || 'منزل';

  const panelTypes = [
    { name: safeTranslate(t, 'calculator.panel.etel', 'Etel'), watt: 610, area: 2.45 },
    { name: safeTranslate(t, 'calculator.panel.risen', 'Risen'), watt: 705, area: 3.09 }
  ];

  const inverterUser = parseFloat(user.inverter?.match(/(\d+(\.\d+)?)/)?.[0] || "0");
  const batteryUser = parseFloat(user.battery?.match(/(\d+(\.\d+)?)/)?.[0] || "0");

  const baseSunlight = governorateSunlight[user.governorate as keyof typeof governorateSunlight] || 5.5;
  const sunlightFactor = user.goodSunlight ? (user.highBuildings ? 0.9 : 1.0) : (user.highBuildings ? 0.8 : 0.85);
  const sunlightHours = Math.max(3.5, baseSunlight * sunlightFactor);

  const panelEfficiencyLoss = user.goodSunlight ? (user.highBuildings ? 0.88 : 0.9) : 0.85;
  const batteryDoD = 0.85;
  const batteryEfficiencyLoss = 0.90;

  // توزيع الانقطاع بين النهار والليل
  const distributeDayNight = (cutH: number, suppH: number, cycles: number) => {
    if (cutPeriod === "day") return { dayCut: cutH * cycles, nightCut: 0 };
    if (cutPeriod === "night") return { dayCut: 0, nightCut: cutH * cycles };
    let dayCut = 0, nightCut = 0, t = 6;
    for (let i = 0; i < cycles; i++) {
      const cutStart = t;
      const cutEnd = t + cutH;
      const dayOverlap = Math.max(0, Math.min(cutEnd, 18) - Math.max(cutStart, 6));
      const nightOverlap = cutH - dayOverlap;
      dayCut += dayOverlap;
      nightCut += nightOverlap;
      t = (t + cutH + suppH) % 24;
    }
    return { dayCut: +dayCut.toFixed(1), nightCut: +nightCut.toFixed(1) };
  };

  const cyclesPerDay = Math.floor(24 / (cycleCut + cycleSupply));
  const { dayCut, nightCut } = distributeDayNight(cycleCut, cycleSupply, cyclesPerDay);

  const voltage = 220;
  const dayLoadWatt = Math.round(ampHour * voltage * dayCut);
  const nightLoadWatt = Math.round(ampHour * voltage * nightCut);
  const totalConsumptionWatt = dayLoadWatt + nightLoadWatt;

  const availableBatteries = getBatteryOptions(t)
    .flatMap(group => group.items.map(item => parseFloat(item.match(/(\d+(\.\d+)?)/)?.[0] || "0")))
    .sort((a, b) => b - a);

// 🛠️ اختيار البطارية  
function selectBattery(
  ampHour: number,
  voltage: number,
  nightCut: number,
  batteryDoD: number,
  batteryEfficiencyLoss: number,
  availableBatteries: number[]
) {
  let mainBattery: number = 0;
  let backupBatteries: number[] = [];
  let totalBattery: number = 0;
  let backupBattery: number | null = null;

  // الحاجة الليلية (ك.و.س)
  const baseNightEnergy = ((ampHour * voltage * nightCut) / 1000) / (batteryDoD * batteryEfficiencyLoss);

  // (أ) اختيار بطارية مثالية ±5%
  const singleIdeal = availableBatteries.find(b => b >= baseNightEnergy * 0.95 && b <= baseNightEnergy * 1.05);
  if (singleIdeal) return { baseNightEnergy, mainBattery: singleIdeal, backupBatteries: [], totalBattery: singleIdeal, backupBattery: null };

  // (ب) اختيار بطارية واحدة أكبر تغطي الحاجة
  const biggerSingle = availableBatteries.filter(b => b >= baseNightEnergy).sort((a, b) => a - b)[0];
  if (biggerSingle) return { baseNightEnergy, mainBattery: biggerSingle, backupBatteries: [], totalBattery: biggerSingle, backupBattery: null };

  // ✅ (جديد) اختيار بطارية قريبة تغطي ≥70% من الحاجة (حتى لو أقل منها)
  const closeEnoughSingle = availableBatteries
    .filter(b => b >= baseNightEnergy * 0.7 && b < baseNightEnergy)
    .sort((a, b) => b - a)[0]; // نختار الأكبر بينها
  if (closeEnoughSingle) {
    return { baseNightEnergy, mainBattery: closeEnoughSingle, backupBatteries: [], totalBattery: closeEnoughSingle, backupBattery: null };
  }

  // (د) التركيبات (بطاريات متساوية فقط)
  type Combo = { main: number; backups: number[]; total: number; diff: number; count: number };
  const combos: Combo[] = [];
  for (const battery of availableBatteries) {
    for (let count = 2; count <= 4; count++) {
      const total = battery * count;

      // منع أي تركيبة تساوي بطارية واحدة موجودة ±2%
      const matchSingle = availableBatteries.some(b => Math.abs(b - total) <= b * 0.02);
      if (matchSingle) continue;

      combos.push({
        main: battery,
        backups: Array(count - 1).fill(battery),
        total,
        diff: Math.abs(total - baseNightEnergy),
        count
      });
    }
  }

  let validCombos = combos.filter(c => c.total >= baseNightEnergy * 0.90 && c.total <= baseNightEnergy * 1.10);
  if (validCombos.length === 0) validCombos = combos.sort((a, b) => a.diff - b.diff);

  const best = validCombos.sort((a, b) => {
    if (a.diff !== b.diff) return a.diff - b.diff;
    if (a.count !== b.count) return a.count - b.count;
    return b.main - a.main;
  })[0];

  mainBattery = best.main;
  backupBatteries = best.backups;
  totalBattery = best.total;
  backupBattery = backupBatteries.length > 0 ? mainBattery : null;

  return { baseNightEnergy, mainBattery, backupBatteries, totalBattery, backupBattery };
}

const { baseNightEnergy, mainBattery, backupBatteries, totalBattery, backupBattery } =
  selectBattery(ampHour, voltage, nightCut, batteryDoD, batteryEfficiencyLoss, availableBatteries);

// ☀️ حساب الألواح
const coverageFactor = 0.82; // ثابت (اعتمادية)
let selectedPanel = (totalConsumptionWatt > 10000 || sunlightHours < 4) ? panelTypes[1] : panelTypes[0];

const requiredPanelEnergy = (totalConsumptionWatt / 1000) * coverageFactor;
let optimalPanels = Math.ceil(
  requiredPanelEnergy / ((selectedPanel.watt / 1000) * sunlightHours * panelEfficiencyLoss * 0.8)
);
let totalPanelArea = +(optimalPanels * selectedPanel.area).toFixed(2);
let panelDailyOutput = ((selectedPanel.watt * optimalPanels * sunlightHours * panelEfficiencyLoss * 0.8) / 1000);
let actualCoverage = (panelDailyOutput / (totalConsumptionWatt / 1000)) * 100;

// 🔌 حساب الإنفرتر بعد الألواح
const peakLoadKW = (ampHour * voltage) / 1000;               // الحمل اللحظي من الأمبير
const batteryFactor = mainBattery / 10;                      // تأثير حجم البطارية
const panelFactor = (optimalPanels * selectedPanel.watt) / 1000 / 10; // تأثير الألواح
const inverterMargin = 1.25;                                 // ثابت (اعتمادية)

// الإنفرتر المثالي
const optimalInverter = Math.ceil(((peakLoadKW + batteryFactor + panelFactor) * inverterMargin) * 10) / 10;

// اختيار الإنفرتر الأقرب من الخيارات
const availableInverters = getInverterOptions(t).map(option =>
  parseFloat(option.match(/(\d+(\.\d+)?)/)?.[0] || "0")
);

const suggestedInverter = availableInverters.reduce((closest, b) => {
  const diff = Math.abs(b - optimalInverter);
  return closest === null || diff < Math.abs(closest - optimalInverter) ? b : closest;
}, null as number | null) || availableInverters[0];

const inverterCoverage = inverterUser ? Math.min((inverterUser / optimalInverter) * 100, 100) : 0;

  // 📝 الرسائل الديناميكية
const dynamicNotes = generateDynamicMessages({
  t,
  mainBattery,
  backupBattery,
  nightEnergy: baseNightEnergy,
  totalPanelArea,
  priority: user.priority, // ✅ مهم جدًا كرمال الرسائل التسويقية
  goodSunlight: user.goodSunlight,
  highBuildings: user.highBuildings,
  panelName: selectedPanel.name,
  sunlightHours,
  ampHour,
  dayLoadWatt,
  nightLoadWatt,
  coverageFactor,
  panelDailyOutput: +panelDailyOutput.toFixed(1),
  actualCoverage,
  batteryUser,
  inverterUser,
  optimalInverter,
  inverterCoverage
});

  // 📝 التقرير النهائي
// 📝 التقرير النهائي
let report = `🔆 **${safeTranslate(t, 'calculator.planTitle', 'التصميم المقترح لنظام الطاقة الشمسية')}**\n\n`;
report += `**🔎 ${safeTranslate(t, 'calculator.inputData', 'بياناتك المدخلة')}:**\n`;
report += `• ${safeTranslate(t, 'calculator.cutType', 'نوع الانقطاع')}: ${cutPeriod === 'day' ? 'نهاري' : cutPeriod === 'night' ? 'ليلي' : 'مختلط'}\n`;
report += `• ${safeTranslate(t, 'calculator.governorate', 'المحافظة')}: ${safeTranslate(t, 'calculator.iraqGovernorates.' + user.governorate, user.governorate)} (${sunlightHours.toFixed(1)} س شمس)\n`;
report += `• ${safeTranslate(t, 'calculator.sunQuality', 'جودة الإشعاع')}: ${user.goodSunlight ? 'جيدة' : 'ضعيفة'}\n`;
report += `• ${safeTranslate(t, 'calculator.obstacles', 'عوائق')}: ${user.highBuildings ? 'نعم' : 'لا'}\n`;
report += `• ${safeTranslate(t, 'calculator.battery', 'بطاريتك المختارة')}: ${batteryUser || '-'} ك.و.س\n`;
report += `• ${safeTranslate(t, 'calculator.inverter', 'إنفرترك المختار')}: ${inverterUser || '-'} ك.و\n\n`;

report += `**🛠️ ${safeTranslate(t, 'calculator.components', 'مكوّنات النظام المقترح')}:**\n`;
report += `• ${safeTranslate(t, 'calculator.battery', 'البطارية')}: **${backupBattery ? `${mainBattery} ك.و.س + ${backupBattery} ك.و.س احتياطية` : `${mainBattery} ك.و.س`}**\n`;
report += `• ${safeTranslate(t, 'calculator.inverter', 'الإنفرتر')}: **${suggestedInverter} ك.و**\n`;
report += `• ${safeTranslate(t, 'calculator.panels', 'الألواح')}: **${optimalPanels} × ${selectedPanel.watt} واط (${selectedPanel.name})**\n`;
report += `• ${safeTranslate(t, 'calculator.area', 'المساحة المطلوبة')}: **${totalPanelArea} م²**\n\n`;

// 📝 الملاحظات
if (dynamicNotes.length > 0) {
  const userRelated = dynamicNotes.filter(note =>
    note.includes('بطاريتك') || note.includes('إنفرترك') || note.includes('priority')
  );
  const systemRelated = dynamicNotes.filter(note =>
    !note.includes('بطاريتك') && !note.includes('إنفرترك') && !note.includes('priority')
  );

  report += `**📝 ${safeTranslate(t, 'calculator.notesTitle', 'ملاحظات')}:**\n`;
  if (userRelated.length > 0) report += `${userRelated.join('\n')}\n`;
  if (systemRelated.length > 0) report += `${systemRelated.join('\n')}\n`;
  report += `\n`;
}

report += `🟢 ${safeTranslate(t, 'calculator.cta', 'هذه النتائج أولية. فريقنا التقني قادر على تحسين التصميم وخفض التكاليف. تواصل معنا: 009647749992888')}\n\n`;
report += `— ${safeTranslate(t, 'calculator.footer', 'مع تحيات فريق سما السدرة')} —`;

  return report;
}
