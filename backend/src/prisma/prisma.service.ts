import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    try {
      await this.$executeRaw`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "socialId" TEXT`;
      this.logger.log('socialId column ready');
    } catch (e: any) {
      this.logger.warn(`socialId migration skipped: ${e?.message}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
