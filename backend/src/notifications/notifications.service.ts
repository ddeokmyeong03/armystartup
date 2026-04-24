import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number) {
    const items = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return {
      message: '알림 목록을 조회했습니다.',
      data: { items, unreadCount: items.filter((n) => !n.isRead).length },
    };
  }

  async markAllRead(userId: number) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { message: '모든 알림을 읽음 처리했습니다.', data: null };
  }

  async markOneRead(userId: number, id: number) {
    await this.prisma.notification.updateMany({
      where: { userId, id },
      data: { isRead: true },
    });
    return { message: '알림을 읽음 처리했습니다.', data: null };
  }

  async create(userId: number, dto: CreateNotificationDto) {
    const n = await this.prisma.notification.create({
      data: { userId, ...dto },
    });
    return { message: '알림이 생성되었습니다.', data: n };
  }
}
