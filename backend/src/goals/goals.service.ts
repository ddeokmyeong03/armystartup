import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(userId: number, dto: CreateGoalDto) {
    const goal = await this.prisma.goal.create({ data: { userId, isActive: true, ...dto } as any });
    await this.notifications.autoCreate(userId, 'GOAL', `새 목표 '${goal.title}'이 생성되었습니다.`);
    return { message: '목표가 생성되었습니다.', data: goal };
  }

  async findAll(userId: number) {
    const goals = await this.prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    return { message: '목표 목록을 조회했습니다.', data: goals };
  }

  async findOne(userId: number, id: number) {
    const goal = await this.prisma.goal.findFirst({ where: { id, userId } });
    if (!goal) throw new NotFoundException('목표를 찾을 수 없습니다.');
    return { message: '목표를 조회했습니다.', data: goal };
  }

  async update(userId: number, id: number, dto: UpdateGoalDto) {
    const existing = await this.findOne(userId, id);
    const cleanDto = Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined));
    const goal = await this.prisma.goal.update({ where: { id }, data: cleanDto as any });
    if ((dto.progressPercent === 100) && (existing.data as any).progressPercent !== 100) {
      await this.notifications.autoCreate(userId, 'GOAL', `목표 '${goal.title}'를 달성했습니다!`);
    }
    return { message: '목표가 수정되었습니다.', data: goal };
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);
    await this.prisma.goal.delete({ where: { id } });
    return { message: '목표가 삭제되었습니다.', data: null };
  }

  async findActive(userId: number) {
    const goals = await this.prisma.goal.findMany({ where: { userId, isActive: true } });
    return goals;
  }
}
