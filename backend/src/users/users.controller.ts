import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: '내 정보 조회' })
  getMe(@CurrentUser() user: JwtPayload) {
    return this.usersService.findMe(user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: '내 정보 수정' })
  updateMe(@CurrentUser() user: JwtPayload, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(user.userId, dto);
  }
}
