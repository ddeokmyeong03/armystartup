import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import dayjs from 'dayjs';

/** 시간 문자열 "HH:mm" → 분 */
function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m ?? 0);
}

/** 근무 카테고리 → 피로도 계수 (시간당) */
const CATEGORY_FATIGUE: Record<string, number> = {
  DUTY:     1.5,   // 당직/경계근무
  TRAINING: 1.2,   // 훈련
  ROLLCALL: 0.6,   // 점호
  STUDY:    0.3,   // 자기개발
  PERSONAL: 0.2,   // 개인 시간
  REST:     0.0,   // 휴식
  OTHER:    0.5,
};

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async home(userId: number) {
    const today = dayjs().format('YYYY-MM-DD');

    const [user, profile, todaySchedules, activeGoals, recentRoadmap] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId }, select: { nickname: true } }),
      this.prisma.userProfile.findUnique({ where: { userId } }),
      this.prisma.schedule.findMany({ where: { userId, scheduleDate: today } }),
      this.prisma.goal.findMany({
        where: { userId, isActive: true },
        select: { id: true, title: true, type: true, progressPercent: true },
        take: 5,
      }),
      this.prisma.roadmap.findFirst({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    // ── 가용시간 계산 ──────────────────────────────────────────────
    const wakeMinutes = toMinutes(profile?.wakeUpTime ?? '06:30');
    const sleepMinutes = toMinutes(profile?.sleepTime ?? '23:00');
    const totalAwakeMinutes = sleepMinutes > wakeMinutes ? sleepMinutes - wakeMinutes : 1020;

    // 오늘 일정 점유 시간 합산
    let scheduledMinutes = 0;
    let fatigueScore = 0;

    for (const sch of todaySchedules) {
      const start = toMinutes(sch.startTime);
      const end = toMinutes(sch.endTime);
      const durationH = (end > start ? end - start : end + 1440 - start) / 60;
      scheduledMinutes += durationH * 60;
      const coeff = CATEGORY_FATIGUE[sch.category] ?? 0.5;
      fatigueScore += durationH * coeff;
    }

    // 기본 가용시간 (시간 단위)
    const baseAvailableH = Math.max(0, (totalAwakeMinutes - scheduledMinutes) / 60);
    // 피로도 0~10 정규화 (최대 기준: 10시간 근무 × 계수 1.5 = 15)
    const fatigueScore10 = Math.min(10, Math.round((fatigueScore / 15) * 100) / 10);
    // 피로도 감소: 피로 점수 기반 (최대 2시간 감소)
    const fatigueReductionH = Math.min(2.0, fatigueScore * 0.3);
    const finalAvailableH = Math.max(0, baseAvailableH - fatigueReductionH);

    // 일과 시간표 (오늘 일정 + 공백 시간대)
    const scheduleTimeline = todaySchedules.map((s) => ({
      id: s.id,
      title: s.title,
      startTime: s.startTime,
      endTime: s.endTime,
      category: s.category,
      isMilitary: s.category === 'MILITARY',
    }));

    return {
      message: '홈 대시보드 정보를 조회했습니다.',
      data: {
        nickname: user?.nickname ?? '',
        today,
        // 가용시간 정보
        availableTime: {
          baseAvailableH: Math.round(baseAvailableH * 10) / 10,
          fatigueReductionH: Math.round(fatigueReductionH * 10) / 10,
          finalAvailableH: Math.round(finalAvailableH * 10) / 10,
          fatigueScore: fatigueScore10,
        },
        // 오늘 일과 시간표
        scheduleTimeline,
        // 활성 목표
        activeGoals,
        // 최근 로드맵 요약 (있는 경우)
        roadmapSummary: recentRoadmap
          ? {
              id: recentRoadmap.id,
              title: recentRoadmap.title,
              progressPercent: recentRoadmap.progressPercent,
              nextUpdateDate: recentRoadmap.nextUpdateDate,
              updateCount: recentRoadmap.updateCount,
            }
          : null,
      },
    };
  }
}
