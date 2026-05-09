import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { NaverStrategy } from './strategies/naver.strategy';
import { AppleAuthStrategy } from './strategies/apple.strategy';
import { MailService } from '../mail/mail.service';

// 환경변수가 설정된 경우에만 해당 소셜 전략을 등록
const socialProviders = [
  ...(process.env.GOOGLE_CLIENT_ID ? [GoogleStrategy] : []),
  ...(process.env.KAKAO_CLIENT_ID ? [KakaoStrategy] : []),
  ...(process.env.NAVER_CLIENT_ID ? [NaverStrategy] : []),
  ...(process.env.APPLE_CLIENT_ID ? [AppleAuthStrategy] : []),
];

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'fallback-secret',
      signOptions: { expiresIn: parseInt(process.env.JWT_EXPIRATION ?? '3600') },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    MailService,
    ...socialProviders,
  ],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
