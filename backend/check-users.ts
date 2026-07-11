import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter } as any);
  
  const users = await prisma.user.findMany();
  console.log('Users in DB:', users.map(u => ({ email: u.email, password: u.password })));
  await prisma.$disconnect();
}
main();
