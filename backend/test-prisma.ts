import { ConfigService } from '@nestjs/config';
import { PrismaService } from './src/prisma/prisma.service';
import 'dotenv/config';

async function main() {
  const configService = new ConfigService();
  const prisma = new PrismaService(configService);
  try {
    await prisma.onModuleInit();
    const services = await prisma.service.findMany();
    console.log(services);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
main();