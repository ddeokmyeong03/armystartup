import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, nickname: true, phoneNumber: true, role: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    return { message: '내 정보를 조회했습니다.', data: user };
  }

  async updateMe(userId: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: { id: true, email: true, nickname: true, phoneNumber: true, role: true },
    });
    return { message: '내 정보가 수정되었습니다.', data: user };
  }
}
