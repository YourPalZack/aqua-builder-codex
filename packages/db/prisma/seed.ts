import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.fish.createMany({
    data: [
      {
        commonName: "Neon Tetra",
        waterType: "FRESH",
        minTankGal: 10,
        tempMinC: 22,
        tempMaxC: 28,
        phMin: 6,
        phMax: 7.5,
        temperament: "PEACEFUL",
        diet: "OMNIVORE",
        adultSizeCm: 3.5,
        schoolingMin: 6,
        bioloadFactor: 0.4,
        plantSafe: true,
        invertSafe: true,
      },
      {
        commonName: "Tiger Barb",
        waterType: "FRESH",
        minTankGal: 20,
        tempMinC: 22,
        tempMaxC: 27,
        phMin: 6,
        phMax: 7.5,
        temperament: "SEMI_AGGRESSIVE",
        diet: "OMNIVORE",
        adultSizeCm: 7,
        schoolingMin: 6,
        bioloadFactor: 0.9,
        plantSafe: false,
        invertSafe: false,
      },
      {
        commonName: "Oscar Cichlid",
        waterType: "FRESH",
        minTankGal: 75,
        tempMinC: 22,
        tempMaxC: 28,
        phMin: 6,
        phMax: 8,
        temperament: "AGGRESSIVE",
        diet: "CARNIVORE",
        adultSizeCm: 35,
        bioloadFactor: 2.5,
        plantSafe: false,
        invertSafe: false,
      },
    ],
  });

  await prisma.compatibilityRule.createMany({
    data: [
      {
        aType: "FISH",
        aId: "Tiger Barb",
        bType: "FISH",
        bId: "Angelfish",
        level: "WARN",
        reason: "Fin nipping risk.",
      },
      {
        aType: "EQUIPMENT",
        aId: "ProteinSkimmer",
        bType: "BUILD",
        bId: "FRESH_*",
        level: "BLOCK",
        reason: "Skimmers incompatible with freshwater.",
      },
    ],
  });
}

main().finally(() => prisma.$disconnect());

