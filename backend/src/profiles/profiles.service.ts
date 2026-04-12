import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(userId: number, dto: UpsertProfileDto) {
    const data = {
      ...dto,
      preferredPlanIntensity: dto.preferredPlanIntensity as string | undefined,
    };
    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
    return { message: '프로필이 저장되었습니다.', data: profile };
  }

  async findMe(userId: number) {
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    return { message: '프로필을 조회했습니다.', data: profile };
  }
}
