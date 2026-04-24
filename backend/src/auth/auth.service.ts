import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<void> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('이미 사용 중인 이메일입니다.');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashed, nickname: dto.nickname },
    });

    // 회원가입 시 UserProfile 자동 생성
    await this.prisma.userProfile.create({
      data: {
        userId: user.id,
        wakeUpTime: '06:30',
        sleepTime: '23:00',
        rankName: dto.rankName ?? null,
        branch: dto.branch ?? null,
        unitName: dto.unitName ?? null,
        enlistedAt: dto.enlistedAt ?? null,
        dischargeDate: dto.dischargeDate ?? null,
      } as any,
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const profile = await this.prisma.userProfile.findUnique({ where: { userId: user.id } });
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      message: '로그인이 완료되었습니다.',
      data: {
        accessToken,
        tokenType: 'Bearer',
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          role: user.role,
          rankName: (profile as any)?.rankName ?? null,
          branch: (profile as any)?.branch ?? null,
          unitName: profile?.unitName ?? null,
          enlistedAt: (profile as any)?.enlistedAt ?? null,
          dischargeDate: profile?.dischargeDate ?? null,
        },
      },
    };
  }
}
