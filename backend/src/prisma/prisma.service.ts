import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(configService: ConfigService) {
    super({
      adapter: new PrismaPg({ connectionString: configService.get<string>('DATABASE_URL') }),
    } as any);
  }

  async onModuleInit() {
    await this.$connect();
  }
}