// import "server-only";
// import { PrismaClient } from "./generated/prisma";

// const globalForPrisma = global as unknown as { prisma: PrismaClient };

// export const prisma = globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["warn", "error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * L’instance Prisma (prisma = new PrismaClient()) te donne un accès type-safe à ta base
 * (celle pointée par DATABASE_URL) et expose des méthodes prêtes à l’emploi pour tous tes modèles (prisma.user, prisma.course, prisma.enrollment, etc.).
* Ce que tu peux faire avec CRUD typé : findUnique/findMany/create/update/delete/upsert.

* Requêtes relationnelles : include, select, filtres imbriqués.

* Transactions : prisma.$transaction([...]) ou transaction interactive.
* Agrégations : count, aggregate (sum/avg/min/max), groupBy.
* Opérations atomiques : increment/decrement/set/push…

* SQL brut si besoin : prisma.$queryRaw, prisma.$executeRaw.
* Gestion connexion : prisma.$connect(), prisma.$disconnect(), logs.
 */
