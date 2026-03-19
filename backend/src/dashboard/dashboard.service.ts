import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import dayjs from 'dayjs';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async home(userId: number) {
    const today = dayjs().format('YYYY-MM-DD');
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { nickname: true } });

    const [todaySchedules, todayAiPlans, completedPlans, activeGoals] = await Promise.all([
      this.prisma.schedule.count({ where: { userId, scheduleDate: today } }),
      this.prisma.aiPlan.count({ where: { userId, recommendedDate: today } }),
      this.prisma.aiPlan.count({ where: { userId, recommendedDate: today, status: 'COMPLETED' } }),
      this.prisma.goal.count({ where: { userId, isActive: true } }),
    ]);

    return {
      message: '홈 대시보드 정보를 조회했습니다.',
      data: {
        nickname: user?.nickname ?? '',
        todayScheduleCount: todaySchedules,
        todayAiPlanCount: todayAiPlans,
        completedPlanCount: completedPlans,
        activeGoalCount: activeGoals,
      },
    };
  }
}
