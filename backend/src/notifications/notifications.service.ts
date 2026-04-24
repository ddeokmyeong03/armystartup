import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/notification.dto';

type NotificationRow = {
  id: number;
  userId: number;
  type: string;
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
};

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number) {
    const items = await this.prisma.$queryRaw<NotificationRow[]>`
      SELECT id, "userId", type, title, body, link, "isRead", "createdAt"
      FROM notifications
      WHERE "userId" = ${userId}
      ORDER BY "createdAt" DESC
      LIMIT 50
    `;
    const unreadCount = items.filter(n => !n.isRead).length;
    return {
      message: '알림 목록을 조회했습니다.',
      data: { items, unreadCount },
    };
  }

  async markAllRead(userId: number) {
    await this.prisma.$executeRaw`
      UPDATE notifications SET "isRead" = true
      WHERE "userId" = ${userId} AND "isRead" = false
    `;
    return { message: '모든 알림을 읽음 처리했습니다.', data: null };
  }

  async markOneRead(userId: number, id: number) {
    await this.prisma.$executeRaw`
      UPDATE notifications SET "isRead" = true
      WHERE "userId" = ${userId} AND id = ${id}
    `;
    return { message: '알림을 읽음 처리했습니다.', data: null };
  }

  async create(userId: number, dto: CreateNotificationDto) {
    const rows = await this.prisma.$queryRaw<NotificationRow[]>`
      INSERT INTO notifications ("userId", type, title, body, link, "isRead", "createdAt")
      VALUES (${userId}, ${dto.type}, ${dto.title}, ${dto.body}, ${dto.link ?? null}, false, NOW())
      RETURNING id, "userId", type, title, body, link, "isRead", "createdAt"
    `;
    return { message: '알림이 생성되었습니다.', data: rows[0] };
  }

  async autoCreate(userId: number, type: string, body: string, title = '밀로그 알림') {
    try {
      await this.prisma.$executeRaw`
        INSERT INTO notifications ("userId", type, title, body, "isRead", "createdAt")
        VALUES (${userId}, ${type}, ${title}, ${body}, false, NOW())
      `;
    } catch {
      // 알림 생성 실패는 무시 (핵심 기능 방해 방지)
    }
  }
}
