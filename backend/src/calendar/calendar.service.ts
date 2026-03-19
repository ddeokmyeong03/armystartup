import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import dayjs from 'dayjs';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  async weeklySummary(userId: number, startDate: string) {
    const start = dayjs(startDate);
    const days = Array.from({ length: 7 }, (_, i) => start.add(i, 'day').format('YYYY-MM-DD'));

    const [schedules, aiPlans] = await Promise.all([
      this.prisma.schedule.groupBy({ by: ['scheduleDate'], where: { userId, scheduleDate: { in: days } }, _count: true }),
      this.prisma.aiPlan.groupBy({ by: ['recommendedDate'], where: { userId, recommendedDate: { in: days } }, _count: true }),
    ]);

    const scheduleMap = Object.fromEntries(schedules.map((s) => [s.scheduleDate, s._count]));
    const aiPlanMap = Object.fromEntries(aiPlans.map((a) => [a.recommendedDate, a._count]));

    const result = days.map((date) => ({
      date,
      scheduleCount: scheduleMap[date] ?? 0,
      aiPlanCount: aiPlanMap[date] ?? 0,
      hasSchedule: (scheduleMap[date] ?? 0) > 0,
      hasAiPlan: (aiPlanMap[date] ?? 0) > 0,
    }));

    return {
      message: '주간 캘린더 요약을 조회했습니다.',
      data: { startDate, endDate: days[6], days: result },
    };
  }

  async monthlySummary(userId: number, year: number, month: number) {
    const start = dayjs(`${year}-${String(month).padStart(2, '0')}-01`);
    const daysInMonth = start.daysInMonth();
    const days = Array.from({ length: daysInMonth }, (_, i) => start.add(i, 'day').format('YYYY-MM-DD'));

    const [schedules, aiPlans] = await Promise.all([
      this.prisma.schedule.groupBy({ by: ['scheduleDate'], where: { userId, scheduleDate: { in: days } }, _count: true }),
      this.prisma.aiPlan.groupBy({ by: ['recommendedDate'], where: { userId, recommendedDate: { in: days } }, _count: true }),
    ]);

    const scheduleMap = Object.fromEntries(schedules.map((s) => [s.scheduleDate, s._count]));
    const aiPlanMap = Object.fromEntries(aiPlans.map((a) => [a.recommendedDate, a._count]));

    const result = days.map((date) => ({
      date,
      scheduleCount: scheduleMap[date] ?? 0,
      aiPlanCount: aiPlanMap[date] ?? 0,
      hasSchedule: (scheduleMap[date] ?? 0) > 0,
      hasAiPlan: (aiPlanMap[date] ?? 0) > 0,
    }));

    return { message: '월간 캘린더 요약을 조회했습니다.', data: { year, month, days: result } };
  }

  async dailyDetail(userId: number, date: string) {
    const [schedules, aiPlans] = await Promise.all([
      this.prisma.schedule.findMany({
        where: { userId, scheduleDate: date },
        orderBy: { startTime: 'asc' },
        select: { id: true, title: true, startTime: true, endTime: true, category: true, memo: true },
      }),
      this.prisma.aiPlan.findMany({
        where: { userId, recommendedDate: date },
        orderBy: { startTime: 'asc' },
        select: { id: true, activityTitle: true, startTime: true, endTime: true, status: true, goalId: true },
      }),
    ]);

    return { message: '일일 상세 정보를 조회했습니다.', data: { date, schedules, aiPlans } };
  }
}
