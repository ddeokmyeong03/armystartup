import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async checkEmail(email: string): Promise<{ available: boolean }> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    return { available: !existing };
  }

  async signup(dto: SignupDto): Promise<void> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('이미 사용 중인 이메일입니다.');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashed, nickname: dto.nickname },
    });

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
    if (!user || !user.password) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    if (!(await bcrypt.compare(dto.password, user.password))) {
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

  async findOrCreateSocialUser(socialProfile: {
    provider: string;
    socialId: string;
    email: string;
    nickname: string;
  }) {
    const { provider, socialId, email, nickname } = socialProfile;

    // 기존 소셜 계정 조회
    let user = await this.prisma.user.findFirst({
      where: { provider, socialId },
    });

    // 동일 이메일 기존 계정이 있으면 소셜 연결
    if (!user) {
      const byEmail = await this.prisma.user.findUnique({ where: { email } });
      if (byEmail) {
        user = await this.prisma.user.update({
          where: { id: byEmail.id },
          data: { provider, socialId },
        });
      }
    }

    // 신규 사용자 생성
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          nickname: nickname.slice(0, 20),
          password: null,
          provider,
          socialId,
        },
      });
      await this.prisma.userProfile.create({
        data: { userId: user.id } as any,
      });
    }

    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    return { accessToken, nickname: user.nickname };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('가입된 이메일이 아닙니다.');

    // 기존 미사용 토큰 무효화
    await (this.prisma as any).passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1시간

    await (this.prisma as any).passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    await this.mailService.sendPasswordResetEmail(email, token);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const record = await (this.prisma as any).passwordResetToken.findUnique({
      where: { token },
    });

    if (!record || record.used) throw new BadRequestException('유효하지 않은 토큰입니다.');
    if (new Date() > record.expiresAt) throw new BadRequestException('만료된 링크입니다. 다시 요청해주세요.');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    });

    await (this.prisma as any).passwordResetToken.update({
      where: { token },
      data: { used: true },
    });
  }
}
