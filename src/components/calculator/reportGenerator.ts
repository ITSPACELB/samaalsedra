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
    .filter(b => b > 0)
    .sort((a, b) => b - a);

// 🛠️ اختيار البطارية (محسن جذرياً)
function selectBattery(
  ampHour: number,
  voltage: number,
  dayCut: number,
  nightCut: number,
  batteryDoD: number,
  batteryEfficiencyLoss: number,
  availableBatteries: number[]
): {
  baseEnergyNeeded: number,
  mainBattery: number,
  backupBatteries: number[],
  totalBattery: number,
  backupBattery: number | null
} {
  // === حساب الحاجة الدقيقة ===
  const loadWatt = ampHour * voltage;
  
  // حساب ساعات استخدام البطارية حسب نوع الانقطاع
  let batteryUsageHours = 0;
  
  if (cutPeriod === "night") {
    // انقطاع ليلي: البطارية تعمل كل الوقت
    batteryUsageHours = nightCut;
  } else if (cutPeriod === "day") {
    // انقطاع نهاري: بطارية صغيرة للطوارئ فقط
    batteryUsageHours = Math.min(2, dayCut * 0.1);
  } else {
    // انقطاع مختلط: البطارية للليل + جزء من النهار
    batteryUsageHours = nightCut + (dayCut * 0.15);
  }

  // الطاقة المطلوبة من البطارية (كيلو واط ساعة)
  const energyFromBattery = (loadWatt * batteryUsageHours) / 1000;
  
  // حجم البطارية مع الهوامش
  const safetyMargin = 1.05; // 5% هامش أمان
  const baseEnergyNeeded = (energyFromBattery * safetyMargin) / (batteryDoD * batteryEfficiencyLoss);

  // === التعامل مع الحالات الخاصة ===
  if (baseEnergyNeeded <= 0 || availableBatteries.length === 0) {
    return {
      baseEnergyNeeded: 0,
      mainBattery: 5,
      backupBatteries: [],
      totalBattery: 5,
      backupBattery: null
    };
  }

  // === استراتيجية 1: بطارية واحدة ===
  
  // بحث عن بطارية مثالية (90-110% من الحاجة)
  const idealBattery = availableBatteries.find(b => 
    b >= baseEnergyNeeded * 0.90 && b <= baseEnergyNeeded * 1.10
  );
  
  if (idealBattery) {
    return {
      baseEnergyNeeded,
      mainBattery: idealBattery,
      backupBatteries: [],
      totalBattery: idealBattery,
      backupBattery: null
    };
  }

  // بحث عن بطارية أكبر مناسبة
  const biggerBattery = availableBatteries
    .filter(b => b >= baseEnergyNeeded && b <= baseEnergyNeeded * 1.5)
    .sort((a, b) => a - b)[0];
    
  if (biggerBattery) {
    return {
      baseEnergyNeeded,
      mainBattery: biggerBattery,
      backupBatteries: [],
      totalBattery: biggerBattery,
      backupBattery: null
    };
  }

  // بحث عن بطارية أصغر قريبة (70-89% من الحاجة)
  const smallerBattery = availableBatteries
    .filter(b => b >= baseEnergyNeeded * 0.70 && b < baseEnergyNeeded * 0.90)
    .sort((a, b) => b - a)[0];
    
  if (smallerBattery) {
    return {
      baseEnergyNeeded,
      mainBattery: smallerBattery,
      backupBatteries: [],
      totalBattery: smallerBattery,
      backupBattery: null
    };
  }

  // === استراتيجية 2: تركيبات البطاريات ===
  
  const bestCombinations = [];
  
  // جرب كل بطارية مع أعداد مختلفة
  for (const battery of availableBatteries) {
    const theoreticalCount = baseEnergyNeeded / battery;
    const minCount = Math.max(2, Math.floor(theoreticalCount * 0.8));
    const maxCount = Math.min(8, Math.ceil(theoreticalCount * 1.3));
    
    for (let count = minCount; count <= maxCount; count++) {
      const totalCapacity = battery * count;
      const coverage = totalCapacity / baseEnergyNeeded;
      
      // تجنب التركيبات المشابهة للبطاريات المفردة
      const matchesSingle = availableBatteries.some(single => 
        Math.abs(single - totalCapacity) <= single * 0.05
      );
      if (matchesSingle) continue;
      
      // حساب جودة التركيبة
      let score = 0;
      
      // نقاط التغطية
      if (coverage >= 0.95 && coverage <= 1.10) score += 100;
      else if (coverage >= 0.85 && coverage <= 1.25) score += 80;
      else if (coverage >= 0.75 && coverage <= 1.40) score += 60;
      else if (coverage >= 0.60 && coverage <= 1.60) score += 40;
      else score += 20;
      
      // تفضيل العدد الأقل
      score -= (count - 2) * 5;
      
      // تفضيل البطاريات الكبيرة
      score += Math.min(battery, 15);
      
      // خصم للتغطية المفرطة
      if (coverage > 1.8) score -= 30;
      
      bestCombinations.push({
        battery,
        count,
        totalCapacity,
        coverage,
        score
      });
    }
  }

  // ترتيب التركيبات حسب الجودة
  bestCombinations.sort((a, b) => b.score - a.score);
  
  // فلترة التركيبات المقبولة
  const acceptableCombos = bestCombinations.filter(combo => 
    combo.coverage >= 0.60 && combo.coverage <= 2.0 && combo.score > 30
  );

  if (acceptableCombos.length > 0) {
    const best = acceptableCombos[0];
    const backupBatteries = Array(best.count - 1).fill(best.battery);
    
    return {
      baseEnergyNeeded,
      mainBattery: best.battery,
      backupBatteries,
      totalBattery: best.totalCapacity,
      backupBattery: backupBatteries.length > 0 ? best.battery : null
    };
  }

  // === الحل الأخير: أكبر بطارية متاحة ===
  const biggestBattery = availableBatteries[0];
  const requiredCount = Math.min(8, Math.ceil(baseEnergyNeeded / biggestBattery));
  
  if (requiredCount === 1) {
    return {
      baseEnergyNeeded,
      mainBattery: biggestBattery,
      backupBatteries: [],
      totalBattery: biggestBattery,
      backupBattery: null
    };
  } else {
    const backupBatteries = Array(requiredCount - 1).fill(biggestBattery);
    return {
      baseEnergyNeeded,
      mainBattery: biggestBattery,
      backupBatteries,
      totalBattery: biggestBattery * requiredCount,
      backupBattery: biggestBattery
    };
  }
}

const { baseEnergyNeeded: baseNightEnergy, mainBattery, backupBatteries, totalBattery, backupBattery } =
  selectBattery(ampHour, voltage, dayCut, nightCut, batteryDoD, batteryEfficiencyLoss, availableBatteries);

// ☀️ حساب الألواح (دقيق حسب نوع الانقطاع)
function calculateOptimalPanels(
  totalConsumptionWatt: number,
  dayCut: number,
  nightCut: number,
  cutPeriod: string,
  sunlightHours: number,
  panelEfficiencyLoss: number,
  panelTypes: Array<{name: string, watt: number, area: number}>
): {
  selectedPanel: {name: string, watt: number, area: number},
  optimalPanels: number,
  totalPanelArea: number,
  panelDailyOutput: number,
  actualCoverage: number,
  panelLogic: string
} {
  
  // === حساب الحاجة الفعلية للألواح حسب نوع الانقطاع ===
  
  let panelEnergyNeeded = 0;
  let calculationReason = "";
  
  if (cutPeriod === "day") {
    // انقطاع نهاري فقط: النهار منقطع، الليل متصل بالشبكة
    // الألواح تغذي الحمل النهاري + شحن بطارية طوارئ صغيرة
    const dayConsumptionFromPanels = (totalConsumptionWatt / 1000) * (dayCut / 24);
    const emergencyBatteryCharging = dayConsumptionFromPanels * 0.15; // 15% لبطارية الطوارئ
    
    panelEnergyNeeded = dayConsumptionFromPanels + emergencyBatteryCharging;
    calculationReason = "نهاري: تغذية الحمل أثناء الانقطاع النهاري + شحن طوارئ";
    
  } else if (cutPeriod === "night") {
    // انقطاع ليلي فقط: النهار متصل بالشبكة، الليل منقطع
    // لا حاجة للألواح لأن النهار متصل بالشبكة والبطارية تشحن من الشبكة
    panelEnergyNeeded = 0;
    calculationReason = "ليلي: لا حاجة للألواح - النهار متصل بالشبكة";
    
  } else {
    // انقطاع مختلط (day_night): انقطاع في النهار والليل
    // الألواح تغذي الحمل النهاري + تشحن البطارية للاستهلاك الليلي
    const dayConsumption = (totalConsumptionWatt / 1000) * (dayCut / 24);
    const nightConsumption = (totalConsumptionWatt / 1000) * (nightCut / 24);
    const chargingEfficiencyLoss = 1.35; // 35% فقدان في الشحن والتحويل
    
    panelEnergyNeeded = dayConsumption + (nightConsumption * chargingEfficiencyLoss);
    calculationReason = "مختلط: تغذية النهار + شحن البطارية للليل";
  }
  
  // === حالة خاصة: الانقطاع الليلي لا يحتاج ألواح ===
  if (panelEnergyNeeded === 0) {
    return {
      selectedPanel: panelTypes[0], // أصغر لوح للعرض
      optimalPanels: 0,
      totalPanelArea: 0,
      panelDailyOutput: 0,
      actualCoverage: 0,
      panelLogic: calculationReason
    };
  }
  
  // === اختيار نوع اللوح المناسب ===
  
  let selectedPanel = panelTypes[0]; // افتراضي: اللوح الأول
  
  // معايير اختيار اللوح
  const highEnergyThreshold = 15; // كيلو واط ساعة
  const lowSunlightThreshold = 4.5; // ساعات شمس
  const highConsumptionThreshold = 12000; // واط
  
  if (panelEnergyNeeded > highEnergyThreshold || 
      sunlightHours < lowSunlightThreshold || 
      totalConsumptionWatt > highConsumptionThreshold) {
    // استخدم اللوح الأكبر (عادة Risen)
    selectedPanel = panelTypes[1] || panelTypes[0];
  }
  
  // === حساب عدد الألواح المطلوب ===
  
  // الكفاءة الإجمالية للنظام
  const systemEfficiency = panelEfficiencyLoss * 0.85; // 85% كفاءة الإنفرتر والأسلاك
  
  // الطاقة المُولّدة من لوح واحد يومياً
  const singlePanelDailyOutput = (selectedPanel.watt / 1000) * sunlightHours * systemEfficiency;
  
  // عدد الألواح المطلوب
  let optimalPanels = Math.ceil(panelEnergyNeeded / singlePanelDailyOutput);
  
  // === تطبيق هوامش الأمان والتحسينات ===
  
  // هامش أمان للطقس السيء
  const weatherSafetyMargin = 1.15; // 15%
  
  // هامش إضافي للانقطاع المختلط
  const mixedCutMargin = cutPeriod === "day_night" ? 1.1 : 1.0;
  
  // هامش للمحافظات الأقل إشعاعاً
  const locationMargin = sunlightHours < 5 ? 1.1 : 1.0;
  
  optimalPanels = Math.ceil(optimalPanels * weatherSafetyMargin * mixedCutMargin * locationMargin);
  
  // === تحسين العدد للأعداد القياسية ===
  
  // تفضيل الأعداد الزوجية أو المضاعفات
  if (optimalPanels > 10) {
    const remainder = optimalPanels % 4;
    if (remainder !== 0) {
      optimalPanels += (4 - remainder); // تقريب لأقرب مضاعف 4
    }
  } else if (optimalPanels > 4) {
    const remainder = optimalPanels % 2;
    if (remainder !== 0) {
      optimalPanels += 1; // تقريب لعدد زوجي
    }
  }
  
  // === حساب النتائج النهائية ===
  
  const totalPanelArea = +(optimalPanels * selectedPanel.area).toFixed(2);
  const panelDailyOutput = optimalPanels * singlePanelDailyOutput;
  const actualCoverage = panelEnergyNeeded > 0 ? (panelDailyOutput / panelEnergyNeeded) * 100 : 0;
  
  return {
    selectedPanel,
    optimalPanels,
    totalPanelArea,
    panelDailyOutput: +panelDailyOutput.toFixed(1),
    actualCoverage: +actualCoverage.toFixed(1),
    panelLogic: calculationReason
  };
}

// تطبيق حساب الألواح المحسن
const panelCalculation = calculateOptimalPanels(
  totalConsumptionWatt,
  dayCut,
  nightCut,
  cutPeriod,
  sunlightHours,
  panelEfficiencyLoss,
  panelTypes
);

const selectedPanel = panelCalculation.selectedPanel;
const optimalPanels = panelCalculation.optimalPanels;
const totalPanelArea = panelCalculation.totalPanelArea;
const panelDailyOutput = panelCalculation.panelDailyOutput;
const actualCoverage = panelCalculation.actualCoverage;
const panelLogic = panelCalculation.panelLogic;

// 🔌 حساب الإنفرتر (محسن للأحمال الكبيرة)
function calculateOptimalInverter(
  ampHour: number,
  voltage: number,
  mainBattery: number,
  totalBatteryCapacity: number,
  totalPanelWatt: number,
  cutPeriod: string,
  availableInverters: number[]
): { 
  optimalInverter: number, 
  suggestedInverters: { single: number, parallel: { count: number, each: number, total: number } },
  inverterLogic: string 
} {
  
  // === حساب الأحمال بدقة عالية ===
  
  // 1. الحمل الأساسي المستمر
  const baseLoadKW = (ampHour * voltage) / 1000;
  
  // 2. حمل بدء التشغيل للأجهزة الكبيرة
  // للأحمال فوق 15 كيلو واط نحتاج هامش أكبر
  const surgeFactor = baseLoadKW > 15 ? 2.8 : baseLoadKW > 10 ? 2.3 : 1.8;
  const startupSurgeKW = baseLoadKW * surgeFactor;
  
  // 3. شحن البطارية السريع
  const maxChargingRate = Math.min(
    totalBatteryCapacity * 0.15,  // 15% من إجمالي البطاريات
    baseLoadKW * 0.8,             // 80% من الحمل الأساسي
    50                            // حد أقصى 50 كيلو واط للشحن
  );
  
  // 4. تحويل قدرة الألواح الكاملة
  const panelConversionKW = totalPanelWatt / 1000;
  
  // === حساب الحاجة حسب نوع الانقطاع ===
  
  let requiredInverterKW = 0;
  let calculationDetails = "";
  
  if (cutPeriod === "day") {
    // انقطاع نهاري: تشغيل الحمل + شحن البطارية + تحويل الألواح
    requiredInverterKW = Math.max(
      startupSurgeKW,
      baseLoadKW + maxChargingRate,
      panelConversionKW * 0.85
    );
    calculationDetails = `نهاري: بدء التشغيل=${startupSurgeKW.toFixed(1)} أو حمل+شحن=${(baseLoadKW + maxChargingRate).toFixed(1)} أو ألواح=${(panelConversionKW * 0.85).toFixed(1)}`;
    
  } else if (cutPeriod === "night") {
    // انقطاع ليلي: تشغيل الحمل من البطارية فقط
    requiredInverterKW = Math.max(
      startupSurgeKW,
      baseLoadKW * 1.25  // هامش 25% للاستقرار
    );
    calculationDetails = `ليلي: بدء التشغيل=${startupSurgeKW.toFixed(1)} أو حمل مع هامش=${(baseLoadKW * 1.25).toFixed(1)}`;
    
  } else {
    // انقطاع مختلط: أقصى حاجة في جميع الحالات
    const scenarios = [
      startupSurgeKW,                           // بدء التشغيل
      baseLoadKW + maxChargingRate,             // الحمل + شحن سريع
      panelConversionKW * 0.8,                  // 80% من الألواح
      baseLoadKW * 1.4                          // الحمل + هامش 40%
    ];
    requiredInverterKW = Math.max(...scenarios);
    calculationDetails = `مختلط: أقصى من [بدء=${startupSurgeKW.toFixed(1)}, حمل+شحن=${(baseLoadKW + maxChargingRate).toFixed(1)}, ألواح=${(panelConversionKW * 0.8).toFixed(1)}, حمل+هامش=${(baseLoadKW * 1.4).toFixed(1)}]`;
  }
  
  // === تطبيق هوامش الأمان النهائية ===
  
  // هامش أمان أساسي
  const basicSafetyMargin = 1.15; // 15%
  
  // هامش إضافي للأحمال الكبيرة جداً
  const heavyLoadMargin = baseLoadKW > 20 ? 1.1 : baseLoadKW > 15 ? 1.05 : 1.0;
  
  // هامش كفاءة الإنفرتر عند الأحمال العالية
  const efficiencyMargin = 1.08; // 8%
  
  const optimalInverter = requiredInverterKW * basicSafetyMargin * heavyLoadMargin * efficiencyMargin;
  
  // === اختيار الإنفرتر/الإنفرترات (محسن جذرياً) ===
  
  // تصفية وترتيب الإنفرترات المتاحة
  const validInverters = availableInverters
    .filter(inv => inv > 0)
    .sort((a, b) => a - b); // ترتيب تصاعدي
  
  // في حالة عدم وجود إنفرترات متاحة
  if (validInverters.length === 0) {
    const fallbackInverter = Math.ceil(optimalInverter);
    return {
      optimalInverter: Math.round(optimalInverter * 10) / 10,
      suggestedInverters: {
        single: fallbackInverter,
        parallel: { count: 0, each: 0, total: 0 }
      },
      inverterLogic: calculationDetails
    };
  }
  
  const maxAvailableInverter = validInverters[validInverters.length - 1];
  
  // === الاستراتيجية 1: إنفرتر واحد ===
  
  // البحث عن أصغر إنفرتر يغطي الحاجة
  const perfectSingle = validInverters.find(inv => inv >= optimalInverter);
  
  if (perfectSingle) {
    // وجدنا إنفرتر واحد مناسب
    return {
      optimalInverter: Math.round(optimalInverter * 10) / 10,
      suggestedInverters: {
        single: perfectSingle,
        parallel: { count: 0, each: 0, total: 0 }
      },
      inverterLogic: calculationDetails
    };
  }
  
  // === الاستراتيجية 2: إنفرترات متوازية ===
  
  // إذا لم نجد إنفرتر واحد كافي، نحتاج تركيب متوازي
  let bestParallelSolution = null;
  let minInverterCount = Infinity;
  
  // جرب كل حجم إنفرتر متاح
  for (const inverterSize of validInverters.reverse()) { // من الكبير للصغير
    const requiredCount = Math.ceil(optimalInverter / inverterSize);
    
    // نقبل فقط الحلول التي تحتاج 6 إنفرترات أو أقل
    if (requiredCount <= 6 && requiredCount < minInverterCount) {
      minInverterCount = requiredCount;
      bestParallelSolution = {
        count: requiredCount,
        each: inverterSize,
        total: inverterSize * requiredCount
      };
      
      // إذا وجدنا حل بإنفرترين فقط، استخدمه
      if (requiredCount <= 2) break;
    }
  }
  
  // إذا وجدنا حل متوازي مناسب
  if (bestParallelSolution) {
    return {
      optimalInverter: Math.round(optimalInverter * 10) / 10,
      suggestedInverters: {
        single: bestParallelSolution.each, // للمقارنة مع اختيار المستخدم
        parallel: bestParallelSolution
      },
      inverterLogic: calculationDetails
    };
  }
  
  // === الحل الاحتياطي ===
  
  // استخدم أكبر إنفرتر متاح مع عدد محدود
  const emergencyCount = Math.min(6, Math.ceil(optimalInverter / maxAvailableInverter));
  
  return {
    optimalInverter: Math.round(optimalInverter * 10) / 10,
    suggestedInverters: {
      single: maxAvailableInverter,
      parallel: {
        count: emergencyCount,
        each: maxAvailableInverter,
        total: maxAvailableInverter * emergencyCount
      }
    },
    inverterLogic: calculationDetails
  };
}

// تطبيق حساب الإنفرتر
const totalBatteryCapacity = totalBattery; // إجمالي سعة البطاريات
const totalPanelWatt = optimalPanels * selectedPanel.watt;

// اختيار الإنفرتر الأقرب من الخيارات
const availableInverters = getInverterOptions(t).map(option =>
  parseFloat(option.match(/(\d+(\.\d+)?)/)?.[0] || "0")
).filter(inv => inv > 0).sort((a, b) => a - b);

const inverterCalculation = calculateOptimalInverter(
  ampHour,
  voltage,
  mainBattery,
  totalBatteryCapacity,
  totalPanelWatt,
  cutPeriod,
  availableInverters
);

// استخراج النتائج
const optimalInverter = inverterCalculation.optimalInverter;
const suggestedInvertersData = inverterCalculation.suggestedInverters;
const inverterLogic = inverterCalculation.inverterLogic;

// تحديد الإنفرتر المقترح للعرض والتفسير
const suggestedInverter = suggestedInvertersData.parallel.count > 0 
  ? suggestedInvertersData.parallel.total 
  : suggestedInvertersData.single;

// تحسين عرض النص
const inverterDisplayText = suggestedInvertersData.parallel.count > 0 
  ? `${suggestedInvertersData.parallel.each} ك.و × ${suggestedInvertersData.parallel.count} (إجمالي ${suggestedInvertersData.parallel.total} ك.و)`
  : `${suggestedInvertersData.single} ك.و`;

const inverterCoverage = inverterUser ? Math.min((inverterUser / optimalInverter) * 100, 100) : 0;

  // 📝 الرسائل الديناميكية
const dynamicNotes = generateDynamicMessages({
  t,
  mainBattery,
  backupBattery,
  nightEnergy: baseNightEnergy,
  totalPanelArea,
  priority: user.priority,
  goodSunlight: user.goodSunlight,
  highBuildings: user.highBuildings,
  panelName: selectedPanel.name,
  sunlightHours,
  ampHour,
  dayLoadWatt,
  nightLoadWatt,
  coverageFactor: 0.82,
  panelDailyOutput,
  actualCoverage,
  batteryUser,
  inverterUser,
  optimalInverter,
  inverterCoverage
});

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
report += `• ${safeTranslate(t, 'calculator.battery', 'البطارية')}: **${backupBatteries.length > 0 ? `${mainBattery} ك.و.س × ${backupBatteries.length + 1}` : `${mainBattery} ك.و.س`}**\n`;
report += `• ${safeTranslate(t, 'calculator.inverter', 'الإنفرتر')}: **${inverterDisplayText}**\n`;
report += `• ${safeTranslate(t, 'calculator.panels', 'الألواح')}: **${optimalPanels} × ${selectedPanel.watt} واط (${selectedPanel.name})**\n`;
report += `• ${safeTranslate(t, 'calculator.area', 'المساحة المطلوبة')}: **${totalPanelArea} م²**\n\n`;

// 📝 الملاحظات المحسنة والمطورة
if (dynamicNotes.length > 0) {
  // === تصفية الملاحظات المطلوب حذفها نهائياً ===
  const filteredNotes = dynamicNotes.filter(note => 
    // حذف جميع ملاحظات البطارية المقترحة والتغطية
    !note.includes('البطارية المقترحة') &&
    !note.includes('ك.و.س + احتياطية') &&
    !note.includes('+ احتياطية') &&
    !note.includes('تغطية الأحمال الليلية') &&
    !note.includes('بطاريتك') &&
    !note.includes('تغطي') &&
    !note.includes('فقط من حاجتك') &&
    !note.includes('من حاجتك الليلية') &&
    
    // حذف جميع ملاحظات الإنفرتر والتغطية
    !note.includes('الإنفرتر يغطي') &&
    !note.includes('مع هامش') &&
    !note.includes('إضافة إنفرتر أكبر') &&
    !note.includes('بقدرة') &&
    !note.includes('سيسمح بالاستفادة') &&
    !note.includes('شحنها بشكل أسرع') &&
    !note.includes('إنفرترك المختار') &&
    
    // حذف جميع ملاحظات الألواح والإنتاج
    !note.includes('الألواح تنتج يومياً') &&
    !note.includes('ك.و.س، تغطي') &&
    !note.includes('تغطي') &&
    !note.includes('من حاجتك') &&
    !note.includes('حوالي') &&
    
    // حذف جميع ملاحظات المساحة والتوصيات
    !note.includes('المساحة المطلوبة') &&
    !note.includes('كبيرة، ننصح') &&
    !note.includes('لتقليل العدد') &&
    !note.includes('توزيع الألواح بذكاء') &&
    !note.includes('ننصح باستخدام ألواح') &&
    
    // حذف جميع ملاحظات التواصل والخدمات
    !note.includes('للتفاصيل وخطة دقيقة') &&
    !note.includes('تواصل معنا الآن') &&
    !note.includes('009647749992888') &&
    !note.includes('فريقنا التقني يمكنه') &&
    !note.includes('للاستشارة المجانية') &&
    !note.includes('تحسين التصميم') &&
    !note.includes('تقليل التكاليف')
  );

  // === تصنيف الملاحظات المتبقية ===
  
  // ملاحظات الأولوية (إذا وجدت)
  const priorityNotes = filteredNotes.filter(note =>
    note.includes('priority') || note.includes('أولوية') || note.includes('مهم') ||
    (note.includes('ننصح') && !note.includes('المساحة') && !note.includes('ألواح'))
  );
  
  // ملاحظات بيئية وجغرافية
  const environmentalNotes = filteredNotes.filter(note =>
    note.includes('الشمس') || note.includes('إشعاع') || note.includes('مباني') ||
    note.includes('ظل') || note.includes('موقع') || note.includes('المحافظة') ||
    note.includes('جودة الإشعاع') || note.includes('عوائق')
  );
  
  // الملاحظات العامة المتبقية
  const generalNotes = filteredNotes.filter(note =>
    !priorityNotes.includes(note) && 
    !environmentalNotes.includes(note)
  );

  // === إضافة ملاحظات ذكية مفيدة فقط ===
  const smartNotes = [];
  
  // ملاحظة خاصة بالانقطاع الليلي
  if (cutPeriod === "night" && optimalPanels === 0) {
    smartNotes.push("💡 **انقطاع ليلي:** لا تحتاج ألواح شمسية - النهار متصل بالشبكة والبطارية تشحن من الكهرباء العامة");
  }
  
  // ملاحظة عن الأحمال الكبيرة
  if (ampHour > 80) {
    smartNotes.push("⚡ **حمل كبير:** نظامك يحتاج تصميم متقدم لضمان الاستقرار والكفاءة");
  }
  
  // ملاحظة عن الإنفرترات المتوازية
  if (suggestedInvertersData.parallel.count > 0) {
    smartNotes.push(`🔌 **إنفرترات متوازية:** النظام يحتاج ${suggestedInvertersData.parallel.count} إنفرترات موزعة لضمان الاستقرار`);
  }
  
  // ملاحظة عن البطاريات المتعددة
  if (backupBatteries.length > 3) {
    smartNotes.push("🔋 **بطاريات متعددة:** يُنصح بنظام إدارة بطاريات (BMS) متقدم لضمان التوازن");
  }

  // === عرض الملاحظات فقط إذا وجدت ===
  const hasNotesToShow = smartNotes.length > 0 || priorityNotes.length > 0 || 
                         environmentalNotes.length > 0 || generalNotes.length > 0;

  if (hasNotesToShow) {
    report += `**📝 ${safeTranslate(t, 'calculator.notesTitle', 'ملاحظات تقنية')}:**\n`;
    
    // الملاحظات الذكية أولاً
    if (smartNotes.length > 0) {
      report += `${smartNotes.join('\n')}\n`;
    }
    
    // العوامل البيئية
    if (environmentalNotes.length > 0) {
      if (smartNotes.length > 0) report += `\n`;
      report += `**🌞 العوامل البيئية:**\n`;
      report += `${environmentalNotes.join('\n')}\n`;
    }
    
    // توصيات الأولوية
    if (priorityNotes.length > 0) {
      if (smartNotes.length > 0 || environmentalNotes.length > 0) report += `\n`;
      report += `**⭐ توصيات:**\n`;
      report += `${priorityNotes.join('\n')}\n`;
    }
    
    // الملاحظات العامة
    if (generalNotes.length > 0) {
      if (smartNotes.length > 0 || environmentalNotes.length > 0 || priorityNotes.length > 0) report += `\n`;
      report += `**📋 ملاحظات إضافية:**\n`;
      report += `${generalNotes.join('\n')}\n`;
    }
    
    report += `\n`;
  }
}

// === تنبيهات للحالات الخاصة فقط ===
const warningNotes = [];

// تحذير للأحمال الاستثنائية
if (ampHour > 150) {
  warningNotes.push("⚠️ **تنبيه:** الحمل كبير جداً - يُنصح بدراسة تقسيم الأحمال أو استخدام أنظمة متعددة");
}

// تحذير لنقص الإشعاع الشديد
if (sunlightHours < 4) {
  warningNotes.push("⚠️ **تنبيه:** ساعات الشمس قليلة في منطقتك - قد تحتاج ألواح إضافية أو نظام هجين");
}

if (warningNotes.length > 0) {
  report += `**🚨 تنبيهات مهمة:**\n`;
  report += `${warningNotes.join('\n')}\n\n`;
}

// === خاتمة مبسطة ===
report += `🟢 ${safeTranslate(t, 'calculator.cta', 'هذه النتائج أولية. فريقنا التقني قادر على تحسين التصميم وخفض التكاليف. تواصل معنا: 009647749992888')}\n\n`;
report += `— ${safeTranslate(t, 'calculator.footer', 'مع تحيات فريق سما السدرة')} —`;

return report;}