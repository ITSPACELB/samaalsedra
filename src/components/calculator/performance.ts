export const estimateSystemPerformance = (user: any) => {
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
    panels: user.estimatedPanels // افتراضياً، لكن يمكن حسابه هنا إذا لزم
  };
};