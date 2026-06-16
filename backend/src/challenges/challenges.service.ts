import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(private readonly prisma: PrismaService) {}

  // ── 챌린지 CRUD ──────────────────────────────────────────────────────────────

  async create(userId: number, dto: CreateChallengeDto) {
    const challenge = await this.prisma.challenge.create({
      data: {
        creatorId: userId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        judgmentType: dto.judgmentType,
        startDate: dto.startDate,
        endDate: dto.endDate,
        maxParticipants: dto.maxParticipants,
        isRewarded: dto.isRewarded ?? false,
        entryFee: dto.entryFee ?? 0,
        prizeMoney: dto.prizeMoney ?? 0,
        status: 'OPEN',
      },
    });
    return { message: '챌린지가 개설됐습니다.', data: this.withCount(challenge, 0) };
  }

  async findAll(category?: string) {
    const challenges = await this.prisma.challenge.findMany({
      where: { status: 'OPEN', ...(category ? { category } : {}) },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { participants: true } } },
    });
    return {
      message: '챌린지 목록입니다.',
      data: challenges.map(c => this.withCount(c, c._count.participants)),
    };
  }

  async findMine(userId: number) {
    const participants = await this.prisma.challengeParticipant.findMany({
      where: { userId },
      include: {
        challenge: { include: { _count: { select: { participants: true } } } },
      },
      orderBy: { joinedAt: 'desc' },
    });
    return {
      message: '내 챌린지 목록입니다.',
      data: participants.map(p => ({
        ...this.withCount(p.challenge, p.challenge._count.participants),
        myParticipation: this.stripChallenge(p),
      })),
    };
  }

  async findOne(userId: number, id: number) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
      include: { _count: { select: { participants: true } } },
    });
    if (!challenge) throw new NotFoundException('챌린지를 찾을 수 없습니다.');

    const myP = userId
      ? await this.prisma.challengeParticipant.findUnique({ where: { challengeId_userId: { challengeId: id, userId } } })
      : null;

    return {
      message: '챌린지 상세입니다.',
      data: { ...this.withCount(challenge, challenge._count.participants), myParticipation: myP ?? undefined },
    };
  }

  // ── 참여 ─────────────────────────────────────────────────────────────────────

  async join(userId: number, challengeId: number) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new NotFoundException('챌린지를 찾을 수 없습니다.');
    if (challenge.status !== 'OPEN') throw new ForbiddenException('참여할 수 없는 챌린지입니다.');

    const existing = await this.prisma.challengeParticipant.findUnique({
      where: { challengeId_userId: { challengeId, userId } },
    });
    if (existing) throw new ConflictException('이미 참여 중입니다.');

    if (challenge.maxParticipants) {
      const count = await this.prisma.challengeParticipant.count({ where: { challengeId } });
      if (count >= challenge.maxParticipants) throw new ForbiddenException('참여 인원이 가득 찼습니다.');
    }

    const participant = await this.prisma.challengeParticipant.create({
      data: { challengeId, userId, status: 'JOINED' },
    });
    return { message: '챌린지에 참여했습니다.', data: participant };
  }

  async getParticipants(id: number) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id } });
    if (!challenge) throw new NotFoundException('챌린지를 찾을 수 없습니다.');

    const participants = await this.prisma.challengeParticipant.findMany({
      where: { challengeId: id },
      include: { user: { select: { nickname: true } } },
      orderBy: challenge.judgmentType === 'RANKING'
        ? [{ rank: 'asc' }, { joinedAt: 'asc' }]
        : { joinedAt: 'asc' },
    });

    return {
      message: '참여 현황입니다.',
      data: {
        challenge,
        participants: participants.map(p => ({
          id: p.id,
          challengeId: p.challengeId,
          userId: p.userId,
          nickname: p.user.nickname,
          joinedAt: p.joinedAt,
          status: p.status,
          rank: p.rank,
          passed: p.passed,
          evidenceUrl: p.evidenceUrl,
          judgedAt: p.judgedAt,
        })),
      },
    };
  }

  async submitEvidence(userId: number, challengeId: number, data: { evidenceUrl: string; comment?: string }) {
    const participant = await this.prisma.challengeParticipant.findUnique({
      where: { challengeId_userId: { challengeId, userId } },
    });
    if (!participant) throw new ForbiddenException('챌린지에 참여하지 않았습니다.');

    const updated = await this.prisma.challengeParticipant.update({
      where: { challengeId_userId: { challengeId, userId } },
      data: { evidenceUrl: data.evidenceUrl, status: 'SUBMITTED' },
    });
    return { message: '판정 자료가 제출됐습니다.', data: updated };
  }

  // ── 헬퍼 ─────────────────────────────────────────────────────────────────────

  private withCount(c: any, count: number) {
    const { _count, ...rest } = c;
    return { ...rest, participantCount: count };
  }

  private stripChallenge(p: any) {
    const { challenge, ...rest } = p;
    return rest;
  }

  /** 홈 대시보드용 내 활성 챌린지 */
  async getActiveChallengesForUser(userId: number) {
    const participants = await this.prisma.challengeParticipant.findMany({
      where: { userId, status: { in: ['JOINED', 'SUBMITTED'] } },
      include: {
        challenge: { include: { _count: { select: { participants: true } } } },
      },
      take: 3,
      orderBy: { joinedAt: 'desc' },
    });
    return participants.map(p => this.withCount(p.challenge, p.challenge._count.participants));
  }
}
