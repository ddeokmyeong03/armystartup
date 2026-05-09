-- 소셜 로그인 및 비밀번호 재설정 기능 추가

-- 1. users.password를 nullable로 변경 (소셜 전용 계정 지원)
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;

-- 2. users.socialId 컬럼 추가
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "socialId" TEXT;

-- 3. password_reset_tokens 테이블 생성
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
    "id"        SERIAL PRIMARY KEY,
    "userId"    INTEGER NOT NULL,
    "token"     TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used"      BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "password_reset_tokens_token_key" ON "password_reset_tokens"("token");
