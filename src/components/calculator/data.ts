export const governorateKeys = [
  "baghdad", "basra", "ninawa", "erbil", "sulaymaniyah", "duhok", "kirkuk",
  "diyala", "anbar", "babel", "karbala", "najaf", "muthanna", "qadisiyah",
  "wasit", "maysan", "dhiqar", "salahaddin"
];

// بيانات الإشعاع الشمسي
export const governorateSunlight = {
  "baghdad": 5.8, "basra": 6.2, "ninawa": 5.5, "erbil": 5.4, "sulaymaniyah": 5.3,
  "duhok": 5.4, "kirkuk": 5.7, "diyala": 5.8, "anbar": 6.1, "babel": 5.9,
  "karbala": 6.0, "najaf": 6.1, "muthanna": 6.3, "qadisiyah": 5.9, "wasit": 5.8,
  "maysan": 6.2, "dhiqar": 6.3, "salahaddin": 5.6
};

import { safeTranslate } from './utils';

export function getBatteryOptions(t: Function) {
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
}

export function getInverterOptions(t: Function) {
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
}