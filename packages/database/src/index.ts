import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma Client — évite les multiples instances en développement
 * (hot-reload crée de nouvelles connexions à chaque refresh).
 *
 * Usage dans les apps :
 *   import { db } from '@marrynov/database';
 *   const users = await db.user.findMany();
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

// Re-export types utiles
export { PrismaClient } from '@prisma/client';
export type * from '@prisma/client';
