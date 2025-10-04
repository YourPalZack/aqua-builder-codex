export function litersFromCm(lengthCm: number, widthCm: number, heightCm: number) {
  // cubic cm to liters (1000 cc = 1 L)
  return (lengthCm * widthCm * heightCm) / 1000;
}

export function gallonsFromLiters(liters: number) {
  return liters * 0.264172;
}

export function volumeFromDimensions(lengthCm: number, widthCm: number, heightCm: number) {
  const volumeL = litersFromCm(lengthCm, widthCm, heightCm);
  const volumeGal = gallonsFromLiters(volumeL);
  return { volumeL, volumeGal };
}

