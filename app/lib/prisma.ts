import { Pool } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

// Get the connection string
const connectionString = process.env.DATABASE_URL;

// Create a Pool instance
const pool = new Pool({ connectionString });

// Initialize the PrismaNeon adapter with the Pool instance
const adapter = new PrismaNeon(pool);

// Global prisma instance
const prismaGlobal = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

// Initialize PrismaClient with the adapter
if (!prismaGlobal.prisma) {
  prismaGlobal.prisma = new PrismaClient({ adapter });
}

export const prisma = prismaGlobal.prisma;
