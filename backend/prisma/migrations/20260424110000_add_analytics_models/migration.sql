-- B2G 어드민 대시보드용 UserActivity, AdminUser 모델 추가
CREATE TABLE "user_activities" (
    "id"        SERIAL PRIMARY KEY,
    "userId"    INTEGER NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload"   TEXT NOT NULL DEFAULT '{}',
    "platform"  TEXT NOT NULL DEFAULT 'WEB',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "user_activities_userId_eventType_idx" ON "user_activities"("userId", "eventType");
CREATE INDEX "user_activities_eventType_createdAt_idx" ON "user_activities"("eventType", "createdAt");

CREATE TABLE "admin_users" (
    "id"           SERIAL PRIMARY KEY,
    "email"        TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role"         TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");
