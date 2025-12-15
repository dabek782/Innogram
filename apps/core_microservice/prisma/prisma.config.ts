import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  schema: 'prisma/schema',
});
export const prisma = new PrismaClient({ adapter });
