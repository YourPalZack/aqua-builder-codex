export const tanks = [
  { id: 'tank-10g', brand: 'Generic', model: '10 Gallon', material: 'GLASS', lengthCm: 50.8, widthCm: 25.4, heightCm: 30.5, volumeL: 37.8, volumeGal: 10 },
  { id: 'tank-20l', brand: 'Generic', model: '20 Gallon Long', material: 'GLASS', lengthCm: 76.2, widthCm: 30.5, heightCm: 30.5, volumeL: 75.7, volumeGal: 20 },
  { id: 'tank-40b', brand: 'Generic', model: '40 Breeder', material: 'GLASS', lengthCm: 91.4, widthCm: 45.7, heightCm: 40.6, volumeL: 151, volumeGal: 40 },
  { id: 'tank-55g', brand: 'Generic', model: '55 Gallon', material: 'GLASS', lengthCm: 121.9, widthCm: 33, heightCm: 50.8, volumeL: 208, volumeGal: 55 },
  { id: 'tank-75g', brand: 'Generic', model: '75 Gallon', material: 'GLASS', lengthCm: 121.9, widthCm: 45.7, heightCm: 53.3, volumeL: 284, volumeGal: 75 },
];

export const filters = [
  { id: 'filter-hob-20', type: 'HOB', gph: 100, maxTankGal: 20, brand: 'AquaFlow', model: 'HOB 20' },
  { id: 'filter-hob-50', type: 'HOB', gph: 250, maxTankGal: 50, brand: 'AquaFlow', model: 'HOB 50' },
  { id: 'filter-hob-70', type: 'HOB', gph: 350, maxTankGal: 70, brand: 'AquaFlow', model: 'HOB 70' },
  { id: 'filter-can-250', type: 'CANISTER', gph: 250, maxTankGal: 55, brand: 'ClearCan', model: 'CC-250' },
  { id: 'filter-can-350', type: 'CANISTER', gph: 350, maxTankGal: 75, brand: 'ClearCan', model: 'CC-350' },
  { id: 'filter-sponge', type: 'SPONGE', gph: 60, maxTankGal: 10, brand: 'BioSponge', model: 'Nano' },
];

export const heaters = [
  { id: 'heater-50', wattage: 50, minTankGal: 5, maxTankGal: 15, brand: 'HeatCo', model: 'HC-50' },
  { id: 'heater-100', wattage: 100, minTankGal: 15, maxTankGal: 30, brand: 'HeatCo', model: 'HC-100' },
  { id: 'heater-200', wattage: 200, minTankGal: 30, maxTankGal: 55, brand: 'HeatCo', model: 'HC-200' },
  { id: 'heater-300', wattage: 300, minTankGal: 55, maxTankGal: 75, brand: 'HeatCo', model: 'HC-300' },
  { id: 'heater-500', wattage: 500, minTankGal: 90, maxTankGal: 125, brand: 'HeatCo', model: 'HC-500' },
];

export const lights = [
  { id: 'light-led-low', type: 'LED', intensity: 'LOW', coverageCm: 60, brand: 'BrightLED', model: 'Low' },
  { id: 'light-led-med', type: 'LED', intensity: 'MEDIUM', coverageCm: 90, brand: 'BrightLED', model: 'Medium' },
  { id: 'light-led-high', type: 'LED', intensity: 'HIGH', coverageCm: 120, brand: 'BrightLED', model: 'High' },
  { id: 'light-t5', type: 'T5', intensity: 'MEDIUM', coverageCm: 120, brand: 'TubeGlow', model: 'T5' },
];

export const substrate = [
  { id: 'sub-sand', type: 'SAND', plantFriendly: true, color: 'Natural' },
  { id: 'sub-gravel', type: 'GRAVEL', plantFriendly: false, color: 'Black' },
  { id: 'sub-soil', type: 'SOIL', plantFriendly: true, color: 'Brown' },
];

export const fish = [
  { id: 'fish-neon', commonName: 'Neon Tetra', waterType: 'FRESH', minTankGal: 10, tempMinC: 22, tempMaxC: 28, phMin: 6, phMax: 7.5, temperament: 'PEACEFUL', diet: 'OMNIVORE', adultSizeCm: 3.5, schoolingMin: 6, bioloadFactor: 0.4, plantSafe: true, invertSafe: true },
  { id: 'fish-cardinal', commonName: 'Cardinal Tetra', waterType: 'FRESH', minTankGal: 15, tempMinC: 24, tempMaxC: 30, phMin: 5.5, phMax: 7, temperament: 'PEACEFUL', diet: 'OMNIVORE', adultSizeCm: 4.5, schoolingMin: 6, bioloadFactor: 0.45, plantSafe: true, invertSafe: true },
  { id: 'fish-tiger', commonName: 'Tiger Barb', waterType: 'FRESH', minTankGal: 20, tempMinC: 22, tempMaxC: 27, phMin: 6, phMax: 7.5, temperament: 'SEMI_AGGRESSIVE', diet: 'OMNIVORE', adultSizeCm: 7, schoolingMin: 6, bioloadFactor: 0.9, plantSafe: false, invertSafe: false },
  { id: 'fish-angel', commonName: 'Angelfish', waterType: 'FRESH', minTankGal: 29, tempMinC: 24, tempMaxC: 30, phMin: 6, phMax: 7.5, temperament: 'SEMI_AGGRESSIVE', diet: 'OMNIVORE', adultSizeCm: 15, schoolingMin: null, bioloadFactor: 1.2, plantSafe: true, invertSafe: false },
  { id: 'fish-cory', commonName: 'Corydoras', waterType: 'FRESH', minTankGal: 20, tempMinC: 22, tempMaxC: 26, phMin: 6.5, phMax: 7.5, temperament: 'PEACEFUL', diet: 'OMNIVORE', adultSizeCm: 6, schoolingMin: 6, bioloadFactor: 0.6, plantSafe: true, invertSafe: true },
  { id: 'fish-guppy', commonName: 'Guppy', waterType: 'FRESH', minTankGal: 10, tempMinC: 22, tempMaxC: 28, phMin: 6.5, phMax: 8, temperament: 'PEACEFUL', diet: 'OMNIVORE', adultSizeCm: 4, schoolingMin: 3, bioloadFactor: 0.5, plantSafe: true, invertSafe: true },
  { id: 'fish-betta', commonName: 'Betta', waterType: 'FRESH', minTankGal: 5, tempMinC: 24, tempMaxC: 30, phMin: 6, phMax: 8, temperament: 'AGGRESSIVE', diet: 'CARNIVORE', adultSizeCm: 6, schoolingMin: null, bioloadFactor: 0.8, plantSafe: true, invertSafe: false },
  { id: 'fish-danio', commonName: 'Zebra Danio', waterType: 'FRESH', minTankGal: 10, tempMinC: 18, tempMaxC: 24, phMin: 6.5, phMax: 7.5, temperament: 'PEACEFUL', diet: 'OMNIVORE', adultSizeCm: 5, schoolingMin: 6, bioloadFactor: 0.5, plantSafe: true, invertSafe: true },
  { id: 'fish-oscar', commonName: 'Oscar Cichlid', waterType: 'FRESH', minTankGal: 75, tempMinC: 22, tempMaxC: 28, phMin: 6, phMax: 8, temperament: 'AGGRESSIVE', diet: 'CARNIVORE', adultSizeCm: 35, schoolingMin: null, bioloadFactor: 2.5, plantSafe: false, invertSafe: false },
  { id: 'fish-pleco', commonName: 'Bristlenose Pleco', waterType: 'FRESH', minTankGal: 20, tempMinC: 22, tempMaxC: 26, phMin: 6.5, phMax: 7.5, temperament: 'PEACEFUL', diet: 'OMNIVORE', adultSizeCm: 12, schoolingMin: null, bioloadFactor: 1.2, plantSafe: true, invertSafe: true },
];

export const plants = [
  { id: 'plant-anubias', commonName: 'Anubias', lightNeeds: 'LOW', co2Required: false, difficulty: 'BEGINNER' },
  { id: 'plant-java', commonName: 'Java Fern', lightNeeds: 'LOW', co2Required: false, difficulty: 'BEGINNER' },
  { id: 'plant-sword', commonName: 'Amazon Sword', lightNeeds: 'MEDIUM', co2Required: false, difficulty: 'BEGINNER' },
];

export const invertebrates = [
  { id: 'inv-amano', commonName: 'Amano Shrimp', waterType: 'FRESH', reefSafe: true, plantSafe: true, tempMinC: 20, tempMaxC: 26, phMin: 6.5, phMax: 7.5 },
  { id: 'inv-nerite', commonName: 'Nerite Snail', waterType: 'FRESH', reefSafe: true, plantSafe: true, tempMinC: 20, tempMaxC: 28, phMin: 7, phMax: 8 },
];

export const corals = [
  { id: 'coral-zoa', commonName: 'Zoanthid', lightReq: 'LOW', flowReq: 'LOW', difficulty: 'BEGINNER' },
];

export const equipment = [
  { id: 'equip-skimmer', category: 'Protein Skimmer', brand: 'ReefPro', model: 'RP-100', specJson: { saltOnly: true } },
  { id: 'equip-co2', category: 'CO2 Kit', brand: 'GreenGrow', model: 'GG-CO2', specJson: { regulator: true } },
];

export const productPrices = [
  { id: 'pp-1', productType: 'FILTER', productId: 'filter-hob-50', retailer: 'FishMart', priceCents: 3999, currency: 'USD', inStock: true, url: 'https://example.com/hob50', timestamp: new Date() },
  { id: 'pp-2', productType: 'FILTER', productId: 'filter-hob-50', retailer: 'AquaShop', priceCents: 3799, currency: 'USD', inStock: true, url: 'https://example.com/hob50a', timestamp: new Date(Date.now() - 86400000) },
];

