-- AlterTable user_profiles: add enlistedAt, branch, interests
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "enlistedAt" TEXT;
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "branch" TEXT;
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "interests" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "user_profiles" ALTER COLUMN "wakeUpTime" SET DEFAULT '06:30';
ALTER TABLE "user_profiles" ALTER COLUMN "sleepTime" SET DEFAULT '23:00';

-- AlterTable schedules: add endDate, fatigueType
ALTER TABLE "schedules" ADD COLUMN IF NOT EXISTS "endDate" TEXT;
ALTER TABLE "schedules" ADD COLUMN IF NOT EXISTS "fatigueType" TEXT;

-- AlterTable goals: add category, deadline, pinned
ALTER TABLE "goals" ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT '기타';
ALTER TABLE "goals" ADD COLUMN IF NOT EXISTS "deadline" TEXT;
ALTER TABLE "goals" ADD COLUMN IF NOT EXISTS "pinned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable courses: add matchScore
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "matchScore" INTEGER NOT NULL DEFAULT 80;

-- CreateTable notifications
CREATE TABLE IF NOT EXISTS "notifications" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
