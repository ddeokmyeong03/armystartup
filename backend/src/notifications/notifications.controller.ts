import { Controller, Get, Post, Patch, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: '알림 목록 조회' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.notificationsService.findAll(user.userId);
  }

  @Patch('read-all')
  @ApiOperation({ summary: '모든 알림 읽음 처리' })
  markAllRead(@CurrentUser() user: JwtPayload) {
    return this.notificationsService.markAllRead(user.userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: '특정 알림 읽음 처리' })
  markOneRead(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markOneRead(user.userId, id);
  }
}
