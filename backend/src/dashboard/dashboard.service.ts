import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecordsService } from '../records/records.service';
import { ChallengesService } from '../challenges/challenges.service';
import dayjs from 'dayjs';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly recordsService: RecordsService,
    private readonly challengesService: ChallengesService,
  ) {}

  async home(userId: number) {
    const today = dayjs().format('YYYY-MM-DD');

    const [user, profile, recordStats, activeChallenges] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId }, select: { nickname: true } }),
      this.prisma.userProfile.findUnique({ where: { userId } }),
      this.recordsService.stats(userId),
      this.challengesService.getActiveChallengesForUser(userId),
    ]);

    return {
      message: '홈 대시보드 정보를 조회했습니다.',
      data: {
        nickname: user?.nickname ?? '',
        today,
        profile: profile
          ? {
              rankName: profile.rankName,
              branch: profile.branch,
              unitName: profile.unitName,
              dischargeDate: profile.dischargeDate,
              goal: (profile as any).goal ?? null,
            }
          : null,
        recordStats,
        activeChallenges,
      },
    };
  }
}
