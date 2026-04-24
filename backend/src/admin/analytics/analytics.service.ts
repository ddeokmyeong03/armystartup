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

    const completedGoals = await this.prisma.goal.count({
      where: { progressPercent: { gte: 100 } },
    });

    // 목표 카테고리 분포 (raw SQL — Goal.category 타입 우회)
    const goalsByCategory = await this.prisma.$queryRaw<{ category: string; count: bigint }[]>`
      SELECT category, COUNT(*)::bigint AS count
      FROM goals
      GROUP BY category
      ORDER BY count DESC
    `;

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
        goalsByCategory: goalsByCategory.map(g => ({ category: g.category, count: Number(g.count) })),
      },
    };
  }

  async getGoalsAnalytics(_branch?: string) {
    // 카테고리별 목표 분포 + 평균 진행률 (raw SQL)
    const goalsByCategory = await this.prisma.$queryRaw<
      { category: string; count: bigint; avg_progress: number | null }[]
    >`
      SELECT category, COUNT(*)::bigint AS count, AVG("progressPercent") AS avg_progress
      FROM goals
      GROUP BY category
      ORDER BY count DESC
    `;

    const [activeCount, inactiveCount] = await Promise.all([
      this.prisma.goal.count({ where: { isActive: true } }),
      this.prisma.goal.count({ where: { isActive: false } }),
    ]);

    // 최근 목표 목록 (raw SQL — category 필드 포함)
    const recentGoals = await this.prisma.$queryRaw<
      { id: number; title: string; category: string; progressPercent: number; isActive: boolean; createdAt: Date }[]
    >`
      SELECT id, title, category, "progressPercent", "isActive", "createdAt"
      FROM goals
      ORDER BY "createdAt" DESC
      LIMIT 10
    `;

    return {
      message: '목표 분석 데이터를 조회했습니다.',
      data: {
        byCategory: goalsByCategory.map(g => ({
          category: g.category,
          count: Number(g.count),
          avgProgress: Math.round(g.avg_progress ?? 0),
        })),
        activeCount,
        inactiveCount,
        recentGoals,
      },
    };
  }

  async getCoursesAnalytics() {
    const byStatus = await this.prisma.courseRecommendation.groupBy({
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
        return {
          courseId: tc.courseId,
          title: course?.title ?? '',
          source: course?.source ?? '',
          category: course?.category ?? '',
          count: tc._count.id,
        };
      }),
    );

    const coursesByCategory = await this.prisma.course.groupBy({
      by: ['category'],
      _count: { id: true },
    });

    return {
      message: '강의 분석 데이터를 조회했습니다.',
      data: {
        recommendationStatus: byStatus.map(s => ({ status: s.status, count: s._count.id })),
        topCourses: topCoursesWithDetails,
        coursesByCategory: coursesByCategory.map(c => ({ category: c.category, count: c._count.id })),
      },
    };
  }

  async getFatigueAnalytics() {
    // 일정 카테고리별 분포 (근무 유형 파악)
    const schedulesByCategory = await this.prisma.schedule.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    return {
      message: '피로도 분석 데이터를 조회했습니다.',
      data: {
        schedulesByCategory: schedulesByCategory.map(s => ({
          category: s.category ?? '기타',
          count: s._count.id,
        })),
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
