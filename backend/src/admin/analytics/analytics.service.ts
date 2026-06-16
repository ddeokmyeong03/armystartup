import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [totalUsers, totalRecords, totalChallenges] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.record.count(),
      this.prisma.challenge.count(),
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const mauUsers = await this.prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } });

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const dauUsers = await this.prisma.user.count({ where: { createdAt: { gte: oneDayAgo } } });

    const recordsByCategory = await this.prisma.record.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    return {
      message: '대시보드 개요를 조회했습니다.',
      data: {
        totalUsers,
        dauUsers,
        mauUsers,
        totalRecords,
        totalChallenges,
        recordsByCategory: recordsByCategory.map(r => ({ category: r.category, count: r._count.id })),
      },
    };
  }

  async getRecordsAnalytics() {
    const byCategory = await this.prisma.record.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const verifiedCount = await this.prisma.record.count({ where: { verified: true } });
    const selfCount = await this.prisma.record.count({ where: { verified: false } });

    const recentRecords = await this.prisma.record.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, category: true, title: true, verified: true, recordDate: true, createdAt: true },
    });

    return {
      message: '기록 분석 데이터를 조회했습니다.',
      data: {
        byCategory: byCategory.map(r => ({ category: r.category, count: r._count.id })),
        verifiedCount,
        selfCount,
        recentRecords,
      },
    };
  }

  async getChallengesAnalytics() {
    const byCategory = await this.prisma.challenge.groupBy({
      by: ['category'],
      _count: { id: true },
    });

    const byJudgmentType = await this.prisma.challenge.groupBy({
      by: ['judgmentType'],
      _count: { id: true },
    });

    const totalParticipants = await this.prisma.challengeParticipant.count();

    return {
      message: '챌린지 분석 데이터를 조회했습니다.',
      data: {
        byCategory: byCategory.map(c => ({ category: c.category, count: c._count.id })),
        byJudgmentType: byJudgmentType.map(j => ({ type: j.judgmentType, count: j._count.id })),
        totalParticipants,
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

    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nickname: true,
        provider: true,
        role: true,
        createdAt: true,
        profile: {
          select: { rankName: true, branch: true, unitName: true, enlistedAt: true, dischargeDate: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: '유저 분석 데이터를 조회했습니다.',
      data: {
        totalUsers,
        byMonth: usersByMonth.map(u => ({ month: u.month, count: Number(u.count) })),
        users: users.map(u => ({
          id: u.id,
          email: u.email,
          nickname: u.nickname,
          provider: u.provider,
          role: u.role,
          createdAt: u.createdAt,
          rankName: u.profile?.rankName ?? null,
          branch: u.profile?.branch ?? null,
          unitName: u.profile?.unitName ?? null,
          enlistedAt: u.profile?.enlistedAt ?? null,
          dischargeDate: u.profile?.dischargeDate ?? null,
        })),
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
