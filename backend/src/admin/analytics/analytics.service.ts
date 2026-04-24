import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [totalUsers, totalGoals, totalSchedules, totalCourseViews] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.goal.count(),
      this.prisma.schedule.count(),
      this.prisma.courseRecommendation.count(),
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const mauUsers = await this.prisma.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const dauUsers = await this.prisma.user.count({
      where: { createdAt: { gte: oneDayAgo } },
    });

    // 목표 카테고리 분포
    const goalsByCategory = await this.prisma.goal.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    // 완료된 목표 수
    const completedGoals = await this.prisma.goal.count({
      where: { progressPercent: { gte: 100 } },
    });

    return {
      message: '대시보드 개요를 조회했습니다.',
      data: {
        totalUsers,
        dauUsers,
        mauUsers,
        totalGoals,
        completedGoals,
        goalCompletionRate: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0,
        totalSchedules,
        totalCourseViews,
        goalsByCategory: goalsByCategory.map(g => ({ category: g.category, count: g._count.id })),
      },
    };
  }

  async getGoalsAnalytics(branch?: string) {
    const goalsByCategory = await this.prisma.goal.groupBy({
      by: ['category'],
      _count: { id: true },
      _avg: { progressPercent: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const activeVsInactive = await this.prisma.goal.groupBy({
      by: ['isActive'],
      _count: { id: true },
    });

    const recentGoals = await this.prisma.goal.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, title: true, category: true, progressPercent: true, isActive: true, createdAt: true },
    });

    return {
      message: '목표 분석 데이터를 조회했습니다.',
      data: {
        byCategory: goalsByCategory.map(g => ({
          category: g.category,
          count: g._count.id,
          avgProgress: Math.round(g._avg.progressPercent ?? 0),
        })),
        activeCount: activeVsInactive.find(g => g.isActive)?._count.id ?? 0,
        inactiveCount: activeVsInactive.find(g => !g.isActive)?._count.id ?? 0,
        recentGoals,
      },
    };
  }

  async getCoursesAnalytics() {
    const bySource = await this.prisma.courseRecommendation.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const topCourses = await this.prisma.courseRecommendation.groupBy({
      by: ['courseId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    const topCoursesWithDetails = await Promise.all(
      topCourses.map(async tc => {
        const course = await this.prisma.course.findUnique({ where: { id: tc.courseId } });
        return { courseId: tc.courseId, title: course?.title ?? '', source: course?.source ?? '', category: course?.category ?? '', count: tc._count.id };
      }),
    );

    const coursesByCategory = await this.prisma.course.groupBy({
      by: ['category'],
      _count: { id: true },
    });

    return {
      message: '강의 분석 데이터를 조회했습니다.',
      data: {
        recommendationStatus: bySource.map(s => ({ status: s.status, count: s._count.id })),
        topCourses: topCoursesWithDetails,
        coursesByCategory: coursesByCategory.map(c => ({ category: c.category, count: c._count.id })),
      },
    };
  }

  async getFatigueAnalytics() {
    const schedulesByCategory = await this.prisma.schedule.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const recentSchedules = await this.prisma.schedule.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { category: true, fatigueType: true, scheduleDate: true },
    });

    const fatigueDistribution = recentSchedules
      .filter(s => s.fatigueType !== null)
      .reduce<Record<string, number>>((acc, s) => {
        const level = parseInt(s.fatigueType ?? '0');
        const bucket = level >= 80 ? '고피로(80+)' : level >= 50 ? '중피로(50-79)' : '저피로(~49)';
        acc[bucket] = (acc[bucket] ?? 0) + 1;
        return acc;
      }, {});

    return {
      message: '피로도 분석 데이터를 조회했습니다.',
      data: {
        schedulesByCategory: schedulesByCategory.map(s => ({ category: s.category ?? '기타', count: s._count.id })),
        fatigueDistribution: Object.entries(fatigueDistribution).map(([bucket, count]) => ({ bucket, count })),
      },
    };
  }

  async getUsersAnalytics() {
    const usersByMonth = await this.prisma.$queryRaw<{ month: string; count: bigint }[]>`
      SELECT TO_CHAR("createdAt", 'YYYY-MM') AS month, COUNT(*)::bigint AS count
      FROM users
      GROUP BY month
      ORDER BY month DESC
      LIMIT 6
    `;

    const totalUsers = await this.prisma.user.count();

    return {
      message: '유저 분석 데이터를 조회했습니다.',
      data: {
        totalUsers,
        byMonth: usersByMonth.map(u => ({ month: u.month, count: Number(u.count) })),
      },
    };
  }

  async trackActivity(userId: number, eventType: string, payload: object = {}, platform = 'WEB') {
    try {
      await this.prisma.$executeRaw`
        INSERT INTO user_activities ("userId", "eventType", payload, platform, "createdAt")
        VALUES (${userId}, ${eventType}, ${JSON.stringify(payload)}, ${platform}, NOW())
      `;
    } catch {
      // 추적 실패는 무시
    }
  }
}
