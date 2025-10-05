export function computeInitialCost({ components, priceLookup }:{ components:any; priceLookup:(type:string,id:string)=>number|undefined }){
  let total = 0;
  try {
    if (components?.equipment?.filter) total += priceLookup('FILTER', components.equipment.filter) ?? 0;
    if (components?.equipment?.heater) total += priceLookup('HEATER', components.equipment.heater) ?? 0;
    if (components?.equipment?.light) total += priceLookup('LIGHT', components.equipment.light) ?? 0;
    if (components?.equipment?.substrate) total += priceLookup('SUBSTRATE', components.equipment.substrate) ?? 0;
    // Extras
    for (const id of (components?.equipment?.extras ?? [])) total += priceLookup('EQUIPMENT', id) ?? 0;
  } catch {}
  return total;
}

export function computeMonthlyCost({ ratePerKwh = 0.15, tankGal, heaterWatt, filterWatt = 5, lightWatt = 20 }:{ ratePerKwh?:number; tankGal:number; heaterWatt?:number; filterWatt?:number; lightWatt?:number }){
  // Heuristic: heater duty ~ 40% runtime average, filter 24h, light 8h/day
  const heaterKwh = ((heaterWatt ?? (tankGal*4)) / 1000) * 24 * 0.4 * 30; // 30 days
  const filterKwh = (filterWatt / 1000) * 24 * 30;
  const lightKwh = (lightWatt / 1000) * 8 * 30;
  const totalKwh = heaterKwh + filterKwh + lightKwh;
  return { kwh: totalKwh, cost: totalKwh * ratePerKwh };
}

