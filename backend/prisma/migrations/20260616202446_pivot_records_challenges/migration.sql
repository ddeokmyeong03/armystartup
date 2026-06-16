/*
  Warnings:

  - You are about to drop the column `availableStudyMinutes` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `interests` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `memo` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `preferredPlanIntensity` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `sleepTime` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `wakeUpTime` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `socialId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `ai_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_recommendations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `courses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `goals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `password_reset_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roadmaps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schedules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ai_plans" DROP CONSTRAINT "ai_plans_goalId_fkey";

-- DropForeignKey
ALTER TABLE "ai_plans" DROP CONSTRAINT "ai_plans_userId_fkey";

-- DropForeignKey
ALTER TABLE "course_recommendations" DROP CONSTRAINT "course_recommendations_courseId_fkey";

-- DropForeignKey
ALTER TABLE "course_recommendations" DROP CONSTRAINT "course_recommendations_goalId_fkey";

-- DropForeignKey
ALTER TABLE "course_recommendations" DROP CONSTRAINT "course_recommendations_userId_fkey";

-- DropForeignKey
ALTER TABLE "goals" DROP CONSTRAINT "goals_userId_fkey";

-- DropForeignKey
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "password_reset_tokens_userId_fkey";

-- DropForeignKey
ALTER TABLE "roadmaps" DROP CONSTRAINT "roadmaps_goalId_fkey";

-- DropForeignKey
ALTER TABLE "roadmaps" DROP CONSTRAINT "roadmaps_userId_fkey";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_userId_fkey";

-- AlterTable
ALTER TABLE "user_profiles" DROP COLUMN "availableStudyMinutes",
DROP COLUMN "interests",
DROP COLUMN "memo",
DROP COLUMN "preferredPlanIntensity",
DROP COLUMN "sleepTime",
DROP COLUMN "wakeUpTime",
ADD COLUMN     "goal" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "socialId";

-- DropTable
DROP TABLE "ai_plans";

-- DropTable
DROP TABLE "course_recommendations";

-- DropTable
DROP TABLE "courses";

-- DropTable
DROP TABLE "goals";

-- DropTable
DROP TABLE "password_reset_tokens";

-- DropTable
DROP TABLE "roadmaps";

-- DropTable
DROP TABLE "schedules";

-- CreateTable
CREATE TABLE "records" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "recordDate" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "evidenceUrl" TEXT,
    "meta" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenges" (
    "id" SERIAL NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "judgmentType" TEXT NOT NULL DEFAULT 'NON_COMPETITIVE',
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "maxParticipants" INTEGER,
    "isRewarded" BOOLEAN NOT NULL DEFAULT false,
    "entryFee" INTEGER NOT NULL DEFAULT 0,
    "prizeMoney" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_participants" (
    "id" SERIAL NOT NULL,
    "challengeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'JOINED',
    "rank" INTEGER,
    "passed" BOOLEAN,
    "evidenceUrl" TEXT,
    "judgedAt" TIMESTAMP(3),

    CONSTRAINT "challenge_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "records_userId_category_idx" ON "records"("userId", "category");

-- CreateIndex
CREATE INDEX "records_userId_recordDate_idx" ON "records"("userId", "recordDate");

-- CreateIndex
CREATE INDEX "challenges_status_startDate_idx" ON "challenges"("status", "startDate");

-- CreateIndex
CREATE INDEX "challenge_participants_challengeId_idx" ON "challenge_participants"("challengeId");

-- CreateIndex
CREATE INDEX "challenge_participants_userId_idx" ON "challenge_participants"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "challenge_participants_challengeId_userId_key" ON "challenge_participants"("challengeId", "userId");

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
