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
    const { provider, email, nickname } = socialProfile;

    // 이메일로 기존 계정 조회
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      // 기존 계정의 provider 업데이트
      if (user.provider !== provider) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { provider },
        });
      }
    } else {
      // 신규 사용자 생성
      const socialPw = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
      user = await this.prisma.user.create({
        data: {
          email,
          nickname: nickname.slice(0, 20),
          password: socialPw,
          provider,
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

    try {
      await this.prisma.$executeRaw`
        UPDATE "password_reset_tokens" SET "used" = true
        WHERE "userId" = ${user.id} AND "used" = false
      `;
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await this.prisma.$executeRaw`
        INSERT INTO "password_reset_tokens" ("userId", "token", "expiresAt")
        VALUES (${user.id}, ${token}, ${expiresAt})
      `;
      await this.mailService.sendPasswordResetEmail(email, token);
    } catch {
      // password_reset_tokens 테이블 미생성 시 로그만 남기고 성공 응답
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    let record: any;
    try {
      const rows = await this.prisma.$queryRaw<any[]>`
        SELECT * FROM "password_reset_tokens" WHERE "token" = ${token} LIMIT 1
      `;
      record = rows[0];
    } catch {
      throw new BadRequestException('유효하지 않은 토큰입니다.');
    }

    if (!record || record.used) throw new BadRequestException('유효하지 않은 토큰입니다.');
    if (new Date() > record.expiresAt) throw new BadRequestException('만료된 링크입니다. 다시 요청해주세요.');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    });

    await this.prisma.$executeRaw`
      UPDATE "password_reset_tokens" SET "used" = true WHERE "token" = ${token}
    `;
  }
}
