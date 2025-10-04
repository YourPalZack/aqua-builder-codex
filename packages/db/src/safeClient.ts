import { PrismaClient } from '@prisma/client';
import * as data from './fallbackData';

let lastBuild: any | null = null;

export function getPrismaSafe() {
  try {
    const prisma = new PrismaClient();
    return { prisma, fallback: null as any };
  } catch (_e) {
    return {
      prisma: null as any,
      fallback: {
        tank: { findMany: async () => data.tanks },
        filter: { findMany: async () => data.filters },
        heater: { findMany: async () => data.heaters },
        light: { findMany: async () => data.lights },
        substrate: { findMany: async () => data.substrate },
        fish: { findMany: async () => data.fish },
        invertebrate: { findMany: async () => data.invertebrates },
        plant: { findMany: async () => data.plants },
        coral: { findMany: async () => data.corals },
        equipment: { findMany: async () => data.equipment },
        userBuild: {
          create: async (args: any) => {
            lastBuild = { id: 'demo-build', ...args.data, createdAt: new Date(), updatedAt: new Date() };
            return lastBuild;
          },
          findUnique: async (args: any) => {
            if (args?.where?.id === 'demo-build') return lastBuild;
            return null;
          },
        },
        productPrice: {
          findMany: async () => data.productPrices,
          create: async (args: any) => ({ id: 'pp-local', ...args.data, timestamp: new Date() })
        },
        priceAlert: { create: async (args: any) => ({ id: 'alert-1', ...args.data }) },
      },
    };
  }
}
