import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neon } from '@neondatabase/serverless'

const connectionString = process.env.DATABASE_URL!
const neonClient = neon(connectionString)
const adapter = new PrismaNeon(neonClient)

const prismaGlobal = globalThis as typeof globalThis & {
  prisma?: PrismaClient
}

export const prisma = prismaGlobal.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') prismaGlobal.prisma = prisma