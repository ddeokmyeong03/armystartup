import { Controller, Get, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { CalendarService } from './calendar.service';

@ApiTags('Calendar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('weekly-summary')
  @ApiOperation({ summary: '주간 일정 마커' })
  @ApiQuery({ name: 'startDate', example: '2026-03-16' })
  weeklySummary(@CurrentUser() user: JwtPayload, @Query('startDate') startDate: string) {
    return this.calendarService.weeklySummary(user.userId, startDate);
  }

  @Get('monthly-summary')
  @ApiOperation({ summary: '월간 일정 마커' })
  @ApiQuery({ name: 'year', example: 2026 })
  @ApiQuery({ name: 'month', example: 3 })
  monthlySummary(
    @CurrentUser() user: JwtPayload,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.calendarService.monthlySummary(user.userId, year, month);
  }

  @Get('daily-detail')
  @ApiOperation({ summary: '날짜별 통합 조회' })
  @ApiQuery({ name: 'date', example: '2026-03-18' })
  dailyDetail(@CurrentUser() user: JwtPayload, @Query('date') date: string) {
    return this.calendarService.dailyDetail(user.userId, date);
  }
}
