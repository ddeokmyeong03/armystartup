import {
  Controller, Post, Body, HttpCode, HttpStatus,
  Get, UseGuards, Req, Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

const FRONTEND_URL = () =>
  (process.env.FRONTEND_URL ?? 'https://millog.co.kr').split(',')[0];

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  async signup(@Body() dto: SignupDto) {
    await this.authService.signup(dto);
    return { message: '회원가입이 완료되었습니다.', data: null };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인 (JWT 발급)' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ── 비밀번호 찾기 ──────────────────────────────────────────────────────────

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '비밀번호 재설정 이메일 발송' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    return { message: '재설정 이메일을 발송했습니다.', data: null };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '비밀번호 재설정' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.newPassword);
    return { message: '비밀번호가 변경되었습니다.', data: null };
  }

  // ── 소셜 로그인: Google ────────────────────────────────────────────────────

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth 시작' })
  googleAuth() { /* passport redirects */ }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: any) {
    const { accessToken, nickname } = await this.authService.findOrCreateSocialUser(req.user);
    res.redirect(`${FRONTEND_URL()}/auth/callback?token=${accessToken}&nickname=${encodeURIComponent(nickname)}`);
  }

  // ── 소셜 로그인: 카카오 ───────────────────────────────────────────────────

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: '카카오 OAuth 시작' })
  kakaoAuth() { /* passport redirects */ }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@Req() req: any, @Res() res: any) {
    const { accessToken, nickname } = await this.authService.findOrCreateSocialUser(req.user);
    res.redirect(`${FRONTEND_URL()}/auth/callback?token=${accessToken}&nickname=${encodeURIComponent(nickname)}`);
  }

  // ── 소셜 로그인: 네이버 ───────────────────────────────────────────────────

  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  @ApiOperation({ summary: '네이버 OAuth 시작' })
  naverAuth() { /* passport redirects */ }

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverCallback(@Req() req: any, @Res() res: any) {
    const { accessToken, nickname } = await this.authService.findOrCreateSocialUser(req.user);
    res.redirect(`${FRONTEND_URL()}/auth/callback?token=${accessToken}&nickname=${encodeURIComponent(nickname)}`);
  }

  // ── 소셜 로그인: Apple ────────────────────────────────────────────────────

  @Post('apple/callback')
  @UseGuards(AuthGuard('apple'))
  async appleCallback(@Req() req: any, @Res() res: any) {
    const { accessToken, nickname } = await this.authService.findOrCreateSocialUser(req.user);
    res.redirect(`${FRONTEND_URL()}/auth/callback?token=${accessToken}&nickname=${encodeURIComponent(nickname)}`);
  }
}
