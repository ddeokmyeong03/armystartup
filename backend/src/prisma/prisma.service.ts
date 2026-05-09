import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    await this.runMigrations();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async runMigrations() {
    try {
      // socialId 컬럼 추가 (소셜 로그인)
      await this.$executeRaw`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "socialId" TEXT`;

      // password 컬럼 nullable 변경 (소셜 전용 계정 지원)
      await this.$executeRaw`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`;

      // 비밀번호 재설정 토큰 테이블 생성
      await this.$executeRaw`
        CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
          "id"        SERIAL PRIMARY KEY,
          "userId"    INTEGER NOT NULL,
          "token"     TEXT NOT NULL,
          "expiresAt" TIMESTAMP(3) NOT NULL,
          "used"      BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "password_reset_tokens_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
      `;
      await this.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "password_reset_tokens_token_key"
        ON "password_reset_tokens"("token")
      `;

      this.logger.log('DB migrations applied');
    } catch (err) {
      this.logger.warn(`Migration step skipped or failed: ${(err as any)?.message ?? err}`);
    }
  }
}
