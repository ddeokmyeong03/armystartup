import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecordDto } from './dto/create-record.dto';

@Injectable()
export class RecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateRecordDto) {
    const record = await this.prisma.record.create({
      data: {
        userId,
        category: dto.category,
        title: dto.title,
        content: dto.content,
        recordDate: dto.recordDate,
        evidenceUrl: dto.evidenceUrl,
        verified: !!dto.evidenceUrl,
        meta: dto.meta ? JSON.stringify(dto.meta) : '{}',
      },
    });
    return { message: '기록이 생성됐습니다.', data: this.parseRecord(record) };
  }

  async findAll(userId: number, category?: string) {
    const records = await this.prisma.record.findMany({
      where: { userId, ...(category ? { category } : {}) },
      orderBy: [{ recordDate: 'desc' }, { createdAt: 'desc' }],
    });
    return { message: '기록 목록입니다.', data: records.map(r => this.parseRecord(r)) };
  }

  async findOne(userId: number, id: number) {
    const record = await this.prisma.record.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('기록을 찾을 수 없습니다.');
    if (record.userId !== userId) throw new ForbiddenException();
    return { message: '기록 상세입니다.', data: this.parseRecord(record) };
  }

  async update(userId: number, id: number, dto: Partial<CreateRecordDto>) {
    const record = await this.prisma.record.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('기록을 찾을 수 없습니다.');
    if (record.userId !== userId) throw new ForbiddenException();

    const updated = await this.prisma.record.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.recordDate !== undefined && { recordDate: dto.recordDate }),
        ...(dto.evidenceUrl !== undefined && { evidenceUrl: dto.evidenceUrl, verified: !!dto.evidenceUrl }),
        ...(dto.meta !== undefined && { meta: JSON.stringify(dto.meta) }),
      },
    });
    return { message: '기록이 수정됐습니다.', data: this.parseRecord(updated) };
  }

  async remove(userId: number, id: number) {
    const record = await this.prisma.record.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('기록을 찾을 수 없습니다.');
    if (record.userId !== userId) throw new ForbiddenException();
    await this.prisma.record.delete({ where: { id } });
    return { message: '기록이 삭제됐습니다.', data: null };
  }

  /** 카테고리별 집계 */
  async stats(userId: number): Promise<Record<string, number>> {
    const groups = await this.prisma.record.groupBy({
      by: ['category'],
      where: { userId },
      _count: { id: true },
    });
    const result: Record<string, number> = {};
    for (const g of groups) result[g.category] = g._count.id;
    return result;
  }

  private parseRecord(r: any) {
    return {
      ...r,
      meta: typeof r.meta === 'string' ? JSON.parse(r.meta) : r.meta,
    };
  }
}
