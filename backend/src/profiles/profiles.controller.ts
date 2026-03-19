import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { ProfilesService } from './profiles.service';
import { UpsertProfileDto } from './dto/profile.dto';

@ApiTags('Profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @ApiOperation({ summary: '초기 설정 저장/수정 (upsert)' })
  upsert(@CurrentUser() user: JwtPayload, @Body() dto: UpsertProfileDto) {
    return this.profilesService.upsert(user.userId, dto);
  }

  @Get('me')
  @ApiOperation({ summary: '내 프로필 조회' })
  findMe(@CurrentUser() user: JwtPayload) {
    return this.profilesService.findMe(user.userId);
  }
}
