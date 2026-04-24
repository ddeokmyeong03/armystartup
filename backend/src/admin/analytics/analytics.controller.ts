import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBasicAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AdminGuard } from '../guards/admin.guard';

@ApiTags('Admin Analytics')
@ApiBasicAuth()
@UseGuards(AdminGuard)
@Controller('admin/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'DAU, MAU, 상위 목표 카테고리 등 전체 현황' })
  getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('goals')
  @ApiOperation({ summary: '목표 카테고리별 분포, 완료율' })
  getGoals(@Query('branch') branch?: string) {
    return this.analyticsService.getGoalsAnalytics(branch);
  }

  @Get('courses')
  @ApiOperation({ summary: '강의 소스별 열람수, 추천 현황' })
  getCourses() {
    return this.analyticsService.getCoursesAnalytics();
  }

  @Get('fatigue')
  @ApiOperation({ summary: '근무 종류별 피로도 분포' })
  getFatigue() {
    return this.analyticsService.getFatigueAnalytics();
  }

  @Get('users')
  @ApiOperation({ summary: '계급/군종별 유저 분포 및 월별 가입' })
  getUsers() {
    return this.analyticsService.getUsersAnalytics();
  }
}
