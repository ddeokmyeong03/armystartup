import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto, ChangePasswordDto } from './dto/update-user.dto';

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

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    if (!(await bcrypt.compare(dto.currentPassword, user.password))) {
      throw new UnauthorizedException('현재 비밀번호가 올바르지 않습니다.');
    }
    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    return { message: '비밀번호가 변경되었습니다.', data: null };
  }
}
