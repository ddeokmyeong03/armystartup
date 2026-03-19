-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'KAKAO', 'APPLE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "RepeatType" AS ENUM ('NONE', 'DAILY', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "ScheduleCategory" AS ENUM ('MILITARY', 'SELF_DEV', 'PERSONAL', 'REST', 'OTHER');

-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('STUDY', 'CERTIFICATE', 'EXERCISE', 'READING', 'CODING', 'OTHER');

-- CreateEnum
CREATE TYPE "AiPlanStatus" AS ENUM ('RECOMMENDED', 'APPLIED', 'COMPLETED', 'MISSED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PlanSourceType" AS ENUM ('AI_GENERATED', 'MANUAL_ADJUSTED');

-- CreateEnum
CREATE TYPE "PlanIntensity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "CourseSource" AS ENUM ('JANGBYEONGEEUM', 'DEFENSE_TRANSITION', 'K_MOOC', 'CERTIFICATE', 'OTHER');

-- CreateEnum
CREATE TYPE "CourseCategory" AS ENUM ('LANGUAGE', 'IT', 'LEADERSHIP', 'EXERCISE', 'CERTIFICATE', 'OTHER');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('RECOMMENDED', 'SAVED', 'DISMISSED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "provider" "AuthProvider" NOT NULL DEFAULT 'LOCAL',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "wakeUpTime" TEXT NOT NULL,
    "sleepTime" TEXT NOT NULL,
    "availableStudyMinutes" INTEGER NOT NULL DEFAULT 60,
    "preferredPlanIntensity" "PlanIntensity" NOT NULL DEFAULT 'MEDIUM',
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "scheduleDate" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "repeatType" "RepeatType" NOT NULL DEFAULT 'NONE',
    "category" "ScheduleCategory" NOT NULL DEFAULT 'PERSONAL',
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "type" "GoalType" NOT NULL DEFAULT 'STUDY',
    "targetDescription" TEXT,
    "preferredMinutesPerSession" INTEGER NOT NULL DEFAULT 60,
    "preferredSessionsPerWeek" INTEGER NOT NULL DEFAULT 3,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_plans" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "goalId" INTEGER NOT NULL,
    "activityTitle" TEXT NOT NULL,
    "recommendedDate" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" "AiPlanStatus" NOT NULL DEFAULT 'RECOMMENDED',
    "sourceType" "PlanSourceType" NOT NULL DEFAULT 'AI_GENERATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "source" "CourseSource" NOT NULL,
    "category" "CourseCategory" NOT NULL,
    "targetGoalType" "GoalType",
    "description" TEXT,
    "durationMinutes" INTEGER NOT NULL DEFAULT 60,
    "url" TEXT,
    "tags" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_recommendations" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "goalId" INTEGER,
    "reason" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "status" "RecommendationStatus" NOT NULL DEFAULT 'RECOMMENDED',
    "recommendedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- CreateIndex
CREATE INDEX "schedules_userId_scheduleDate_idx" ON "schedules"("userId", "scheduleDate");

-- CreateIndex
CREATE INDEX "goals_userId_idx" ON "goals"("userId");

-- CreateIndex
CREATE INDEX "ai_plans_userId_recommendedDate_idx" ON "ai_plans"("userId", "recommendedDate");

-- CreateIndex
CREATE INDEX "courses_source_category_idx" ON "courses"("source", "category");

-- CreateIndex
CREATE INDEX "course_recommendations_userId_status_idx" ON "course_recommendations"("userId", "status");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_plans" ADD CONSTRAINT "ai_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_plans" ADD CONSTRAINT "ai_plans_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_recommendations" ADD CONSTRAINT "course_recommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_recommendations" ADD CONSTRAINT "course_recommendations_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_recommendations" ADD CONSTRAINT "course_recommendations_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
