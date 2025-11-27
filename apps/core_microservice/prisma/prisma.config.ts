import { PrismaClient } from 'src/databases/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL ,
  schema: 'prisma/schema.prisma'
});
const prisma = new PrismaClient({ adapter });