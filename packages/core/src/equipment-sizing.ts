export function recommendHeaterWattage(tankGal: number) {
  const min = Math.ceil(tankGal * 3);
  const max = Math.ceil(tankGal * 5);
  return { minW: min, maxW: max };
}

export function recommendFilterGph(tankGal: number) {
  const min = Math.ceil(tankGal * 4);
  const max = Math.ceil(tankGal * 6);
  return { minGph: min, maxGph: max };
}

