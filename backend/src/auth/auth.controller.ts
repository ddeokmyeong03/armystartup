import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

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
}
