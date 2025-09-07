// ✅ تعريف MessageParams
export interface MessageParams {
  t: Function;
  mainBattery: number;
  backupBattery: number | null;
  nightEnergy: number;
  totalPanelArea: number;
  priority?: string; // اختياري الآن، فقط للرسائل التسويقية
  goodSunlight: boolean;
  highBuildings: boolean;
  panelName: string;
  sunlightHours: number;
  ampHour: number;
  dayLoadWatt: number;
  nightLoadWatt: number;
  coverageFactor: number;
  panelDailyOutput: number;
  actualCoverage: number;
  batteryUser?: number;
  inverterUser?: number;
  optimalInverter?: number;
  inverterCoverage?: number;
  systemType?: string;
}

// ✅ دالة الرسائل الديناميكية
export function generateDynamicMessages({
  t,
  mainBattery,
  backupBattery,
  nightEnergy,
  totalPanelArea,
  priority,
  goodSunlight,
  highBuildings,
  panelName,
  sunlightHours,
  ampHour,
  dayLoadWatt,
  nightLoadWatt,
  coverageFactor,
  panelDailyOutput,
  actualCoverage,
  batteryUser,
  inverterUser,
  optimalInverter,
  inverterCoverage,
}: MessageParams): string[] {
  const notes: string[] = [];

  // 🔋 البطارية
  if (backupBattery) {
    notes.push(
      t('calculator.notes.batteryBackup', {
        main: mainBattery,
        backup: backupBattery,
        need: nightEnergy.toFixed(1),
      })
    );
  } else {
    notes.push(
      t('calculator.notes.batteryMain', {
        main: mainBattery,
        need: nightEnergy.toFixed(1),
      })
    );
  }

  // ⚠️ مقارنة البطارية الحالية مع الحاجة
  if (batteryUser && batteryUser < nightEnergy) {
    const coverage = ((batteryUser / nightEnergy) * 100).toFixed(0);
    notes.push(
      t('calculator.notes.batteryLow', {
        battery: batteryUser,
        coverage,
      })
    );
  }

  // ☀️ الإشعاع والعوائق
  if (!goodSunlight && highBuildings) {
    notes.push(t('calculator.notes.shadingWeak', { panel: panelName }));
  } else if (!goodSunlight) {
    notes.push(t('calculator.notes.sunWeak', { panel: panelName }));
  } else if (highBuildings) {
    notes.push(t('calculator.notes.shadingLoss', { loss: 15 }));
  }

  // 🏠 المساحة
  if (totalPanelArea > 30) {
    notes.push(
      t('calculator.notes.areaWarning', {
        area: totalPanelArea,
        panel: panelName,
      })
    );
  }

  // 🔆 الإنتاج اليومي
  notes.push(
    t('calculator.notes.panelOutput', {
      output: panelDailyOutput,
      coverage: actualCoverage.toFixed(0),
    })
  );

  // 💬 الرسائل التسويقية حسب اختيار الزبون
// 💬 الرسائل التسويقية حسب اختيار الزبون
if (priority === 'economy') {
  notes.push(t('calculator.notes.planEconomyMessage'));
} else if (priority === 'balanced') {
  notes.push(t('calculator.notes.planBalancedMessage'));
} else if (priority === 'performance') {
  notes.push(t('calculator.notes.planPerformanceMessage'));
}

// 🆕 ملاحظة اتجاه الألواح
notes.push(
  t('calculator.panelTiltNote', 'يُفضل تركيب الألواح باتجاه الجنوب (اتجاه القبلة) مع زاوية ميل مناسبة لضمان أفضل إنتاجية للطاقة')
);

// 📞 CTA
notes.push(t('calculator.notes.cta'));

return notes;

  return notes;
}
