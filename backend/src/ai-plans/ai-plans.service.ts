import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecommendAiPlanDto } from './dto/recommend.dto';
import { BatchApplyDto } from './dto/batch-apply.dto';
import { AdjustPlanDto } from './dto/adjust-plan.dto';

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
function toTimeString(minutes: number): string {
  return `${Math.floor(minutes / 60).toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}`;
}

@Injectable()
export class AiPlansService {
  constructor(private readonly prisma: PrismaService) {}

  async recommend(userId: number, dto: RecommendAiPlanDto) {
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    const wakeUp = toMinutes(profile?.wakeUpTime ?? '07:00') + 30;
    const sleep = toMinutes(profile?.sleepTime ?? '23:00') - 60;

    const schedules = await this.prisma.schedule.findMany({
      where: { userId, scheduleDate: dto.targetDate },
      orderBy: { startTime: 'asc' },
    });

    const busy = schedules.map((s) => ({ s: toMinutes(s.startTime), e: toMinutes(s.endTime) }));
    const freeSlots: { start: number; end: number }[] = [];
    let cursor = wakeUp;
    for (const b of busy) {
      if (cursor < b.s && b.s - cursor >= 30) freeSlots.push({ start: cursor, end: b.s });
      cursor = Math.max(cursor, b.e);
    }
    if (cursor < sleep && sleep - cursor >= 30) freeSlots.push({ start: cursor, end: sleep });

    const goals = await this.prisma.goal.findMany({
      where: { id: { in: dto.goalIds }, userId },
    });

    const plans: any[] = [];
    let slotIdx = 0;
    for (const goal of goals.slice(0, 3)) {
      if (slotIdx >= freeSlots.length) break;
      const slot = freeSlots[slotIdx++];
      const duration = Math.min(goal.preferredMinutesPerSession, slot.end - slot.start);
      if (duration < 20) continue;
      plans.push({
        userId,
        goalId: goal.id,
        activityTitle: `${goal.title} 자기개발`,
        recommendedDate: dto.targetDate,
        startTime: toTimeString(slot.start),
        endTime: toTimeString(slot.start + duration),
      });
    }

    const created = await this.prisma.$transaction(plans.map((p) => this.prisma.aiPlan.create({ data: p })));
    return { message: `AI 계획이 ${created.length}개 추천되었습니다.`, data: created };
  }

  async findAll(userId: number) {
    const plans = await this.prisma.aiPlan.findMany({ where: { userId }, orderBy: { recommendedDate: 'desc' } });
    return { message: '추천 계획 목록을 조회했습니다.', data: plans };
  }

  async findOne(userId: number, id: number) {
    const plan = await this.prisma.aiPlan.findFirst({ where: { id, userId } });
    if (!plan) throw new NotFoundException('계획을 찾을 수 없습니다.');
    return { message: '추천 계획을 조회했습니다.', data: plan };
  }

  async apply(userId: number, id: number) {
    await this.findOne(userId, id);
    const plan = await this.prisma.aiPlan.update({ where: { id }, data: { status: 'APPLIED' } });
    return { message: '계획이 적용되었습니다.', data: plan };
  }

  async adjust(userId: number, id: number, dto: AdjustPlanDto) {
    await this.findOne(userId, id);
    const plan = await this.prisma.aiPlan.update({ where: { id }, data: { ...dto, sourceType: 'MANUAL_ADJUSTED' } });
    return { message: '계획 시간이 조정되었습니다.', data: plan };
  }

  async batchApply(userId: number, dto: BatchApplyDto) {
    const result = await this.prisma.aiPlan.updateMany({
      where: { id: { in: dto.planIds }, userId, status: 'RECOMMENDED' },
      data: { status: 'APPLIED' },
    });
    return { message: `${result.count}개의 계획이 적용되었습니다.`, data: null };
  }

  async complete(userId: number, id: number) {
    await this.findOne(userId, id);
    const plan = await this.prisma.aiPlan.update({ where: { id }, data: { status: 'COMPLETED' } });
    return { message: '계획을 완료 처리했습니다.', data: plan };
  }

  async miss(userId: number, id: number) {
    await this.findOne(userId, id);
    const plan = await this.prisma.aiPlan.update({ where: { id }, data: { status: 'MISSED' } });
    return { message: '계획을 미완료 처리했습니다.', data: plan };
  }
}
