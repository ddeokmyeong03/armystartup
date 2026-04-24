import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(userId: number, dto: CreateScheduleDto) {
    const schedule = await this.prisma.schedule.create({ data: { userId, ...dto } as any });
    await this.notifications.autoCreate(userId, 'SCHEDULE', `'${schedule.title}' 일정이 추가되었습니다.`);
    return { message: '일정이 생성되었습니다.', data: schedule };
  }

  async findAll(userId: number) {
    const schedules = await this.prisma.schedule.findMany({
      where: { userId },
      orderBy: [{ scheduleDate: 'asc' }, { startTime: 'asc' }],
    });
    return { message: '일정 목록을 조회했습니다.', data: schedules };
  }

  async findByDate(userId: number, date: string) {
    const schedules = await this.prisma.schedule.findMany({
      where: { userId, scheduleDate: date },
      orderBy: { startTime: 'asc' },
    });
    return { message: `${date} 일정을 조회했습니다.`, data: schedules };
  }

  async findOne(userId: number, id: number) {
    const schedule = await this.prisma.schedule.findFirst({ where: { id, userId } });
    if (!schedule) throw new NotFoundException('일정을 찾을 수 없습니다.');
    return { message: '일정을 조회했습니다.', data: schedule };
  }

  async update(userId: number, id: number, dto: UpdateScheduleDto) {
    await this.findOne(userId, id);
    const schedule = await this.prisma.schedule.update({ where: { id }, data: dto as any });
    return { message: '일정이 수정되었습니다.', data: schedule };
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);
    await this.prisma.schedule.delete({ where: { id } });
    return { message: '일정이 삭제되었습니다.', data: null };
  }
}
